import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  powerKwc?: number;
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
