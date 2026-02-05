import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

interface EnedisConsentRequest {
  pdl: string;
  lastName: string;
  address: string;
}

/**
 * Validates PDL (Point de Livraison) - must be exactly 14 digits
 */
function isValidPDL(pdl: string): boolean {
  return /^\d{14}$/.test(pdl);
}

function validateConsentRequest(body: EnedisConsentRequest): { valid: boolean; message?: string } {
  if (!body.pdl || typeof body.pdl !== 'string') {
    return { valid: false, message: 'PDL est requis.' };
  }

  if (!isValidPDL(body.pdl)) {
    return { valid: false, message: 'PDL invalide. Le PDL doit contenir exactement 14 chiffres.' };
  }

  if (!body.lastName || typeof body.lastName !== 'string' || body.lastName.trim().length < 2) {
    return { valid: false, message: 'Nom invalide. Le nom doit contenir au moins 2 caractères.' };
  }

  if (!body.address || typeof body.address !== 'string' || body.address.trim().length < 5) {
    return { valid: false, message: 'Adresse invalide. L\'adresse doit contenir au moins 5 caractères.' };
  }

  return { valid: true };
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

    const body: EnedisConsentRequest = JSON.parse(event.body);
    const validation = validateConsentRequest(body);

    if (!validation.valid) {
      return formatJSONResponse(400, {
        error: 'ENEDIS_CONSENT_INVALID',
        message: validation.message,
      });
    }

    // Check if user already has a consent for this PDL
    const existingConsent = await dynamoDb.send(
      new GetCommand({
        TableName: Tables.USERS,
        Key: {
          PK: `USER#${userId}`,
          SK: `ENEDIS_CONSENT#${body.pdl}`,
        },
      })
    );

    const now = new Date().toISOString();
    const consentId = existingConsent.Item?.consentId || uuidv4();

    const consentRecord = {
      PK: `USER#${userId}`,
      SK: `ENEDIS_CONSENT#${body.pdl}`,
      consentId,
      userId,
      pdl: body.pdl,
      lastName: body.lastName.trim(),
      address: body.address.trim(),
      status: 'pending' as const,
      createdAt: existingConsent.Item?.createdAt || now,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.USERS,
        Item: consentRecord,
      })
    );

    return formatJSONResponse(200, {
      consentId,
      status: 'pending',
      createdAt: consentRecord.createdAt,
      pdl: body.pdl,
    });
  } catch (error: any) {
    console.error('Error creating Enedis consent:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      error: 'ENEDIS_API_UNAVAILABLE',
      message: 'Erreur lors de la création du consentement Enedis',
      details: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
