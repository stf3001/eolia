import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { getCommissionRate } from '../../services/affiliateService';

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

    // Get query parameters for pagination and filtering
    const limit = parseInt(event.queryStringParameters?.limit || '50', 10);
    const lastKey = event.queryStringParameters?.lastKey;
    const statusFilter = event.queryStringParameters?.status;

    // Build query params
    const queryParams: any = {
      TableName: Tables.COMMISSIONS,
      IndexName: 'AffiliateIdIndex',
      KeyConditionExpression: 'affiliateId = :affiliateId',
      ExpressionAttributeValues: {
        ':affiliateId': affiliate.affiliateId,
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    };

    // Add status filter if provided
    if (statusFilter && ['pending', 'validated', 'paid', 'cancelled'].includes(statusFilter)) {
      queryParams.FilterExpression = '#status = :status';
      queryParams.ExpressionAttributeNames = { '#status': 'status' };
      queryParams.ExpressionAttributeValues[':status'] = statusFilter;
    }

    if (lastKey) {
      try {
        queryParams.ExclusiveStartKey = JSON.parse(
          Buffer.from(lastKey, 'base64').toString('utf-8')
        );
      } catch {
        // Invalid lastKey, ignore
      }
    }

    // Get commissions
    const commissionsResult = await dynamoDb.send(new QueryCommand(queryParams));

    const commissions = (commissionsResult.Items || []).map((c) => ({
      commissionId: c.commissionId,
      referralId: c.referralId,
      orderId: c.orderId,
      amount: c.amount,
      type: c.type,
      currency: c.currency || 'EUR',
      orderAmount: c.orderAmount,
      commissionRate: c.commissionRate,
      tier: c.tier,
      status: c.status,
      validatedAt: c.validatedAt,
      paidAt: c.paidAt,
      createdAt: c.createdAt,
    }));

    // Build pagination token
    let nextKey: string | undefined;
    if (commissionsResult.LastEvaluatedKey) {
      nextKey = Buffer.from(
        JSON.stringify(commissionsResult.LastEvaluatedKey)
      ).toString('base64');
    }

    // Get all commissions for stats (without pagination)
    const allCommissionsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.COMMISSIONS,
        IndexName: 'AffiliateIdIndex',
        KeyConditionExpression: 'affiliateId = :affiliateId',
        ExpressionAttributeValues: {
          ':affiliateId': affiliate.affiliateId,
        },
      })
    );

    const allCommissions = allCommissionsResult.Items || [];

    // Calculate stats
    const stats = {
      totalPending: allCommissions
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalValidated: allCommissions
        .filter((c) => c.status === 'validated')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalPaid: allCommissions
        .filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalCancelled: allCommissions
        .filter((c) => c.status === 'cancelled')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      count: {
        pending: allCommissions.filter((c) => c.status === 'pending').length,
        validated: allCommissions.filter((c) => c.status === 'validated').length,
        paid: allCommissions.filter((c) => c.status === 'paid').length,
        cancelled: allCommissions.filter((c) => c.status === 'cancelled').length,
      },
    };

    // Add B2B specific info
    let currentTier: number | undefined;
    if (affiliate.type === 'B2B') {
      currentTier = getCommissionRate(affiliate.cumulativeRevenue || 0);
    }

    return formatJSONResponse(200, {
      commissions,
      stats: {
        ...stats,
        currentTier,
        cumulativeRevenue: affiliate.type === 'B2B' ? affiliate.cumulativeRevenue : undefined,
      },
      pagination: {
        limit,
        hasMore: !!nextKey,
        nextKey,
      },
    });
  } catch (error: any) {
    console.error('Error getting commissions:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération des commissions',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
