/**
 * Lambda getUploadUrl - POST /orders/{orderId}/documents/upload-url
 * Génère une URL pré-signée PUT valide 15 minutes
 * Valide le type de fichier et la taille déclarée
 * Requirements: 6.2, 6.5
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';
import {
  generateUploadUrl,
  validateFile,
  DocumentStorageConfig,
} from '../../services/documentStorageService';

interface UploadUrlRequest {
  dossierType: string;
  fileName: string;
  contentType: string;
  size: number;
}

const VALID_DOSSIER_TYPES = [
  'shipping',
  'enedis',
  'consuel',
  'installation_vt',
  'installation_reports',
];

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

    // Parser le body
    let body: UploadUrlRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return formatJSONResponse(400, {
        message: 'Body JSON invalide',
      });
    }

    // Valider les champs requis
    if (!body.dossierType || !body.fileName || !body.contentType || !body.size) {
      return formatJSONResponse(400, {
        message: 'dossierType, fileName, contentType et size sont requis',
      });
    }

    // Valider le type de dossier
    if (!VALID_DOSSIER_TYPES.includes(body.dossierType)) {
      return formatJSONResponse(400, {
        code: 'INVALID_DOSSIER_TYPE',
        message: `Type de dossier invalide. Types autorisés: ${VALID_DOSSIER_TYPES.join(', ')}`,
      });
    }

    // Valider le fichier (type, extension, taille)
    const validation = validateFile(body.fileName, body.contentType, body.size);
    if (!validation.valid) {
      return formatJSONResponse(400, {
        code: validation.error?.includes('taille') ? 'UPLOAD_SIZE_EXCEEDED' : 'INVALID_FILE_TYPE',
        message: validation.error,
        maxSize: DocumentStorageConfig.MAX_FILE_SIZE_MB,
        allowedTypes: DocumentStorageConfig.ALLOWED_EXTENSIONS,
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

    // Générer l'URL pré-signée
    const documentId = uuidv4();
    const uploadResult = await generateUploadUrl(
      userId,
      orderId,
      body.dossierType,
      body.fileName,
      body.contentType,
      body.size
    );

    return formatJSONResponse(200, {
      uploadUrl: uploadResult.uploadUrl,
      documentId,
      s3Key: uploadResult.s3Key,
      expiresIn: uploadResult.expiresIn,
    });
  } catch (error: any) {
    console.error('Error generating upload URL:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la génération de l\'URL d\'upload',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
