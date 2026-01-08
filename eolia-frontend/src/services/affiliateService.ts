import { fetchAuthSession } from 'aws-amplify/auth';
import type { AffiliateProfile, ReferralsResponse, B2BRegistrationData, CommissionsResponse } from '../types/affiliate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Token d'authentification manquant");
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const affiliateService = {
  /**
   * Inscription ambassadeur B2B
   */
  async registerB2B(data: B2BRegistrationData): Promise<AffiliateProfile> {
    const response = await fetch(`${API_URL}/affiliates/b2b`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Erreur lors de l'inscription B2B"
      );
    }

    const result = await response.json();
    return {
      affiliate: result.affiliate,
      stats: {
        totalReferrals: 0,
        activeReferrals: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
      },
    };
  },

  /**
   * Récupérer le profil ambassadeur
   */
  async getProfile(): Promise<AffiliateProfile> {
    const response = await fetch(`${API_URL}/affiliates/me`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || 'Erreur lors de la récupération du profil ambassadeur'
      );
    }

    return response.json();
  },

  /**
   * Récupérer la liste des filleuls
   */
  async getReferrals(filters?: {
    status?: string;
    limit?: number;
  }): Promise<ReferralsResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `${API_URL}/affiliates/me/referrals${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || 'Erreur lors de la récupération des filleuls'
      );
    }

    return response.json();
  },

  /**
   * Récupérer la liste des commissions
   */
  async getCommissions(filters?: {
    status?: string;
    limit?: number;
  }): Promise<CommissionsResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `${API_URL}/affiliates/me/commissions${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || 'Erreur lors de la récupération des commissions'
      );
    }

    return response.json();
  },

  /**
   * Télécharger le contrat B2B
   */
  async downloadContract(): Promise<string> {
    const response = await fetch(`${API_URL}/affiliates/me/contract`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || 'Erreur lors du téléchargement du contrat'
      );
    }

    const result = await response.json();
    return result.contractUrl;
  },
};
