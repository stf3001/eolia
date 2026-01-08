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

    // Get affiliate profile
    const affiliateResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.AFFILIATES,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const affiliate = affiliateResult.Items?.[0];

    if (!affiliate) {
      return formatJSONResponse(404, {
        error: 'NOT_FOUND',
        message: 'Profil ambassadeur non trouvé',
      });
    }

    // Check if affiliate is B2B
    if (affiliate.type !== 'B2B') {
      return formatJSONResponse(400, {
        error: 'NOT_B2B',
        message: 'Les contrats sont uniquement disponibles pour les ambassadeurs B2B',
      });
    }

    // Check if contract exists
    if (!affiliate.contractUrl) {
      return formatJSONResponse(404, {
        error: 'NO_CONTRACT',
        message: 'Aucun contrat n\'a été généré pour ce compte',
      });
    }

    return formatJSONResponse(200, {
      contractUrl: affiliate.contractUrl,
      contractSignedAt: affiliate.contractSignedAt,
      affiliateId: affiliate.affiliateId,
    });
  } catch (error: any) {
    console.error('Error downloading contract:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération du contrat',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
