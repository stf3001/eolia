import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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

    // If already default, nothing to do
    if (existing.Item.isDefault) {
      return formatJSONResponse(200, { address: existing.Item });
    }

    // Get all addresses to unset current default
    const allAddresses = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.ADDRESSES,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      })
    );

    // Unset all defaults and set the new one
    if (allAddresses.Items) {
      for (const addr of allAddresses.Items) {
        if (addr.isDefault && addr.addressId !== addressId) {
          await dynamoDb.send(
            new UpdateCommand({
              TableName: Tables.ADDRESSES,
              Key: { userId, addressId: addr.addressId },
              UpdateExpression: 'SET isDefault = :false, updatedAt = :now',
              ExpressionAttributeValues: { ':false': false, ':now': Date.now() },
            })
          );
        }
      }
    }

    // Set the new default
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: Tables.ADDRESSES,
        Key: { userId, addressId },
        UpdateExpression: 'SET isDefault = :true, updatedAt = :now',
        ExpressionAttributeValues: { ':true': true, ':now': Date.now() },
        ReturnValues: 'ALL_NEW',
      })
    );

    return formatJSONResponse(200, { address: result.Attributes });
  } catch (error: any) {
    console.error('Error setting default address:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la définition de l\'adresse par défaut',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
