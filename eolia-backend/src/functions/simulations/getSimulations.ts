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
        TableName: Tables.SIMULATIONS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const simulations = result.Items || [];

    // Sort by createdAt descending (most recent first)
    simulations.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Transform createdAt to ISO string for frontend
    const formattedSimulations = simulations.map((sim) => ({
      ...sim,
      createdAt: new Date(sim.createdAt).toISOString(),
    }));

    return formatJSONResponse(200, { simulations: formattedSimulations });
  } catch (error: any) {
    console.error('Error getting simulations:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des simulations',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
