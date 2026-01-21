/**
 * Lambda getOrders - GET /admin/orders
 * Liste toutes les commandes avec pagination et filtres
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminAuth } from '../../services/adminAuth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface OrderSummary {
  orderId: string;
  createdAt: number;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dossiersSummary: {
    shipping?: string;
    admin_enedis?: string;
    admin_consuel?: string;
    installation?: string;
  };
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification admin
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const isValid = verifyAdminAuth(authHeader);

    if (!isValid) {
      return formatJSONResponse(401, {
        message: 'Authentification requise',
      });
    }

    // Récupérer les paramètres de requête
    const queryParams = event.queryStringParameters || {};
    const search = queryParams.search?.toLowerCase();
    const statusFilter = queryParams.status;
    const limit = parseInt(queryParams.limit || '50', 10);
    const lastKey = queryParams.lastKey
      ? JSON.parse(decodeURIComponent(queryParams.lastKey))
      : undefined;

    // Scanner toutes les commandes
    const ordersResult = await dynamoDb.send(
      new ScanCommand({
        TableName: Tables.ORDERS,
        Limit: limit * 2, // Récupérer plus pour filtrer ensuite
        ExclusiveStartKey: lastKey,
      })
    );

    let orders = ordersResult.Items || [];

    // Appliquer le filtre de statut
    if (statusFilter) {
      orders = orders.filter((o) => o.status === statusFilter);
    }

    // Appliquer le filtre de recherche
    if (search) {
      orders = orders.filter((o) => {
        const firstName = (o.shippingAddress?.firstName || '').toLowerCase();
        const lastName = (o.shippingAddress?.lastName || '').toLowerCase();
        const email = (o.shippingAddress?.email || '').toLowerCase();
        const orderId = (o.orderId || '').toLowerCase();

        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          email.includes(search) ||
          orderId.includes(search)
        );
      });
    }

    // Trier par date de création (plus récent en premier)
    orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Limiter les résultats
    orders = orders.slice(0, limit);

    // Récupérer les dossiers pour chaque commande
    const orderSummaries: OrderSummary[] = await Promise.all(
      orders.map(async (order) => {
        // Récupérer les dossiers de cette commande
        const dossiersResult = await dynamoDb.send(
          new QueryCommand({
            TableName: Tables.ORDER_DOSSIERS,
            KeyConditionExpression: 'orderId = :orderId',
            ExpressionAttributeValues: {
              ':orderId': order.orderId,
            },
          })
        );

        const dossiers = dossiersResult.Items || [];

        // Créer le résumé des dossiers
        const dossiersSummary: OrderSummary['dossiersSummary'] = {};
        for (const dossier of dossiers) {
          dossiersSummary[dossier.type as keyof typeof dossiersSummary] =
            dossier.status;
        }

        return {
          orderId: order.orderId,
          createdAt: order.createdAt,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount || 0,
          shippingAddress: {
            firstName: order.shippingAddress?.firstName || '',
            lastName: order.shippingAddress?.lastName || '',
            email: order.shippingAddress?.email || '',
            phone: order.shippingAddress?.phone || '',
          },
          dossiersSummary,
        };
      })
    );

    return formatJSONResponse(200, {
      orders: orderSummaries,
      lastKey: ordersResult.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(ordersResult.LastEvaluatedKey))
        : undefined,
    });
  } catch (error: any) {
    console.error('Error getting admin orders:', error);

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des commandes',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
