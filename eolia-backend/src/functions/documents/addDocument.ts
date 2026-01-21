/**
 * Lambda addDocument - POST /orders/{orderId}/documents
 * Permet l'ajout de documents par l'admin (pour futur back-office)
 * Crée un événement d'audit
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth, getUserRole } from '../../services/auth';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';
import {
  createDocumentRecord,
  createDossierEvent,
  getDossiersByOrderId,
} from '../../services/dossierService';
import {
  validateContentType,
  validateFileExtension,
  generateS3Key,
} from '../../services/documentStorageService';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.REGION || 'eu-west-1',
});

const BUCKET_NAME = process.env.CLIENT_DOCUMENTS_BUCKET || '';

interface AddDocumentRequest {
  dossierType: 'shipping' | 'enedis' | 'consuel' | 'installation';
  fileName: string;
  fileContent: string; // Base64 encoded
}

const VALID_DOSSIER_TYPES = ['shipping', 'enedis', 'consuel', 'installation'];

// Map dossierType to actual S3 folder path
const DOSSIER_TYPE_TO_PATH: Record<string, string> = {
  shipping: 'shipping',
  enedis: 'admin/enedis',
  consuel: 'admin/consuel',
  installation: 'installation/reports',
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;
    const userRole = getUserRole(claims);

    // Seuls les admins peuvent utiliser cet endpoint
    if (userRole !== 'admin') {
      return formatJSONResponse(403, {
        message: 'Accès réservé aux administrateurs',
      });
    }

    // Récupérer l'orderId depuis les path parameters
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      return formatJSONResponse(400, {
        message: 'orderId est requis',
      });
    }

    // Parser le body
    let body: AddDocumentRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return formatJSONResponse(400, {
        message: 'Body JSON invalide',
      });
    }

    // Valider les champs requis
    if (!body.dossierType || !body.fileName || !body.fileContent) {
      return formatJSONResponse(400, {
        message: 'dossierType, fileName et fileContent sont requis',
      });
    }

    // Valider le type de dossier
    if (!VALID_DOSSIER_TYPES.includes(body.dossierType)) {
      return formatJSONResponse(400, {
        code: 'INVALID_DOSSIER_TYPE',
        message: `Type de dossier invalide. Types autorisés: ${VALID_DOSSIER_TYPES.join(', ')}`,
      });
    }

    // Valider l'extension du fichier
    const extensionValidation = validateFileExtension(body.fileName);
    if (!extensionValidation.valid) {
      return formatJSONResponse(400, {
        code: 'INVALID_FILE_TYPE',
        message: extensionValidation.error,
      });
    }

    // Déterminer le content-type à partir de l'extension
    const extension = body.fileName.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      pdf: 'application/pdf',
    };
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream';

    // Valider le content-type
    const contentTypeValidation = validateContentType(contentType);
    if (!contentTypeValidation.valid) {
      return formatJSONResponse(400, {
        code: 'INVALID_FILE_TYPE',
        message: contentTypeValidation.error,
      });
    }

    // Vérifier que la commande existe
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

    // Récupérer les dossiers de la commande pour trouver le dossierId correspondant
    const dossiers = await getDossiersByOrderId(orderId);
    
    // Mapper le dossierType au type de dossier dans la base
    const dossierTypeMap: Record<string, string> = {
      shipping: 'shipping',
      enedis: 'admin_enedis',
      consuel: 'admin_consuel',
      installation: 'installation',
    };
    const targetDossierType = dossierTypeMap[body.dossierType];
    
    const targetDossier = dossiers.find((d) => d.type === targetDossierType);
    if (!targetDossier) {
      return formatJSONResponse(404, {
        message: `Aucun dossier de type ${body.dossierType} trouvé pour cette commande`,
      });
    }

    // Décoder le contenu base64
    let fileBuffer: Buffer;
    try {
      fileBuffer = Buffer.from(body.fileContent, 'base64');
    } catch {
      return formatJSONResponse(400, {
        message: 'fileContent doit être encodé en base64 valide',
      });
    }

    // Vérifier la taille (10 Mo max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      return formatJSONResponse(400, {
        code: 'UPLOAD_SIZE_EXCEEDED',
        message: 'Le fichier dépasse la taille maximale de 10 Mo',
      });
    }

    // Générer le chemin S3
    const s3Path = DOSSIER_TYPE_TO_PATH[body.dossierType];
    const s3Key = generateS3Key(order.userId, orderId, s3Path, body.fileName);

    // Upload vers S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType,
        Metadata: {
          'original-filename': body.fileName,
          'uploaded-by': userId,
          'upload-source': 'admin',
          'order-id': orderId,
          'dossier-type': body.dossierType,
        },
      })
    );

    // Créer l'enregistrement du document dans DynamoDB
    const documentId = uuidv4();
    const document = await createDocumentRecord(
      documentId,
      targetDossier.dossierId,
      orderId,
      body.fileName,
      contentType,
      fileBuffer.length,
      s3Key,
      userId
    );

    // Créer un événement d'audit
    await createDossierEvent(targetDossier.dossierId, 'document_added', 'admin', {
      documentId,
      fileName: body.fileName,
      contentType,
      size: fileBuffer.length,
      uploadedBy: userId,
      source: 'back-office',
    });

    return formatJSONResponse(201, {
      message: 'Document ajouté avec succès',
      document: {
        documentId: document.documentId,
        fileName: document.fileName,
        contentType: document.contentType,
        size: document.size,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error: any) {
    console.error('Error adding document:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de l\'ajout du document',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
