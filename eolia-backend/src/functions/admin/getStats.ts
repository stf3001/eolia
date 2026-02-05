/**
 * Lambda getStats - GET /admin/stats
 * Récupère les KPIs du dashboard admin
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminAuth } from '../../services/adminAuth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface AdminStats {
  confirmedOrders: number;
  pendingInstallations: number;
  pendingEnedis: number;
  pendingConsuel: number;
  totalOrders: number;
  totalRevenue: number;
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

    // Scanner les commandes pour les KPIs
    const ordersResult = await dynamoDb.send(
      new ScanCommand({
        TableName: Tables.ORDERS,
        ProjectionExpression: 'orderId, #status, totalAmount',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
      })
    );

    const orders = ordersResult.Items || [];

    // Scanner les dossiers pour les KPIs
    const dossiersResult = await dynamoDb.send(
      new ScanCommand({
        TableName: Tables.ORDER_DOSSIERS,
        ProjectionExpression: '#type, #status',
        ExpressionAttributeNames: {
          '#type': 'type',
          '#status': 'status',
        },
      })
    );

    const dossiers = dossiersResult.Items || [];

    // Calculer les KPIs
    const stats: AdminStats = {
      // Commandes payées à traiter (status = confirmed)
      confirmedOrders: orders.filter((o) => o.status === 'confirmed').length,

      // Installations en attente (vt_pending ou awaiting_be)
      pendingInstallations: dossiers.filter(
        (d) =>
          d.type === 'installation' &&
          (d.status === 'vt_pending' || d.status === 'awaiting_be')
      ).length,

      // Enedis en attente (not_started ou in_progress)
      pendingEnedis: dossiers.filter(
        (d) =>
          d.type === 'admin_enedis' &&
          (d.status === 'not_started' || d.status === 'in_progress')
      ).length,

      // Consuel en attente (not_started ou in_progress)
      pendingConsuel: dossiers.filter(
        (d) =>
          d.type === 'admin_consuel' &&
          (d.status === 'not_started' || d.status === 'in_progress')
      ).length,

      // Total des commandes
      totalOrders: orders.length,

      // Revenu total
      totalRevenue: orders.reduce(
        (sum, o) => sum + (o.totalAmount || 0),
        0
      ),
    };

    return formatJSONResponse(200, stats);
  } catch (error: any) {
    console.error('Error getting admin stats:', error);

    // En dev, retourner des données mock si DynamoDB n'est pas disponible
    if (process.env.STAGE === 'dev' && error.name === 'ResourceNotFoundException') {
      return formatJSONResponse(200, {
        confirmedOrders: 3,
        pendingInstallations: 2,
        pendingEnedis: 1,
        pendingConsuel: 1,
        totalOrders: 12,
        totalRevenue: 4500000, // 45 000 €
      });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
