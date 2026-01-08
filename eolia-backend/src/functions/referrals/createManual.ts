import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { B2C_REFERRAL_LIMIT } from '../../services/affiliateService';

interface CreateReferralRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
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

    const body: CreateReferralRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.email) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Email du filleul requis',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Format d\'email invalide',
      });
    }

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

    if (affiliate.status !== 'active') {
      return formatJSONResponse(403, {
        error: 'INACTIVE_AFFILIATE',
        message: 'Votre compte ambassadeur n\'est pas actif',
      });
    }

    // For B2C, check referral limit
    if (affiliate.type === 'B2C') {
      const referralCount = affiliate.referralCount || 0;
      const referralLimit = affiliate.referralLimit || B2C_REFERRAL_LIMIT;

      if (referralCount >= referralLimit) {
        return formatJSONResponse(400, {
          error: 'LIMIT_REACHED',
          message: `Vous avez atteint votre limite de ${referralLimit} filleuls pour cette année`,
        });
      }
    }

    // Check if referral with this email already exists for this affiliate
    const existingReferral = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.REFERRALS,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': body.email.toLowerCase(),
        },
      })
    );

    const existingForAffiliate = existingReferral.Items?.find(
      (r) => r.affiliateId === affiliate.affiliateId
    );

    if (existingForAffiliate) {
      return formatJSONResponse(409, {
        error: 'ALREADY_EXISTS',
        message: 'Ce filleul a déjà été soumis',
      });
    }

    const now = Date.now();
    const referralId = uuidv4();

    const referral = {
      referralId,
      createdAt: now,
      affiliateId: affiliate.affiliateId,
      email: body.email.toLowerCase(),
      firstName: body.firstName || null,
      lastName: body.lastName || null,
      phone: body.phone || null,
      companyName: body.companyName || null,
      status: 'submitted',
      source: 'manual_submission',
      totalPurchases: 0,
      totalRevenue: 0,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.REFERRALS,
        Item: referral,
      })
    );

    // Update affiliate referral count for B2C
    if (affiliate.type === 'B2C') {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: Tables.AFFILIATES,
          Key: { affiliateId: affiliate.affiliateId },
          UpdateExpression: 'SET referralCount = referralCount + :inc, updatedAt = :now',
          ExpressionAttributeValues: {
            ':inc': 1,
            ':now': now,
          },
        })
      );
    }

    return formatJSONResponse(201, {
      referral: {
        referralId: referral.referralId,
        email: referral.email,
        firstName: referral.firstName,
        lastName: referral.lastName,
        status: referral.status,
        createdAt: referral.createdAt,
      },
      message: 'Filleul ajouté avec succès',
    });
  } catch (error: any) {
    console.error('Error creating referral:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de l\'ajout du filleul',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
