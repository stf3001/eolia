// Types et interfaces pour le programme ambassadeur

export type AffiliateType = 'B2C' | 'B2B';
export type AffiliateStatus = 'active' | 'suspended' | 'inactive';
export type ReferralStatus = 'submitted' | 'registered' | 'first_purchase' | 'active';
export type CommissionStatus = 'pending' | 'validated' | 'paid' | 'cancelled';
export type CommissionType = 'voucher' | 'cash';

export interface Affiliate {
  affiliateId: string;
  userId: string;
  email: string;
  type: AffiliateType;
  code: string;
  status: AffiliateStatus;
  
  // B2C specific
  referralCount?: number;
  referralLimit?: number;
  yearlyResetDate?: string;
  
  // B2B specific
  companyName?: string;
  siret?: string;
  siretValidated?: boolean;
  legalName?: string;
  phone?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalAddress?: string;
  contractUrl?: string;
  contractSignedAt?: string;
  cumulativeRevenue?: number;
  currentTier?: number;
  
  // Audit
  createdAt: number;
  updatedAt?: number;
}

export interface Referral {
  referralId: string;
  affiliateId: string;
  referredUserId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  status: ReferralStatus;
  source: 'registration' | 'manual_submission';
  firstPurchaseAt?: number;
  totalPurchases?: number;
  totalRevenue?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface Commission {
  commissionId: string;
  affiliateId: string;
  referralId: string;
  orderId: string;
  amount: number;
  type: CommissionType;
  currency: string;
  orderAmount: number;
  commissionRate?: number;
  tier?: number;
  status: CommissionStatus;
  validatedAt?: number;
  paidAt?: number;
  createdAt: number;
}

export interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
}

export interface AffiliateProfile {
  affiliate: Affiliate;
  stats: AffiliateStats;
}

export interface ReferralsResponse {
  referrals: Referral[];
  total: number;
}

// B2C Rewards structure
export interface B2CReward {
  referralNumber: number;
  amount: number;
  status: 'earned' | 'pending' | 'locked';
}

export const B2C_REWARDS = [
  { referralNumber: 1, amount: 200 },
  { referralNumber: 2, amount: 250 },
  { referralNumber: 3, amount: 300 },
  { referralNumber: 4, amount: 300 },
  { referralNumber: 5, amount: 300 },
  { referralNumber: 6, amount: 300 },
  { referralNumber: 7, amount: 300 },
  { referralNumber: 8, amount: 300 },
  { referralNumber: 9, amount: 300 },
  { referralNumber: 10, amount: 300 },
];

export const B2C_REFERRAL_LIMIT = 10;

// B2B Registration data
export interface B2BRegistrationData {
  companyName: string;
  siret: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalAddress?: string;
  contractAccepted: boolean;
  consentGiven: boolean;
}

// B2B Commission tiers
export const B2B_COMMISSION_TIERS = [
  { rate: 5, threshold: 0, max: 9999, label: '< 10k€' },
  { rate: 7.5, threshold: 10000, max: 49999, label: '10k - 50k€' },
  { rate: 10, threshold: 50000, max: 99999, label: '50k - 100k€' },
  { rate: 12.5, threshold: 100000, max: Infinity, label: '≥ 100k€' },
];

// Commissions response
export interface CommissionStats {
  totalPending: number;
  totalValidated: number;
  totalPaid: number;
  currentTier?: number;
}

export interface CommissionsResponse {
  commissions: Commission[];
  stats: CommissionStats;
}
