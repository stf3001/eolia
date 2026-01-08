import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { generateUniqueCode, getCommissionRate } from '../../services/affiliateService';

interface RegisterB2BRequest {
  companyName: string;
  siret: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalAddress?: string;
  contractAccepted: boolean;
  consentGiven: boolean;
}

// Validate SIRET format (14 digits)
const isValidSiret = (siret: string): boolean => {
  const cleanSiret = siret.replace(/\s/g, '');
  return /^\d{14}$/.test(cleanSiret);
};

const lambdaClient = new LambdaClient({ region: process.env.REGION || 'eu-west-1' });

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;
    const userEmail = claims.email;

    if (!event.body) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Request body is required',
      });
    }

    const body: RegisterB2BRequest = JSON.parse(event.body);

    // Validate required fields
    if (!body.companyName || !body.siret) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'companyName et siret sont requis',
      });
    }

    // Validate SIRET format
    if (!isValidSiret(body.siret)) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Le SIRET doit contenir 14 chiffres',
      });
    }

    // Validate contract acceptance
    if (!body.contractAccepted || !body.consentGiven) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Vous devez accepter le contrat et donner votre consentement',
      });
    }

    // Check if user already has an affiliate profile
    const existingAffiliate = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.AFFILIATES,
        IndexName: 'UserIdIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const existingProfile = existingAffiliate.Items?.[0];

    // If user already has a B2B profile, return error
    if (existingProfile && existingProfile.type === 'B2B') {
      return formatJSONResponse(409, {
        error: 'ALREADY_EXISTS',
        message: 'Vous avez déjà un profil ambassadeur B2B',
      });
    }

    const now = Date.now();
    const cleanSiret = body.siret.replace(/\s/g, '');
    
    interface AffiliateData {
      affiliateId: string;
      userId: string;
      email: string;
      code: string;
      type: 'B2B';
      status: string;
      companyName: string;
      siret: string;
      professionalEmail?: string | null;
      professionalPhone?: string | null;
      professionalAddress?: string | null;
      cumulativeRevenue: number;
      currentTier: number;
      contractAcceptedAt: number;
      createdAt: number;
      updatedAt: number;
    }
    
    let affiliate: AffiliateData;

    if (existingProfile && existingProfile.type === 'B2C') {
      // Upgrade B2C to B2B
      await dynamoDb.send(
        new UpdateCommand({
          TableName: Tables.AFFILIATES,
          Key: { affiliateId: existingProfile.affiliateId },
          UpdateExpression: `
            SET #type = :type,
                companyName = :companyName,
                siret = :siret,
                professionalEmail = :professionalEmail,
                professionalPhone = :professionalPhone,
                professionalAddress = :professionalAddress,
                cumulativeRevenue = :cumulativeRevenue,
                currentTier = :currentTier,
                contractAcceptedAt = :contractAcceptedAt,
                updatedAt = :updatedAt
          `,
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':type': 'B2B',
            ':companyName': body.companyName,
            ':siret': cleanSiret,
            ':professionalEmail': body.professionalEmail || null,
            ':professionalPhone': body.professionalPhone || null,
            ':professionalAddress': body.professionalAddress || null,
            ':cumulativeRevenue': 0,
            ':currentTier': 5,
            ':contractAcceptedAt': now,
            ':updatedAt': now,
          },
        })
      );

      affiliate = {
        affiliateId: existingProfile.affiliateId,
        userId: existingProfile.userId,
        email: existingProfile.email,
        code: existingProfile.code,
        type: 'B2B',
        status: existingProfile.status,
        companyName: body.companyName,
        siret: cleanSiret,
        professionalEmail: body.professionalEmail,
        professionalPhone: body.professionalPhone,
        professionalAddress: body.professionalAddress,
        cumulativeRevenue: 0,
        currentTier: 5,
        contractAcceptedAt: now,
        createdAt: existingProfile.createdAt,
        updatedAt: now,
      };
    } else {
      // Create new B2B affiliate
      const affiliateId = uuidv4();
      const code = await generateUniqueCode();

      affiliate = {
        affiliateId,
        userId,
        email: userEmail,
        code,
        type: 'B2B',
        status: 'active',
        companyName: body.companyName,
        siret: cleanSiret,
        professionalEmail: body.professionalEmail || null,
        professionalPhone: body.professionalPhone || null,
        professionalAddress: body.professionalAddress || null,
        cumulativeRevenue: 0,
        currentTier: 5,
        contractAcceptedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await dynamoDb.send(
        new PutCommand({
          TableName: Tables.AFFILIATES,
          Item: affiliate,
        })
      );
    }

    // Trigger contract generation asynchronously
    try {
      const functionName = `${process.env.SERVICE_NAME}-${process.env.STAGE}-generateContract`;
      await lambdaClient.send(
        new InvokeCommand({
          FunctionName: functionName,
          InvocationType: 'Event', // Async invocation
          Payload: JSON.stringify({
            affiliateId: affiliate.affiliateId,
            companyName: body.companyName,
            siret: cleanSiret,
            email: userEmail,
          }),
        })
      );
    } catch (contractError) {
      console.error('Error triggering contract generation:', contractError);
      // Don't fail the registration if contract generation fails
    }

    return formatJSONResponse(201, {
      affiliate: {
        affiliateId: affiliate.affiliateId,
        code: affiliate.code,
        type: affiliate.type,
        status: affiliate.status,
        companyName: affiliate.companyName,
        siret: affiliate.siret,
        cumulativeRevenue: affiliate.cumulativeRevenue,
        currentTier: affiliate.currentTier,
      },
      message: 'Inscription B2B réussie. Votre contrat sera généré sous peu.',
    });
  } catch (error: any) {
    console.error('Error registering B2B affiliate:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de l\'inscription B2B',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
