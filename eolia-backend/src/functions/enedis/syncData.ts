import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

const s3Client = new S3Client({ region: process.env.REGION || 'eu-west-1' });
const ENEDIS_DATA_BUCKET = process.env.ENEDIS_DATA_BUCKET || '';

interface EnedisSyncRequest {
  consentId: string;
}

/**
 * Generates simulated hourly consumption data for a year.
 * This is a placeholder until real Enedis DataConnect API access is available.
 * Real implementation would call Enedis API with the consent.
 */
function generateSimulatedHourlyData(annualConsumption: number = 10000): number[] {
  const hourlyData: number[] = [];
  const hoursInYear = 8760;
  
  // Seasonal profile (monthly weights)
  const monthlyWeights = [
    0.135, 0.12, 0.105, 0.08, 0.065, 0.055,
    0.05, 0.05, 0.06, 0.08, 0.095, 0.105
  ];
  
  // Daily profile (hourly weights for a typical day)
  const hourlyWeights = [
    0.02, 0.015, 0.015, 0.015, 0.02, 0.03,  // 0-5h
    0.05, 0.07, 0.06, 0.04, 0.035, 0.035,   // 6-11h
    0.045, 0.04, 0.035, 0.035, 0.04, 0.055, // 12-17h
    0.07, 0.08, 0.075, 0.06, 0.045, 0.03    // 18-23h
  ];
  
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  for (let month = 0; month < 12; month++) {
    const monthlyConsumption = annualConsumption * monthlyWeights[month];
    const dailyConsumption = monthlyConsumption / daysPerMonth[month];
    
    for (let day = 0; day < daysPerMonth[month]; day++) {
      for (let hour = 0; hour < 24; hour++) {
        // Add some randomness (±15%)
        const randomFactor = 0.85 + Math.random() * 0.3;
        const hourlyConsumption = dailyConsumption * hourlyWeights[hour] * randomFactor;
        // Store in Wh (not kWh)
        hourlyData.push(Math.round(hourlyConsumption * 1000));
      }
    }
  }
  
  return hourlyData;
}

/**
 * Aggregates hourly data to monthly totals (in kWh)
 */
function aggregateToMonthly(hourlyData: number[]): number[] {
  const monthlyData: number[] = [];
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  let hourIndex = 0;
  for (let month = 0; month < 12; month++) {
    let monthTotal = 0;
    const hoursInMonth = daysPerMonth[month] * 24;
    
    for (let h = 0; h < hoursInMonth && hourIndex < hourlyData.length; h++) {
      monthTotal += hourlyData[hourIndex];
      hourIndex++;
    }
    
    // Convert from Wh to kWh
    monthlyData.push(Math.round(monthTotal / 1000));
  }
  
  return monthlyData;
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

    const body: EnedisSyncRequest = JSON.parse(event.body);

    if (!body.consentId) {
      return formatJSONResponse(400, {
        error: 'VALIDATION_ERROR',
        message: 'consentId est requis.',
      });
    }

    // Find consent by consentId for this user
    const consentsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.USERS,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'consentId = :consentId',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':skPrefix': 'ENEDIS_CONSENT#',
          ':consentId': body.consentId,
        },
      })
    );

    if (!consentsResult.Items || consentsResult.Items.length === 0) {
      return formatJSONResponse(404, {
        error: 'ENEDIS_CONSENT_INVALID',
        message: 'Consentement non trouvé.',
      });
    }

    const consent = consentsResult.Items[0];
    const pdl = consent.pdl;

    // In production, this would call the real Enedis DataConnect API
    // For now, we generate simulated data
    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31, 23, 59, 59).toISOString();

    // Generate simulated hourly data
    const hourlyConsumption = generateSimulatedHourlyData();
    const monthlyAggregated = aggregateToMonthly(hourlyConsumption);

    // Store data in S3
    const s3Key = `${userId}/${pdl}/consumption-${year}.json`;
    const s3Data = {
      pdl,
      userId,
      year,
      syncedAt: now.toISOString(),
      hourlyData: hourlyConsumption.map((consumption, index) => ({
        timestamp: new Date(year, 0, 1, index).toISOString(),
        consumption,
      })),
      monthlyAggregated,
    };

    if (ENEDIS_DATA_BUCKET) {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: ENEDIS_DATA_BUCKET,
          Key: s3Key,
          Body: JSON.stringify(s3Data),
          ContentType: 'application/json',
        })
      );
    }

    // Update consent status and sync info
    await dynamoDb.send(
      new UpdateCommand({
        TableName: Tables.USERS,
        Key: {
          PK: `USER#${userId}`,
          SK: `ENEDIS_CONSENT#${pdl}`,
        },
        UpdateExpression: 'SET #status = :status, lastSyncAt = :lastSyncAt, s3DataKey = :s3Key',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'active',
          ':lastSyncAt': now.toISOString(),
          ':s3Key': s3Key,
        },
      })
    );

    return formatJSONResponse(200, {
      success: true,
      dataRange: {
        start: startDate,
        end: endDate,
      },
      recordCount: hourlyConsumption.length,
      s3Key,
    });
  } catch (error: any) {
    console.error('Error syncing Enedis data:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      error: 'ENEDIS_API_UNAVAILABLE',
      message: 'Erreur lors de la synchronisation des données Enedis',
      details: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
