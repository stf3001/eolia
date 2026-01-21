import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.REGION || 'eu-west-1',
});

export const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const Tables = {
  PRODUCTS: process.env.PRODUCTS_TABLE || '',
  USERS: process.env.USERS_TABLE || '',
  ORDERS: process.env.ORDERS_TABLE || '',
  ADDRESSES: process.env.ADDRESSES_TABLE || '',
  AFFILIATES: process.env.AFFILIATES_TABLE || '',
  REFERRALS: process.env.REFERRALS_TABLE || '',
  COMMISSIONS: process.env.COMMISSIONS_TABLE || '',
  SIMULATIONS: process.env.SIMULATIONS_TABLE || '',
  ORDER_DOSSIERS: process.env.ORDER_DOSSIERS_TABLE || '',
  DOSSIER_EVENTS: process.env.DOSSIER_EVENTS_TABLE || '',
  DOSSIER_DOCUMENTS: process.env.DOSSIER_DOCUMENTS_TABLE || '',
};
