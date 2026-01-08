import { v4 as uuidv4 } from 'uuid';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, Tables } from './dynamodb';

// Génère un code parrainage unique de 8 caractères (exclut caractères ambigus)
export const generateAffiliateCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Génère un code unique en vérifiant qu'il n'existe pas déjà
export const generateUniqueCode = async (): Promise<string> => {
  let attempts = 0;
  
  while (attempts < 10) {
    const code = generateAffiliateCode();
    const existing = await getAffiliateByCode(code);
    if (!existing) {
      return code;
    }
    attempts++;
  }
  
  throw new Error('Unable to generate unique code after 10 attempts');
};

// Paliers de commission B2B
export const getCommissionRate = (cumulativeRevenue: number): number => {
  if (cumulativeRevenue >= 100000) return 12.5;
  if (cumulativeRevenue >= 50000) return 10;
  if (cumulativeRevenue >= 10000) return 7.5;
  return 5;
};

// Récompenses B2C (bons d'achat)
export const getB2CReward = (referralCount: number): number => {
  if (referralCount >= 3) return 300;
  if (referralCount === 2) return 250;
  return 200;
};

export const B2C_REFERRAL_LIMIT = 10;

export interface AuditMetadata {
  ip: string;
  userAgent: string;
  timestamp: number;
}

export interface B2CAffiliateData {
  userId: string;
  email: string;
}

export interface CreateAffiliateParams {
  userId: string;
  email: string;
  type: 'B2C' | 'B2B';
  companyName?: string;
  siret?: string;
}

/**
 * Crée un affiliate B2C automatiquement lors de l'inscription
 */
export const createB2CAffiliate = async (
  data: B2CAffiliateData,
  metadata: AuditMetadata
) => {
  const affiliateId = uuidv4();
  const code = await generateUniqueCode();
  const now = Date.now();

  const affiliate = {
    affiliateId,
    userId: data.userId,
    email: data.email,
    code,
    type: 'B2C' as const,
    status: 'active',
    referralCount: 0,
    referralLimit: B2C_REFERRAL_LIMIT,
    yearlyResetDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    createdAt: now,
    updatedAt: now,
    createdIp: metadata.ip,
    createdUserAgent: metadata.userAgent,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: Tables.AFFILIATES,
      Item: affiliate,
    })
  );

  return affiliate;
};

export const createAffiliate = async (params: CreateAffiliateParams) => {
  const affiliateId = uuidv4();
  const code = await generateUniqueCode();
  const now = Date.now();

  const affiliate = {
    affiliateId,
    userId: params.userId,
    email: params.email,
    code,
    type: params.type,
    status: 'active',
    referralCount: 0,
    referralLimit: params.type === 'B2C' ? B2C_REFERRAL_LIMIT : undefined,
    companyName: params.companyName,
    siret: params.siret,
    cumulativeRevenue: params.type === 'B2B' ? 0 : undefined,
    currentTier: params.type === 'B2B' ? 5 : undefined,
    createdAt: now,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: Tables.AFFILIATES,
      Item: affiliate,
    })
  );

  return affiliate;
};

export const getAffiliateByUserId = async (userId: string) => {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.AFFILIATES,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  );

  return result.Items?.[0];
};

export const getAffiliateByCode = async (code: string) => {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: Tables.AFFILIATES,
      IndexName: 'CodeIndex',
      KeyConditionExpression: 'code = :code',
      ExpressionAttributeValues: {
        ':code': code,
      },
    })
  );

  return result.Items?.[0];
};
