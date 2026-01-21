/**
 * Lambda updateDossierStatus - PUT /orders/{orderId}/dossiers/{dossierId}
 * Valide la transition d'état avant mise à jour et crée un événement dans l'historique
 * Requirements: 2.3, 3.3, 8.3
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth, getUserRole } from '../../services/auth';
import {
  getDossier,
  updateDossierStatus as updateStatus,
  updateDossierMetadata,
} from '../../services/dossierService';
import { validateStateTransition } from '../../services/stateTransitionService';
import { DossierStatus, DossierMetadata } from '../../models/dossier';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface UpdateDossierRequest {
  status?: string;
  metadata?: Partial<DossierMetadata>;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Vérifier l'authentification
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;
    const userRole = getUserRole(claims);

    // Récupérer les path parameters
    const orderId = event.pathParameters?.orderId;
    const dossierId = event.pathParameters?.dossierId;

    if (!orderId || !dossierId) {
      return formatJSONResponse(400, {
        message: 'orderId et dossierId sont requis',
      });
    }

    // Parser le body
    let body: UpdateDossierRequest;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return formatJSONResponse(400, {
        message: 'Body JSON invalide',
      });
    }

    if (!body.status && !body.metadata) {
      return formatJSONResponse(400, {
        message: 'status ou metadata requis',
      });
    }

    // Vérifier que la commande appartient à l'utilisateur (ou admin)
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

    // Seul le propriétaire ou un admin peut modifier
    if (order.userId !== userId && userRole !== 'admin') {
      return formatJSONResponse(403, {
        message: 'Accès non autorisé à cette commande',
      });
    }

    // Récupérer le dossier actuel
    const dossier = await getDossier(orderId, dossierId);
    if (!dossier) {
      return formatJSONResponse(404, {
        message: 'Dossier non trouvé',
      });
    }

    let updatedDossier = dossier;

    // Mise à jour du statut si demandé
    if (body.status) {
      // Valider la transition d'état
      const validation = validateStateTransition(
        dossier.type,
        dossier.status,
        body.status as DossierStatus
      );

      if (!validation.valid) {
        return formatJSONResponse(400, {
          code: 'INVALID_STATUS_TRANSITION',
          message: validation.error,
          allowedTransitions: validation.allowedTransitions,
        });
      }

      // Déterminer la source de l'événement
      const source = userRole === 'admin' ? 'admin' : 'client';

      // Mettre à jour le statut
      const result = await updateStatus(
        orderId,
        dossierId,
        body.status as DossierStatus,
        source
      );

      if (!result) {
        return formatJSONResponse(500, {
          message: 'Erreur lors de la mise à jour du statut',
        });
      }

      updatedDossier = result;
    }

    // Mise à jour des métadonnées si demandées
    if (body.metadata) {
      const source = userRole === 'admin' ? 'admin' : 'client';

      const result = await updateDossierMetadata(
        orderId,
        dossierId,
        body.metadata,
        source
      );

      if (!result) {
        return formatJSONResponse(500, {
          message: 'Erreur lors de la mise à jour des métadonnées',
        });
      }

      updatedDossier = result;
    }

    return formatJSONResponse(200, { dossier: updatedDossier });
  } catch (error: any) {
    console.error('Error updating dossier status:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la mise à jour du dossier',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
