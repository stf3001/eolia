import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

type ConsumptionMode = 'simple' | 'precise';

interface SaveConsumptionRequest {
  mode: ConsumptionMode;
  annualTotal?: number;
  monthlyValues?: number[];
}

const SEASONAL_PROFILE = [
  0.135, 0.12, 0.105, 0.08, 0.065, 0.055,
  0.05, 0.05, 0.06, 0.08, 0.095, 0.105
];

function validateConsumption(body: SaveConsumptionRequest): { valid: boolean; message?: string } {
  if (!body.mode || !['simple', 'precise'].includes(body.mode)) {
    return { valid: false, message: 'Mode invalide. Utilisez "simple" ou "precise".' };
  }

  if (body.mode === 'simple') {
    if (typeof body.annualTotal !== 'number' || body.annualTotal <= 0) {
      return { valid: false, message: 'annualTotal doit être un nombre positif.' };
    }
    if (body.annualTotal < 1000 || body.annualTotal > 50000) {
      return { valid: false, message: 'Consommation hors plage réaliste (1000-50000 kWh).' };
    }
  }

  if (body.mode === 'precise') {
    if (!Array.isArray(body.monthlyValues) || body.monthlyValues.length !== 12) {
      return { valid: false, message: 'monthlyValues doit contenir exactement 12 valeurs.' };
    }
    const hasInvalid = body.monthlyValues.some(v => typeof v !== 'number' || v < 0);
    if (hasInvalid) {
      return { valid: false, message: 'Toutes les valeurs mensuelles doivent être des nombres positifs.' };
    }
    const total = body.monthlyValues.reduce((a, b) => a + b, 0);
    if (total < 1000 || total > 50000) {
      return { valid: false, message: 'Consommation totale hors plage réaliste (1000-50000 kWh).' };
    }
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

    const body: SaveConsumptionRequest = JSON.parse(event.body);
    const validation = validateConsumption(body);

    if (!validation.valid) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: validation.message,
      });
    }

    let monthlyValues: number[];
    let annualTotal: number;

    if (body.mode === 'simple') {
      annualTotal = body.annualTotal!;
      monthlyValues = SEASONAL_PROFILE.map(pct => Math.round(annualTotal * pct));
    } else {
      monthlyValues = body.monthlyValues!;
      annualTotal = monthlyValues.reduce((a, b) => a + b, 0);
    }

    const now = new Date().toISOString();

    const consumptionRecord = {
      PK: `USER#${userId}`,
      SK: 'CONSUMPTION',
      userId,
      mode: body.mode,
      annualTotal,
      monthlyValues,
      updatedAt: now,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: Tables.USERS,
        Item: consumptionRecord,
      })
    );

    return formatJSONResponse(200, {
      success: true,
      consumptionId: `${userId}-consumption`,
      mode: body.mode,
      annualTotal,
      monthlyValues,
      updatedAt: now,
    });
  } catch (error: any) {
    console.error('Error saving consumption:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      message: 'Erreur lors de la sauvegarde de la consommation',
      error: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
