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

    // Get referrals count and stats
    const referralsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.REFERRALS,
        IndexName: 'AffiliateIdIndex',
        KeyConditionExpression: 'affiliateId = :affiliateId',
        ExpressionAttributeValues: {
          ':affiliateId': affiliate.affiliateId,
        },
      })
    );

    const referrals = referralsResult.Items || [];
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(
      (r) => r.status === 'first_purchase' || r.status === 'active'
    ).length;

    // Get commissions stats
    const commissionsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.COMMISSIONS,
        IndexName: 'AffiliateIdIndex',
        KeyConditionExpression: 'affiliateId = :affiliateId',
        ExpressionAttributeValues: {
          ':affiliateId': affiliate.affiliateId,
        },
      })
    );

    const commissions = commissionsResult.Items || [];
    const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const pendingCommissions = commissions
      .filter((c) => c.status === 'pending' || c.status === 'validated')
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    const paidCommissions = commissions
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    // Calculate current tier for B2B
    let currentTier = affiliate.currentTier;
    if (affiliate.type === 'B2B') {
      currentTier = getCommissionRate(affiliate.cumulativeRevenue || 0);
    }

    const stats = {
      totalReferrals,
      activeReferrals,
      totalCommissions,
      pendingCommissions,
      paidCommissions,
    };

    // Build response based on affiliate type
    const response: any = {
      affiliate: {
        affiliateId: affiliate.affiliateId,
        userId: affiliate.userId,
        email: affiliate.email,
        code: affiliate.code,
        type: affiliate.type,
        status: affiliate.status,
        createdAt: affiliate.createdAt,
        updatedAt: affiliate.updatedAt,
      },
      stats,
    };

    if (affiliate.type === 'B2C') {
      response.affiliate.referralCount = affiliate.referralCount || 0;
      response.affiliate.referralLimit = affiliate.referralLimit || 10;
      response.affiliate.yearlyResetDate = affiliate.yearlyResetDate;
    } else if (affiliate.type === 'B2B') {
      response.affiliate.companyName = affiliate.companyName;
      response.affiliate.siret = affiliate.siret;
      response.affiliate.professionalEmail = affiliate.professionalEmail;
      response.affiliate.professionalPhone = affiliate.professionalPhone;
      response.affiliate.professionalAddress = affiliate.professionalAddress;
      response.affiliate.contractUrl = affiliate.contractUrl;
      response.affiliate.contractSignedAt = affiliate.contractSignedAt;
      response.affiliate.cumulativeRevenue = affiliate.cumulativeRevenue || 0;
      response.affiliate.currentTier = currentTier;
    }

    return formatJSONResponse(200, response);
  } catch (error: any) {
    console.error('Error getting affiliate profile:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la récupération du profil ambassadeur',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
