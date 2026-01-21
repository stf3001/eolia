/**
 * Lambda getDocuments - GET /orders/{orderId}/documents
 * Retourne les documents d'une commande avec URLs pré-signées de téléchargement
 * Filtrage optionnel par dossierType
 * Requirements: 6.2, 6.4
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { getDocumentsByOrderId } from '../../services/dossierService';
import { generateDownloadUrl } from '../../services/documentStorageService';
import { DossierDocument } from '../../models/dossier';

interface DocumentWithUrl extends DossierDocument {
  downloadUrl: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    // Récupérer l'orderId depuis les path parameters
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      return formatJSONResponse(400, {
        message: 'orderId est requis',
      });
    }

    // Récupérer le filtre dossierType optionnel
    const dossierType = event.queryStringParameters?.dossierType;

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

    // Récupérer tous les documents de la commande
    let documents = await getDocumentsByOrderId(orderId);

    // Filtrer par dossierType si spécifié
    if (dossierType) {
      documents = documents.filter((doc) => {
        // Le s3Key contient le dossierType dans le chemin
        // Format: clients/{clientId}/orders/{orderId}/{dossierType}/{fileName}
        const pathParts = doc.s3Key.split('/');
        const docDossierType = pathParts[4]; // Index 4 = dossierType
        return docDossierType === dossierType;
      });
    }

    // Générer les URLs pré-signées pour chaque document
    const documentsWithUrls: DocumentWithUrl[] = await Promise.all(
      documents.map(async (doc) => {
        const { downloadUrl } = await generateDownloadUrl(doc.s3Key);
        return {
          ...doc,
          downloadUrl,
        };
      })
    );

    return formatJSONResponse(200, { documents: documentsWithUrls });
  } catch (error: any) {
    console.error('Error getting documents:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des documents',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
