/**
 * Lambda addNote - POST /admin/orders/:orderId/notes
 * Ajoute une note admin à une commande ou un dossier
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAdminAuth } from '../../services/adminAuth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface AdminNote {
  noteId: string;
  orderId: string;
  dossierId?: string;
  content: string;
  createdAt: number;
  createdBy: string;
}

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

    // Parser le body
    if (!event.body) {
      return formatJSONResponse(400, {
        message: 'Corps de la requête manquant',
      });
    }

    const body = JSON.parse(event.body);
    const { content, dossierId } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return formatJSONResponse(400, {
        message: 'Le contenu de la note est requis',
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

    // Créer la note
    const note: AdminNote = {
      noteId: uuidv4(),
      orderId,
      dossierId: dossierId || undefined,
      content: content.trim(),
      createdAt: Date.now(),
      createdBy: 'admin',
    };

    // Récupérer les notes existantes et ajouter la nouvelle
    const existingNotes: AdminNote[] = order.adminNotes || [];
    const updatedNotes = [...existingNotes, note];

    // Mettre à jour la commande avec la nouvelle note
    await dynamoDb.send(
      new UpdateCommand({
        TableName: Tables.ORDERS,
        Key: {
          orderId: orderId,
          createdAt: order.createdAt,
        },
        UpdateExpression: 'SET adminNotes = :notes',
        ExpressionAttributeValues: {
          ':notes': updatedNotes,
        },
      })
    );

    return formatJSONResponse(201, { note });
  } catch (error: any) {
    console.error('Error adding admin note:', error);

    return formatJSONResponse(500, {
      message: 'Erreur lors de l\'ajout de la note',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
