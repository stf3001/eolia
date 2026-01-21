/**
 * Lambda submitVT - POST /orders/{orderId}/installation/vt
 * Valide le formulaire VT (champs obligatoires, min 3 photos)
 * Sauvegarde les données VT dans le dossier installation
 * Met à jour le statut à `vt_completed`
 * Requirements: 4.2, 4.3, 4.6, 5.1, 5.2, 5.3
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import {
  getDossiersByOrderId,
  updateDossierMetadata,
  updateDossierStatus,
  createDossierEvent,
  getDocumentsByDossierId,
} from '../../services/dossierService';
import { validateStateTransition } from '../../services/stateTransitionService';
import { VTFormData, InstallationMetadata } from '../../models/dossier';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';

// Types de toiture valides
const VALID_ROOF_TYPES = ['flat', 'sloped_tiles', 'sloped_slate', 'metal', 'other'] as const;

// Distances électriques valides
const VALID_ELECTRICAL_DISTANCES = ['<30m', '30-60m', '60-100m', '>100m'] as const;

// Nombre minimum de photos requis
const MIN_PHOTOS_REQUIRED = 3;

interface SubmitVTRequest {
  roofType: string;
  mountingHeight: number;
  electricalDistance: string;
  obstacles: string[];
  comments?: string;
  photoIds: string[];
}

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Valide les données du formulaire VT
 */
function validateVTForm(data: SubmitVTRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validation du type de toiture
  if (!data.roofType) {
    errors.push({ field: 'roofType', message: 'Le type de toiture est requis' });
  } else if (!VALID_ROOF_TYPES.includes(data.roofType as typeof VALID_ROOF_TYPES[number])) {
    errors.push({ field: 'roofType', message: 'Type de toiture invalide' });
  }

  // Validation de la hauteur de montage
  if (data.mountingHeight === undefined || data.mountingHeight === null) {
    errors.push({ field: 'mountingHeight', message: 'La hauteur de montage est requise' });
  } else if (typeof data.mountingHeight !== 'number' || data.mountingHeight < 0) {
    errors.push({ field: 'mountingHeight', message: 'La hauteur de montage doit être un nombre positif' });
  }

  // Validation de la distance au tableau électrique
  if (!data.electricalDistance) {
    errors.push({ field: 'electricalDistance', message: 'La distance au tableau électrique est requise' });
  } else if (!VALID_ELECTRICAL_DISTANCES.includes(data.electricalDistance as typeof VALID_ELECTRICAL_DISTANCES[number])) {
    errors.push({ field: 'electricalDistance', message: 'Distance au tableau électrique invalide' });
  }

  // Validation des obstacles (doit être un tableau)
  if (!Array.isArray(data.obstacles)) {
    errors.push({ field: 'obstacles', message: 'Les obstacles doivent être un tableau' });
  }

  // Validation des photos
  if (!data.photoIds || !Array.isArray(data.photoIds)) {
    errors.push({ field: 'photoIds', message: 'Les IDs de photos sont requis' });
  } else if (data.photoIds.length < MIN_PHOTOS_REQUIRED) {
    errors.push({ 
      field: 'photoIds', 
      message: `Au moins ${MIN_PHOTOS_REQUIRED} photos sont requises (${data.photoIds.length} fournie(s))` 
    });
  }

  return errors;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    // Récupérer orderId
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      return formatJSONResponse(400, {
        message: 'orderId est requis',
      });
    }

    // Parser le body
    let body: SubmitVTRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return formatJSONResponse(400, {
        message: 'Body JSON invalide',
      });
    }

    // Valider le formulaire
    const validationErrors = validateVTForm(body);
    if (validationErrors.length > 0) {
      return formatJSONResponse(400, {
        code: 'VALIDATION_ERROR',
        message: 'Erreurs de validation du formulaire VT',
        errors: validationErrors,
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

    // Récupérer le dossier installation
    const dossiers = await getDossiersByOrderId(orderId);
    const installationDossier = dossiers.find(d => d.type === 'installation');

    if (!installationDossier) {
      return formatJSONResponse(404, {
        message: 'Dossier installation non trouvé pour cette commande',
      });
    }

    // Vérifier que le statut permet la soumission VT
    if (installationDossier.status !== 'vt_pending') {
      return formatJSONResponse(400, {
        code: 'VT_ALREADY_SUBMITTED',
        message: 'La visite technique a déjà été soumise',
        currentStatus: installationDossier.status,
      });
    }

    // Valider la transition d'état
    const transitionValidation = validateStateTransition(
      'installation',
      installationDossier.status,
      'vt_completed'
    );

    if (!transitionValidation.valid) {
      return formatJSONResponse(400, {
        code: 'INVALID_STATUS_TRANSITION',
        message: transitionValidation.error,
      });
    }

    // Vérifier que les photos existent dans le dossier
    const existingDocs = await getDocumentsByDossierId(installationDossier.dossierId);
    const existingDocIds = existingDocs.map(d => d.documentId);
    const missingPhotos = body.photoIds.filter(id => !existingDocIds.includes(id));

    if (missingPhotos.length > 0) {
      return formatJSONResponse(400, {
        code: 'PHOTOS_NOT_FOUND',
        message: 'Certaines photos référencées n\'existent pas',
        missingPhotoIds: missingPhotos,
      });
    }

    // Construire les données VT
    const vtData: VTFormData = {
      roofType: body.roofType as VTFormData['roofType'],
      mountingHeight: body.mountingHeight,
      electricalDistance: body.electricalDistance as VTFormData['electricalDistance'],
      obstacles: body.obstacles,
      comments: body.comments,
      photoIds: body.photoIds,
    };

    const now = Date.now();

    // Mettre à jour les métadonnées avec les données VT
    const metadata: Partial<InstallationMetadata> = {
      vtData,
      vtSubmittedAt: now,
    };

    await updateDossierMetadata(
      orderId,
      installationDossier.dossierId,
      metadata,
      'client'
    );

    // Mettre à jour le statut à vt_completed
    const updatedDossier = await updateDossierStatus(
      orderId,
      installationDossier.dossierId,
      'vt_completed',
      'client'
    );

    // Créer un événement VT soumise
    await createDossierEvent(
      installationDossier.dossierId,
      'vt_submitted',
      'client',
      {
        vtData,
        photoCount: body.photoIds.length,
      }
    );

    return formatJSONResponse(200, {
      message: 'Visite technique soumise avec succès',
      dossier: updatedDossier,
    });
  } catch (error: any) {
    console.error('Error submitting VT:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la soumission de la visite technique',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
