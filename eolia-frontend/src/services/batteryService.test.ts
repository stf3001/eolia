/**
 * Tests de validation du service batterie
 * Ces tests vérifient la logique de calcul sans framework de test
 */

import {
  calculateBatteryImpact,
  calculateMaxUsefulCapacity,
  isBatteryFullyUtilized,
} from './batteryService';
import { CYCLES_PER_YEAR, ELECTRICITY_PRICE } from '../types/calculator';

// Test helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAILED: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function runTests(): void {
  console.log('\n=== Tests du service batterie EOLIA ===\n');

  // Test 1: Calcul gain batterie basique (5 kWh)
  const result5kWh = calculateBatteryImpact(5, 3000, 8000, 10000);
  const expectedGain5 = 5 * CYCLES_PER_YEAR; // 1500 kWh
  assert(
    result5kWh.batteryGain === expectedGain5,
    `Gain batterie 5kWh = ${expectedGain5} kWh (obtenu: ${result5kWh.batteryGain})`
  );

  // Test 2: Calcul gain batterie avec différentes capacités
  const result10kWh = calculateBatteryImpact(10, 3000, 8000, 10000);
  const expectedGain10 = 10 * CYCLES_PER_YEAR; // 3000 kWh
  assert(
    result10kWh.batteryGain === expectedGain10,
    `Gain batterie 10kWh = ${expectedGain10} kWh (obtenu: ${result10kWh.batteryGain})`
  );

  // Test 3: Autoconsommation totale = naturelle + batterie
  assert(
    result5kWh.totalAutoconsumption === 3000 + result5kWh.batteryGain,
    `Autoconsommation totale = naturelle + gain batterie`
  );

  // Test 4: Économies supplémentaires calculées correctement
  const expectedSavings = result5kWh.batteryGain * ELECTRICITY_PRICE;
  assert(
    result5kWh.additionalSavings === Math.round(expectedSavings),
    `Économies supplémentaires calculées (${result5kWh.additionalSavings}€)`
  );

  // Test 5: Plafonnement par la production (production < consommation)
  // Production 5000, Conso 10000, Natural 2000 -> max autoconso = 5000
  const resultCappedByProd = calculateBatteryImpact(20, 2000, 5000, 10000);
  // Gain max = 5000 - 2000 = 3000, mais 20kWh * 300 = 6000 -> plafonné à 3000
  assert(
    resultCappedByProd.totalAutoconsumption <= 5000,
    `Autoconsommation plafonnée par production (${resultCappedByProd.totalAutoconsumption} <= 5000)`
  );

  // Test 6: Plafonnement par la consommation (consommation < production)
  // Production 15000, Conso 8000, Natural 4000 -> max autoconso = 8000
  const resultCappedByConso = calculateBatteryImpact(20, 4000, 15000, 8000);
  // Gain max = 8000 - 4000 = 4000, mais 20kWh * 300 = 6000 -> plafonné à 4000
  assert(
    resultCappedByConso.totalAutoconsumption <= 8000,
    `Autoconsommation plafonnée par consommation (${resultCappedByConso.totalAutoconsumption} <= 8000)`
  );

  // Test 7: Taux d'autoconsommation calculé correctement
  const rate = (result5kWh.totalAutoconsumption / 8000) * 100;
  assert(
    Math.abs(result5kWh.autoconsumptionRate - Math.round(rate * 10) / 10) < 0.1,
    `Taux autoconsommation correct (${result5kWh.autoconsumptionRate}%)`
  );

  // Test 8: Valeur par défaut consommation (10000 kWh)
  const resultDefault = calculateBatteryImpact(5, 3000, 8000);
  assert(
    resultDefault.batteryGain > 0,
    'Calcul fonctionne avec consommation par défaut'
  );

  // Test 9: Capacité utile maximale
  const maxCapacity = calculateMaxUsefulCapacity(3000, 8000, 10000);
  // Available = min(8000, 10000) - 3000 = 5000, capacity = 5000/300 ≈ 17
  assert(
    maxCapacity > 0 && maxCapacity <= 20,
    `Capacité utile max calculée (${maxCapacity} kWh)`
  );

  // Test 10: Vérification utilisation complète batterie
  const smallBattery = calculateBatteryImpact(5, 2000, 10000, 12000);
  const isFullyUsed = isBatteryFullyUtilized(5, smallBattery);
  assert(isFullyUsed === true, 'Petite batterie entièrement utilisée');

  const largeBattery = calculateBatteryImpact(35, 2000, 5000, 6000);
  const isLargeFullyUsed = isBatteryFullyUtilized(35, largeBattery);
  assert(isLargeFullyUsed === false, 'Grande batterie partiellement utilisée (plafonnée)');

  console.log('\n=== Tous les tests batterie passés ! ===\n');

  // Afficher quelques résultats pour validation manuelle
  console.log('Résultats de référence:');
  console.log(`- Batterie 5kWh: gain ${result5kWh.batteryGain} kWh, économies ${result5kWh.additionalSavings}€`);
  console.log(`- Batterie 10kWh: gain ${result10kWh.batteryGain} kWh, économies ${result10kWh.additionalSavings}€`);
  console.log(`- Plafonnement prod: autoconso totale ${resultCappedByProd.totalAutoconsumption} kWh`);
  console.log(`- Plafonnement conso: autoconso totale ${resultCappedByConso.totalAutoconsumption} kWh`);
}

// Export pour pouvoir l'exécuter
export { runTests };

// Auto-run si exécuté directement
if (typeof window === 'undefined') {
  runTests();
}
