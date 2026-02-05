import { fetchAuthSession } from 'aws-amplify/auth';
import type { ConsumptionData, ConsumptionProfile } from '../types/calculator';
import {
  SEASONAL_PROFILE,
  DEFAULT_ANNUAL_CONSUMPTION,
} from '../types/calculator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Apply the standard French seasonal profile to distribute annual consumption across 12 months.
 * 
 * Profile: Jan 13.5%, Feb 12%, Mar 10.5%, Apr 8%, May 6.5%, Jun 5.5%,
 *          Jul 5%, Aug 5%, Sep 6%, Oct 8%, Nov 9.5%, Dec 10.5%
 * 
 * @param annualTotal - Total annual consumption in kWh
 * @returns Array of 12 monthly consumption values in kWh
 */
export function applySeasonalProfile(annualTotal: number): number[] {
  return SEASONAL_PROFILE.map((percentage) => Math.round(annualTotal * percentage));
}

/**
 * Get the consumption profile for a user.
 * If userId is provided and user has saved data, returns their profile.
 * Otherwise returns a default profile based on DEFAULT_ANNUAL_CONSUMPTION.
 * 
 * @param userId - Optional user ID to fetch saved consumption data
 * @returns ConsumptionProfile with monthly values and source
 */
export async function getConsumptionProfile(userId?: string): Promise<ConsumptionProfile> {
  // If no userId, return default profile
  if (!userId) {
    const monthlyConsumption = applySeasonalProfile(DEFAULT_ANNUAL_CONSUMPTION);
    return {
      monthlyConsumption,
      annualTotal: DEFAULT_ANNUAL_CONSUMPTION,
      source: 'default',
    };
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/consumption`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      // If not found or error, return default profile
      if (response.status === 404) {
        const monthlyConsumption = applySeasonalProfile(DEFAULT_ANNUAL_CONSUMPTION);
        return {
          monthlyConsumption,
          annualTotal: DEFAULT_ANNUAL_CONSUMPTION,
          source: 'default',
        };
      }
      throw new Error('Erreur lors de la récupération du profil de consommation');
    }

    const data = await response.json();
    return {
      monthlyConsumption: data.monthlyValues || applySeasonalProfile(data.annualTotal),
      annualTotal: data.annualTotal,
      source: data.mode || 'simple',
    };
  } catch {
    // On error, return default profile
    const monthlyConsumption = applySeasonalProfile(DEFAULT_ANNUAL_CONSUMPTION);
    return {
      monthlyConsumption,
      annualTotal: DEFAULT_ANNUAL_CONSUMPTION,
      source: 'default',
    };
  }
}

/**
 * Save the consumption profile for a user.
 * 
 * @param userId - User ID (required for saving)
 * @param data - Consumption data to save
 * @throws Error if save fails
 */
export async function saveConsumptionProfile(
  userId: string,
  data: ConsumptionData
): Promise<void> {
  if (!userId) {
    throw new Error('Utilisateur non connecté');
  }

  const headers = await getAuthHeaders();
  
  // Prepare payload based on mode
  const payload: {
    mode: string;
    annualTotal?: number;
    monthlyValues?: number[];
  } = {
    mode: data.mode,
  };

  if (data.mode === 'simple' && data.annualTotal !== undefined) {
    payload.annualTotal = data.annualTotal;
    payload.monthlyValues = applySeasonalProfile(data.annualTotal);
  } else if (data.mode === 'precise' && data.monthlyValues) {
    payload.monthlyValues = data.monthlyValues;
    payload.annualTotal = data.monthlyValues.reduce((sum, val) => sum + val, 0);
  }

  const response = await fetch(`${API_URL}/consumption`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la sauvegarde du profil de consommation');
  }
}

/**
 * Validate consumption values are within realistic bounds.
 * 
 * @param values - Array of monthly consumption values
 * @returns Validation result with valid flag and optional message
 */
export function validateConsumption(values: number[]): { valid: boolean; message?: string } {
  if (values.length !== 12) {
    return { valid: false, message: 'Veuillez renseigner les 12 mois' };
  }

  const total = values.reduce((sum, val) => sum + val, 0);
  
  if (total < 1000) {
    return { valid: false, message: 'Consommation trop faible (minimum 1000 kWh/an)' };
  }
  
  if (total > 50000) {
    return { valid: false, message: 'Consommation trop élevée (maximum 50000 kWh/an)' };
  }

  // Check for negative values
  if (values.some((val) => val < 0)) {
    return { valid: false, message: 'Les valeurs ne peuvent pas être négatives' };
  }

  return { valid: true };
}

/**
 * Calculate the sum of seasonal profile percentages (should equal 1.0).
 * Useful for validation and testing.
 * 
 * @returns Sum of all seasonal profile percentages
 */
export function getSeasonalProfileSum(): number {
  return SEASONAL_PROFILE.reduce((sum, val) => sum + val, 0);
}
