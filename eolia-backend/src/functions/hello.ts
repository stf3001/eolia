import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Bienvenue sur EOLIA API - Éoliennes verticales Tulipe',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    }),
  };
};
