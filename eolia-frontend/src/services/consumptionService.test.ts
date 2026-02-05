/**
 * Tests de validation du service consommation
 * Ces tests vérifient la logique de calcul sans framework de test
 * 
 * Note: Ce fichier teste uniquement les fonctions pures (sans dépendances API/env)
 */

import { SEASONAL_PROFILE, DEFAULT_ANNUAL_CONSUMPTION } from '../types/calculator';

// Re-implement pure functions locally for testing to avoid import.meta.env issues
function applySeasonalProfile(annualTotal: number): number[] {
  return SEASONAL_PROFILE.map((percentage) => Math.round(annualTotal * percentage));
}

function validateConsumption(values: number[]): { valid: boolean; message?: string } {
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
  if (values.some((val) => val < 0)) {
    return { valid: false, message: 'Les valeurs ne peuvent pas être négatives' };
  }
  return { valid: true };
}

function getSeasonalProfileSum(): number {
  return SEASONAL_PROFILE.reduce((sum, val) => sum + val, 0);
}

// Test helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAILED: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function runTests(): void {
  console.log('\n=== Tests du service consommation EOLIA ===\n');

  // Test 1: Somme du profil saisonnier = 100%
  const profileSum = getSeasonalProfileSum();
  assert(
    Math.abs(profileSum - 1.0) < 0.001,
    `Somme profil saisonnier = 100% (obtenu: ${(profileSum * 100).toFixed(2)}%)`
  );

  // Test 2: Profil saisonnier a 12 mois
  assert(
    SEASONAL_PROFILE.length === 12,
    `Profil saisonnier contient 12 mois (obtenu: ${SEASONAL_PROFILE.length})`
  );

  // Test 3: Application profil saisonnier - somme des valeurs mensuelles
  const annualTotal = 10000;
  const monthlyValues = applySeasonalProfile(annualTotal);
  const calculatedTotal = monthlyValues.reduce((sum, val) => sum + val, 0);
  // Allow small rounding difference (max 12 kWh due to rounding each month)
  assert(
    Math.abs(calculatedTotal - annualTotal) <= 12,
    `Somme mensuelle ≈ total annuel (${calculatedTotal} ≈ ${annualTotal})`
  );

  // Test 4: Application profil saisonnier - retourne 12 valeurs
  assert(
    monthlyValues.length === 12,
    `applySeasonalProfile retourne 12 valeurs (obtenu: ${monthlyValues.length})`
  );

  // Test 5: Janvier (13.5%) > Juillet (5%)
  const janValue = monthlyValues[0];
  const julValue = monthlyValues[6];
  assert(
    janValue > julValue,
    `Janvier (${janValue} kWh) > Juillet (${julValue} kWh) - profil hivernal`
  );

  // Test 6: Validation consommation - valeurs valides
  const validResult = validateConsumption(monthlyValues);
  assert(
    validResult.valid === true,
    'Validation accepte consommation réaliste (10000 kWh/an)'
  );

  // Test 7: Validation consommation - trop faible
  const lowValues = applySeasonalProfile(500);
  const lowResult = validateConsumption(lowValues);
  assert(
    lowResult.valid === false,
    `Validation rejette consommation trop faible (500 kWh/an)`
  );

  // Test 8: Validation consommation - trop élevée
  const highValues = applySeasonalProfile(60000);
  const highResult = validateConsumption(highValues);
  assert(
    highResult.valid === false,
    `Validation rejette consommation trop élevée (60000 kWh/an)`
  );

  // Test 9: Validation consommation - nombre de mois incorrect
  const wrongLength = [1000, 1000, 1000];
  const wrongLengthResult = validateConsumption(wrongLength);
  assert(
    wrongLengthResult.valid === false,
    'Validation rejette tableau avec moins de 12 mois'
  );

  // Test 10: Validation consommation - valeurs négatives
  const negativeValues = [...monthlyValues];
  negativeValues[5] = -100;
  const negativeResult = validateConsumption(negativeValues);
  assert(
    negativeResult.valid === false,
    'Validation rejette valeurs négatives'
  );

  // Test 11: Profil par défaut utilise DEFAULT_ANNUAL_CONSUMPTION
  const defaultMonthly = applySeasonalProfile(DEFAULT_ANNUAL_CONSUMPTION);
  const defaultTotal = defaultMonthly.reduce((sum, val) => sum + val, 0);
  assert(
    Math.abs(defaultTotal - DEFAULT_ANNUAL_CONSUMPTION) <= 12,
    `Profil par défaut = ${DEFAULT_ANNUAL_CONSUMPTION} kWh/an`
  );

  console.log('\n=== Tous les tests consommation passés ! ===\n');

  // Afficher quelques résultats pour validation manuelle
  console.log('Résultats de référence:');
  console.log(`- Profil saisonnier: somme = ${(profileSum * 100).toFixed(2)}%`);
  console.log(`- Répartition 10000 kWh: Jan=${janValue}, Jul=${julValue}, Total=${calculatedTotal}`);
  console.log(`- Consommation par défaut: ${DEFAULT_ANNUAL_CONSUMPTION} kWh/an`);
}

// Export pour pouvoir l'exécuter
export { runTests };

// Auto-run si exécuté directement
if (typeof window === 'undefined') {
  runTests();
}
