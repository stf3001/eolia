import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { createDossiersForOrder } from '../../services/dossierService';
import { ProductCategory, isPhysicalProduct } from '../../models/product';
import { DossierType, DossierStatus, ShippingStatus, AdminStatus, InstallationStatus } from '../../models/dossier';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  powerKwc?: number;
  category?: ProductCategory;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country?: string;
}

interface InstallationDetails {
  installationType: 'mono' | 'tri';
  meterPower: number;
  tgbtDistance: '<30m' | '30-60m' | '60-100m';
  postalCode: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  type: 'standard' | 'anemometer_loan';
  shippingAddress: ShippingAddress;
  installationDetails?: InstallationDetails;
  paymentIntentId: string;
  affiliateCode?: string;
}

/**
 * Détermine les dossiers à créer en fonction des catégories de produits
 * Requirements: 1.1, 1.2, 1.3, 1.4, 10.3
 */
function determineDossiersToCreate(
  items: OrderItem[]
): Array<{ type: DossierType; status: DossierStatus; metadata?: Record<string, unknown> }> {
  const dossierConfigs: Array<{ type: DossierType; status: DossierStatus; metadata?: Record<string, unknown> }> = [];
  const addedTypes = new Set<DossierType>();

  for (const item of items) {
    if (!item.category) continue;

    // Produits physiques (turbine, inverter, accessory) -> dossier shipping
    if (isPhysicalProduct(item.category) && !addedTypes.has('shipping')) {
      dossierConfigs.push({
        type: 'shipping',
        status: 'received' as ShippingStatus,
      });
      addedTypes.add('shipping');
    }

    // Forfait administratif -> dossiers admin_enedis et admin_consuel
    if (item.category === 'administrative') {
      if (!addedTypes.has('admin_enedis')) {
        dossierConfigs.push({
          type: 'admin_enedis',
          status: 'not_started' as AdminStatus,
        });
        addedTypes.add('admin_enedis');
      }
      if (!addedTypes.has('admin_consuel')) {
        dossierConfigs.push({
          type: 'admin_consuel',
          status: 'not_started' as AdminStatus,
        });
        addedTypes.add('admin_consuel');
      }
    }

    // Forfait installation -> dossier installation
    if (item.category === 'installation' && !addedTypes.has('installation')) {
      dossierConfigs.push({
        type: 'installation',
        status: 'vt_pending' as InstallationStatus,
      });
      addedTypes.add('installation');
    }
  }

  return dossierConfigs;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Auth is optional for guest checkout
    let userId: string | undefined;
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    
    if (authHeader) {
      try {
        const claims = await verifyAuth(authHeader);
        userId = claims.sub;
      } catch {
        // Guest checkout allowed
      }
    }

    if (!event.body) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Request body is required',
      });
    }

    const body: CreateOrderRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.type || !['standard', 'anemometer_loan'].includes(body.type)) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Invalid order type. Expected: standard or anemometer_loan',
      });
    }

    if (!body.paymentIntentId) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Payment intent ID is required',
      });
    }

    if (!body.shippingAddress?.email || !body.shippingAddress?.firstName || 
        !body.shippingAddress?.lastName || !body.shippingAddress?.addressLine1 ||
        !body.shippingAddress?.postalCode || !body.shippingAddress?.city ||
        !body.shippingAddress?.phone) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Complete shipping address is required',
      });
    }

    // Validate items for standard orders
    if (body.type === 'standard') {
      if (!body.items || body.items.length === 0) {
        return formatJSONResponse(400, {
          error: 'VALIDATION_ERROR',
          message: 'Order items are required for standard orders',
        });
      }

      // Check total kWc doesn't exceed 36
      const totalKwc = body.items.reduce((sum, item) => {
        return sum + (item.powerKwc || 0) * item.quantity;
      }, 0);

      if (totalKwc > 36) {
        return formatJSONResponse(400, {
          error: 'LIMIT_EXCEEDED',
          message: 'La puissance totale dépasse 36 kWc. Veuillez nous contacter.',
        });
      }
    }

    const orderId = uuidv4();
    const createdAt = Date.now();

    const order: Record<string, any> = {
      orderId,
      createdAt,
      userId: userId || `guest_${body.shippingAddress.email}`,
      type: body.type,
      status: 'pending',
      totalAmount: body.totalAmount,
      shippingAddress: {
        ...body.shippingAddress,
        country: body.shippingAddress.country || 'France',
      },
      paymentIntentId: body.paymentIntentId,
      suspensiveConditions: 'Commande suspensive à validation technique et accord mairie si nécessaire',
    };

    if (body.type === 'standard') {
      order.items = body.items;
      if (body.installationDetails) {
        order.installationDetails = body.installationDetails;
      }
    } else if (body.type === 'anemometer_loan') {
      order.loanDetails = {
        loanDuration: 30,
        cautionAmount: 100,
        prepaidReturnIncluded: true,
      };
    }

    if (body.affiliateCode) {
      order.affiliateCode = body.affiliateCode;
    }

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.ORDERS,
        Item: order,
      })
    );

    // Créer automatiquement les dossiers de suivi selon les catégories de produits
    // Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.3
    if (body.type === 'standard' && body.items && body.items.length > 0) {
      try {
        const dossierConfigs = determineDossiersToCreate(body.items);
        if (dossierConfigs.length > 0) {
          await createDossiersForOrder(orderId, dossierConfigs);
        }
      } catch (dossierError) {
        // Log l'erreur mais ne bloque pas la création de commande
        console.error('Error creating dossiers for order:', dossierError);
      }
    }

    return formatJSONResponse(201, { order });
  } catch (error: any) {
    console.error('Error creating order:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la création de la commande',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
