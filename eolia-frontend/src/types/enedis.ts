// Types for Enedis DataConnect integration

/** Enedis consent form data */
export interface EnedisConsent {
  pdl: string;           // Point de Livraison (14 chiffres)
  lastName: string;
  address: string;
  consentDate?: string;  // ISO date
  status?: 'pending' | 'active' | 'revoked';
}

/** Enedis consent API request */
export interface EnedisConsentRequest {
  pdl: string;
  lastName: string;
  address: string;
}

/** Enedis consent API response */
export interface EnedisConsentResponse {
  consentId: string;
  status: 'pending' | 'active';
  createdAt: string;
}

/** Enedis consumption data structure */
export interface EnedisConsumption {
  hourlyConsumption: number[];   // 8760 valeurs horaires (Wh)
  monthlyAggregated: number[];   // 12 valeurs mensuelles (kWh)
  lastSync: string;              // ISO date de dernière synchronisation
  pdl: string;
}

/** Enedis data API response */
export interface EnedisDataResponse {
  hourlyConsumption: number[];   // 8760 valeurs
  monthlyAggregated: number[];   // 12 valeurs
  lastSync: string;
  pdl: string;
}

/** Enedis sync request */
export interface EnedisSyncRequest {
  consentId: string;
}

/** Enedis sync response */
export interface EnedisSyncResponse {
  success: boolean;
  dataRange: { start: string; end: string };
  recordCount: number;
  s3Key: string;
}

/** Enedis error codes */
export type EnedisErrorCode =
  | 'ENEDIS_CONSENT_INVALID'
  | 'ENEDIS_API_UNAVAILABLE'
  | 'ENEDIS_DATA_NOT_FOUND'
  | 'ENEDIS_CONSENT_EXPIRED';

/** Enedis error response */
export interface EnedisError {
  code: EnedisErrorCode;
  message: string;
}

/** PDL validation helper */
export function isValidPDL(pdl: string): boolean {
  return /^\d{14}$/.test(pdl);
}
