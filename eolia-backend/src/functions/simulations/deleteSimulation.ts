import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
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

    const simulationId = event.pathParameters?.simulationId;
    if (!simulationId) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Simulation ID is required',
      });
    }

    // Check if simulation exists and belongs to user
    const existing = await dynamoDb.send(
      new GetCommand({
        TableName: Tables.SIMULATIONS,
        Key: { userId, simulationId },
      })
    );

    if (!existing.Item) {
      return formatJSONResponse(404, {
        error: 'NOT_FOUND',
        message: 'Simulation introuvable',
      });
    }

    // Delete the simulation
    await dynamoDb.send(
      new DeleteCommand({
        TableName: Tables.SIMULATIONS,
        Key: { userId, simulationId },
      })
    );

    return formatJSONResponse(204, null);
  } catch (error: any) {
    console.error('Error deleting simulation:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la suppression de la simulation',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
