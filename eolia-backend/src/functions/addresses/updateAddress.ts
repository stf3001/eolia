import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface UpdateAddressRequest {
  label?: string;
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
}

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

    if (!event.body) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Request body is required',
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

    const body: UpdateAddressRequest = JSON.parse(event.body);
    const now = Date.now();

    // Build update expression dynamically
    const updateFields: string[] = ['updatedAt = :updatedAt'];
    const expressionValues: Record<string, any> = { ':updatedAt': now };

    const allowedFields = ['label', 'firstName', 'lastName', 'addressLine1', 
                          'addressLine2', 'postalCode', 'city', 'country', 'phone'];

    for (const field of allowedFields) {
      if (body[field as keyof UpdateAddressRequest] !== undefined) {
        updateFields.push(`${field} = :${field}`);
        expressionValues[`:${field}`] = body[field as keyof UpdateAddressRequest];
      }
    }

    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: Tables.ADDRESSES,
        Key: { userId, addressId },
        UpdateExpression: `SET ${updateFields.join(', ')}`,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return formatJSONResponse(200, { address: result.Attributes });
  } catch (error: any) {
    console.error('Error updating address:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la mise à jour de l\'adresse',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
