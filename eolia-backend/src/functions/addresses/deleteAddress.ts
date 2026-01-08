import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, DeleteCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    const addressId = event.pathParameters?.addressId;
    if (!addressId) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Address ID is required',
      });
    }

    // Check if address exists and belongs to user
    const existing = await dynamoDb.send(
      new GetCommand({
        TableName: Tables.ADDRESSES,
        Key: { userId, addressId },
      })
    );

    if (!existing.Item) {
      return formatJSONResponse(404, {
        error: 'NOT_FOUND',
        message: 'Adresse non trouvée',
      });
    }

    const wasDefault = existing.Item.isDefault;

    // Delete the address
    await dynamoDb.send(
      new DeleteCommand({
        TableName: Tables.ADDRESSES,
        Key: { userId, addressId },
      })
    );

    // If deleted address was default, set another one as default
    if (wasDefault) {
      const remaining = await dynamoDb.send(
        new QueryCommand({
          TableName: Tables.ADDRESSES,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
          Limit: 1,
        })
      );

      if (remaining.Items && remaining.Items.length > 0) {
        await dynamoDb.send(
          new UpdateCommand({
            TableName: Tables.ADDRESSES,
            Key: { userId, addressId: remaining.Items[0].addressId },
            UpdateExpression: 'SET isDefault = :true',
            ExpressionAttributeValues: { ':true': true },
          })
        );
      }
    }

    return formatJSONResponse(200, { message: 'Adresse supprimée avec succès' });
  } catch (error: any) {
    console.error('Error deleting address:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la suppression de l\'adresse',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
