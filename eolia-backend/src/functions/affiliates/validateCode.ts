import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { dynamoDb, Tables } from '../../services/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.pathParameters?.code;

    if (!code) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'Code de parrainage requis',
      });
    }

    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().trim();

    // Look up affiliate by code
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.AFFILIATES,
        IndexName: 'CodeIndex',
        KeyConditionExpression: 'code = :code',
        ExpressionAttributeValues: {
          ':code': normalizedCode,
        },
      })
    );

    const affiliate = result.Items?.[0];

    if (!affiliate) {
      return formatJSONResponse(404, {
        error: 'NOT_FOUND',
        message: 'Code de parrainage invalide',
        valid: false,
      });
    }

    // Check if affiliate is active
    if (affiliate.status !== 'active') {
      return formatJSONResponse(400, {
        error: 'INACTIVE_CODE',
        message: 'Ce code de parrainage n\'est plus actif',
        valid: false,
      });
    }

    // For B2C, check referral limit
    if (affiliate.type === 'B2C') {
      const referralCount = affiliate.referralCount || 0;
      const referralLimit = affiliate.referralLimit || 10;

      if (referralCount >= referralLimit) {
        return formatJSONResponse(400, {
          error: 'LIMIT_REACHED',
          message: 'Ce parrain a atteint sa limite de filleuls pour cette année',
          valid: false,
        });
      }
    }

    // Return valid code info (without sensitive data)
    return formatJSONResponse(200, {
      valid: true,
      code: affiliate.code,
      type: affiliate.type,
      affiliateId: affiliate.affiliateId,
      // For B2B, include company name for display
      companyName: affiliate.type === 'B2B' ? affiliate.companyName : undefined,
    });
  } catch (error: any) {
    console.error('Error validating affiliate code:', error);

    return formatJSONResponse(500, {
      message: 'Erreur lors de la validation du code',
      valid: false,
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
