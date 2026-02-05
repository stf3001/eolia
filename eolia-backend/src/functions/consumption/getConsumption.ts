import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

const DEFAULT_ANNUAL_CONSUMPTION = 10000;
const SEASONAL_PROFILE = [
  0.135, 0.12, 0.105, 0.08, 0.065, 0.055,
  0.05, 0.05, 0.06, 0.08, 0.095, 0.105
];

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: Tables.USERS,
        Key: {
          PK: `USER#${userId}`,
          SK: 'CONSUMPTION',
        },
      })
    );

    if (!result.Item) {
      // Return default consumption profile
      const defaultMonthly = SEASONAL_PROFILE.map(pct => 
        Math.round(DEFAULT_ANNUAL_CONSUMPTION * pct)
      );

      return formatJSONResponse(200, {
        mode: 'default',
        annualTotal: DEFAULT_ANNUAL_CONSUMPTION,
        monthlyValues: defaultMonthly,
        source: 'default',
        updatedAt: null,
      });
    }

    return formatJSONResponse(200, {
      mode: result.Item.mode,
      annualTotal: result.Item.annualTotal,
      monthlyValues: result.Item.monthlyValues,
      source: result.Item.mode,
      updatedAt: result.Item.updatedAt,
    });
  } catch (error: any) {
    console.error('Error getting consumption:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération de la consommation',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
