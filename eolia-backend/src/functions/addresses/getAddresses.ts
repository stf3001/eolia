import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
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

    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.ADDRESSES,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const addresses = result.Items || [];

    // Sort: default first, then by createdAt desc
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return formatJSONResponse(200, { addresses });
  } catch (error: any) {
    console.error('Error getting addresses:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des adresses',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
