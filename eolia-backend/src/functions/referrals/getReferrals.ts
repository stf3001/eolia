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

    // Get query parameters for pagination
    const limit = parseInt(event.queryStringParameters?.limit || '50', 10);
    const lastKey = event.queryStringParameters?.lastKey;

    // Build query params
    const queryParams: any = {
      TableName: Tables.REFERRALS,
      IndexName: 'AffiliateIdIndex',
      KeyConditionExpression: 'affiliateId = :affiliateId',
      ExpressionAttributeValues: {
        ':affiliateId': affiliate.affiliateId,
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    };

    if (lastKey) {
      try {
        queryParams.ExclusiveStartKey = JSON.parse(
          Buffer.from(lastKey, 'base64').toString('utf-8')
        );
      } catch {
        // Invalid lastKey, ignore
      }
    }

    // Get referrals
    const referralsResult = await dynamoDb.send(new QueryCommand(queryParams));

    const referrals = (referralsResult.Items || []).map((r) => ({
      referralId: r.referralId,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      phone: r.phone,
      companyName: r.companyName,
      status: r.status,
      source: r.source,
      totalPurchases: r.totalPurchases || 0,
      totalRevenue: r.totalRevenue || 0,
      firstPurchaseAt: r.firstPurchaseAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    // Build pagination token
    let nextKey: string | undefined;
    if (referralsResult.LastEvaluatedKey) {
      nextKey = Buffer.from(
        JSON.stringify(referralsResult.LastEvaluatedKey)
      ).toString('base64');
    }

    // Calculate stats
    const total = referrals.length;
    const byStatus = {
      submitted: referrals.filter((r) => r.status === 'submitted').length,
      registered: referrals.filter((r) => r.status === 'registered').length,
      first_purchase: referrals.filter((r) => r.status === 'first_purchase').length,
      active: referrals.filter((r) => r.status === 'active').length,
    };

    return formatJSONResponse(200, {
      referrals,
      total,
      byStatus,
      pagination: {
        limit,
        hasMore: !!nextKey,
        nextKey,
      },
    });
  } catch (error: any) {
    console.error('Error getting referrals:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des filleuls',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
