import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

interface CreateAddressRequest {
  label: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country?: string;
  phone: string;
  isDefault?: boolean;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    if (!event.body) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Request body is required',
      });
    }

    const body: CreateAddressRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.label || !body.firstName || !body.lastName || 
        !body.addressLine1 || !body.postalCode || !body.city || !body.phone) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: label, firstName, lastName, addressLine1, postalCode, city, phone',
      });
    }

    const addressId = uuidv4();
    const now = Date.now();

    // Check if user has existing addresses
    const existingAddresses = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.ADDRESSES,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const isFirstAddress = !existingAddresses.Items || existingAddresses.Items.length === 0;
    const shouldBeDefault = body.isDefault || isFirstAddress;

    // If this address should be default, unset other defaults
    if (shouldBeDefault && existingAddresses.Items && existingAddresses.Items.length > 0) {
      for (const addr of existingAddresses.Items) {
        if (addr.isDefault) {
          await dynamoDb.send(
            new UpdateCommand({
              TableName: Tables.ADDRESSES,
              Key: { userId, addressId: addr.addressId },
              UpdateExpression: 'SET isDefault = :false',
              ExpressionAttributeValues: { ':false': false },
            })
          );
        }
      }
    }

    const address = {
      userId,
      addressId,
      label: body.label,
      firstName: body.firstName,
      lastName: body.lastName,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 || '',
      postalCode: body.postalCode,
      city: body.city,
      country: body.country || 'France',
      phone: body.phone,
      isDefault: shouldBeDefault,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.ADDRESSES,
        Item: address,
      })
    );

    return formatJSONResponse(201, { address });
  } catch (error: any) {
    console.error('Error creating address:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la création de l\'adresse',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
