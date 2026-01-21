/**
 * Lambda getDossierEvents - GET /orders/{orderId}/dossiers/{dossierId}/events
 * Retourne l'historique des événements (timeline)
 * Requirements: 2.3, 8.3
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { getDossier, getDossierEvents } from '../../services/dossierService';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    // Récupérer les path parameters
    const orderId = event.pathParameters?.orderId;
    const dossierId = event.pathParameters?.dossierId;

    if (!orderId || !dossierId) {
      return formatJSONResponse(400, {
        message: 'orderId et dossierId sont requis',
      });
    }

    // Vérifier que la commande appartient à l'utilisateur
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

    if (order.userId !== userId) {
      return formatJSONResponse(403, {
        message: 'Accès non autorisé à cette commande',
      });
    }

    // Vérifier que le dossier existe et appartient à cette commande
    const dossier = await getDossier(orderId, dossierId);
    if (!dossier) {
      return formatJSONResponse(404, {
        message: 'Dossier non trouvé',
      });
    }

    // Récupérer l'historique des événements
    const events = await getDossierEvents(dossierId);

    return formatJSONResponse(200, { events });
  } catch (error: any) {
    console.error('Error getting dossier events:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des événements',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
