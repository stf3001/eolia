/**
 * Lambda getDossierDetail - GET /orders/{orderId}/dossiers/{dossierId}
 * Retourne le détail d'un dossier avec son historique
 * Requirements: 2.1, 3.2, 4.1
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

    // Récupérer le dossier
    const dossier = await getDossier(orderId, dossierId);
    if (!dossier) {
      return formatJSONResponse(404, {
        message: 'Dossier non trouvé',
      });
    }

    // Récupérer l'historique des événements
    const events = await getDossierEvents(dossierId);

    return formatJSONResponse(200, {
      dossier,
      events,
    });
  } catch (error: any) {
    console.error('Error getting dossier detail:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération du dossier',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
