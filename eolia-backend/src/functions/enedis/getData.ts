import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { formatJSONResponse } from '../../services/response';
import { verifyAuth } from '../../services/auth';
import { dynamoDb, Tables } from '../../services/dynamodb';

const s3Client = new S3Client({ region: process.env.REGION || 'eu-west-1' });
const ENEDIS_DATA_BUCKET = process.env.ENEDIS_DATA_BUCKET || '';

interface EnedisS3Data {
  pdl: string;
  userId: string;
  year: number;
  syncedAt: string;
  hourlyData: { timestamp: string; consumption: number }[];
  monthlyAggregated: number[];
}

async function streamToString(stream: any): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const claims = await verifyAuth(authHeader);
    const userId = claims.sub;

    // Get PDL from query params (optional - if not provided, get latest)
    const pdl = event.queryStringParameters?.pdl;

    // Find active consent(s) for this user
    const consentsResult = await dynamoDb.send(
      new QueryCommand({
        TableName: Tables.USERS,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: '#status = :activeStatus',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':skPrefix': 'ENEDIS_CONSENT#',
          ':activeStatus': 'active',
        },
      })
    );

    if (!consentsResult.Items || consentsResult.Items.length === 0) {
      return formatJSONResponse(404, {
        error: 'ENEDIS_DATA_NOT_FOUND',
        message: 'Aucune donnée Enedis disponible. Veuillez d\'abord synchroniser vos données.',
      });
    }

    // Find the right consent (by PDL if specified, otherwise first active)
    let consent = consentsResult.Items[0];
    if (pdl) {
      const matchingConsent = consentsResult.Items.find(c => c.pdl === pdl);
      if (!matchingConsent) {
        return formatJSONResponse(404, {
          error: 'ENEDIS_DATA_NOT_FOUND',
          message: `Aucune donnée trouvée pour le PDL ${pdl}.`,
        });
      }
      consent = matchingConsent;
    }

    if (!consent.s3DataKey) {
      return formatJSONResponse(404, {
        error: 'ENEDIS_DATA_NOT_FOUND',
        message: 'Données non synchronisées. Veuillez lancer une synchronisation.',
      });
    }

    // Read data from S3
    if (!ENEDIS_DATA_BUCKET) {
      return formatJSONResponse(500, {
        error: 'ENEDIS_API_UNAVAILABLE',
        message: 'Configuration S3 manquante.',
      });
    }

    try {
      const s3Response = await s3Client.send(
        new GetObjectCommand({
          Bucket: ENEDIS_DATA_BUCKET,
          Key: consent.s3DataKey,
        })
      );

      const bodyString = await streamToString(s3Response.Body);
      const s3Data: EnedisS3Data = JSON.parse(bodyString);

      // Extract hourly consumption values only (not the full objects)
      const hourlyConsumption = s3Data.hourlyData.map(d => d.consumption);

      return formatJSONResponse(200, {
        hourlyConsumption,
        monthlyAggregated: s3Data.monthlyAggregated,
        lastSync: s3Data.syncedAt,
        pdl: s3Data.pdl,
      });
    } catch (s3Error: any) {
      if (s3Error.name === 'NoSuchKey') {
        return formatJSONResponse(404, {
          error: 'ENEDIS_DATA_NOT_FOUND',
          message: 'Données expirées ou supprimées. Veuillez relancer une synchronisation.',
        });
      }
      throw s3Error;
    }
  } catch (error: any) {
    console.error('Error getting Enedis data:', error);

    if (error.message.includes('Token')) {
      return formatJSONResponse(401, { message: error.message });
    }

    return formatJSONResponse(500, {
      error: 'ENEDIS_API_UNAVAILABLE',
      message: 'Erreur lors de la récupération des données Enedis',
      details: process.env.STAGE === 'dev' ? error.message : undefined,
    });
  }
};
