/**
 * Lambda deleteDocument - DELETE /orders/{orderId}/documents/{documentId}
 * Supprime le fichier S3 et les métadonnées DynamoDB
 * Requirements: 6.4
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { getDocument, deleteDocumentRecord } from '../../services/dossierService';
import { deleteFile } from '../../services/documentStorageService';

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
    const documentId = event.pathParameters?.documentId;

    if (!orderId || !documentId) {
      return formatJSONResponse(400, {
        message: 'orderId et documentId sont requis',
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

    // Récupérer le document
    const document = await getDocument(documentId);
    if (!document) {
      return formatJSONResponse(404, {
        message: 'Document non trouvé',
      });
    }

    // Vérifier que le document appartient à cette commande
    if (document.orderId !== orderId) {
      return formatJSONResponse(403, {
        message: 'Ce document n\'appartient pas à cette commande',
      });
    }

    // Supprimer le fichier S3
    await deleteFile(document.s3Key);

    // Supprimer les métadonnées DynamoDB
    await deleteDocumentRecord(documentId, document.dossierId);

    return formatJSONResponse(200, {
      message: 'Document supprimé avec succès',
      documentId,
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la suppression du document',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
