/**
 * Lambda getOrderDetail - GET /admin/orders/:orderId
 * Récupère le détail complet d'une commande avec dossiers, documents et notes
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminAuth } from '../../services/adminAuth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import {
  getDossiersByOrderId,
  getDossierEvents,
  getDocumentsByOrderId,
} from '../../services/dossierService';

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

    // Récupérer l'orderId depuis les path parameters
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      return formatJSONResponse(400, {
        message: 'orderId est requis',
      });
    }

    // Récupérer la commande
    const orderResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.ORDERS,
        KeyConditionExpression: 'orderId = :orderId',
        ExpressionAttributeValues: {
          ':orderId': orderId,
        },
        Limit: 1,
      })
    );

    const order = orderResult.Items?.[0];
    if (!order) {
      return formatJSONResponse(404, {
        message: 'Commande non trouvée',
      });
    }

    // Récupérer les dossiers
    const dossiers = await getDossiersByOrderId(orderId);

    // Récupérer les événements pour chaque dossier
    const dossiersWithEvents = await Promise.all(
      dossiers.map(async (dossier) => {
        const events = await getDossierEvents(dossier.dossierId);
        return {
          ...dossier,
          events,
        };
      })
    );

    // Récupérer les documents
    const documents = await getDocumentsByOrderId(orderId);

    // Récupérer les notes admin (stockées dans les métadonnées de la commande)
    const notes = order.adminNotes || [];

    return formatJSONResponse(200, {
      order,
      dossiers: dossiersWithEvents,
      documents,
      notes,
    });
  } catch (error: any) {
    console.error('Error getting order detail:', error);

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération du détail de la commande',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
