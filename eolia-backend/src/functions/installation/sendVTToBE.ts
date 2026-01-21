/**
 * Lambda sendVTToBE - POST /orders/{orderId}/installation/send-to-be
 * Met à jour le statut à `awaiting_be`
 * Crée un événement avec la date d'envoi
 * Requirements: 4.5
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import {
  getDossiersByOrderId,
  updateDossierMetadata,
  updateDossierStatus,
  createDossierEvent,
} from '../../services/dossierService';
import { validateStateTransition } from '../../services/stateTransitionService';
import { InstallationMetadata } from '../../models/dossier';
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

    // Récupérer orderId
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      return formatJSONResponse(400, {
        message: 'orderId est requis',
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

    // Vérifier que le statut permet l'envoi au BE
    if (installationDossier.status !== 'vt_completed') {
      return formatJSONResponse(400, {
        code: 'INVALID_STATUS',
        message: 'La visite technique doit être complétée avant l\'envoi au BE',
        currentStatus: installationDossier.status,
        requiredStatus: 'vt_completed',
      });
    }

    // Valider la transition d'état
    const transitionValidation = validateStateTransition(
      'installation',
      installationDossier.status,
      'awaiting_be'
    );

    if (!transitionValidation.valid) {
      return formatJSONResponse(400, {
        code: 'INVALID_STATUS_TRANSITION',
        message: transitionValidation.error,
      });
    }

    const now = Date.now();

    // Mettre à jour les métadonnées avec la date d'envoi au BE
    const metadata: Partial<InstallationMetadata> = {
      vtSentToBEAt: now,
    };

    await updateDossierMetadata(
      orderId,
      installationDossier.dossierId,
      metadata,
      'client'
    );

    // Mettre à jour le statut à awaiting_be
    const updatedDossier = await updateDossierStatus(
      orderId,
      installationDossier.dossierId,
      'awaiting_be',
      'client'
    );

    // Créer un événement d'envoi au BE
    await createDossierEvent(
      installationDossier.dossierId,
      'vt_sent_to_be',
      'client',
      {
        sentAt: now,
        sentBy: userId,
      }
    );

    return formatJSONResponse(200, {
      message: 'Visite technique envoyée au Bureau d\'Études',
      dossier: updatedDossier,
      sentAt: now,
    });
  } catch (error: any) {
    console.error('Error sending VT to BE:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de l\'envoi de la visite technique au BE',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
