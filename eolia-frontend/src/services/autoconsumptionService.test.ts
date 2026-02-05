/**
 * Tests de validation du service autoconsommation
 * Ces tests vérifient la logique de calcul sans framework de test
 */

import {
  calculateMonthlyAutoconsumption,
  generateHourlyProduction,
  calculateHourlyAutoconsumption,
  getTotalHoursInYear,
  HOURS_PER_MONTH,
  WEIBULL_K,
} from './autoconsumptionService';

// Test helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAILED: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function runTests(): void {
  console.log('\n=== Tests du service autoconsommation EOLIA ===\n');

  // ============================================
  // Tests calcul mensuel (Requirements 3.1, 3.2, 3.3)
  // ============================================
  console.log('--- Tests calcul mensuel ---\n');

  // Test 1: Ratio couverture < 1 (production < consommation)
  // Toute la production est autoconsommée
  const prodLow = [500, 450, 600, 700, 800, 900, 850, 800, 700, 600, 500, 450]; // 7850 kWh
  const consoHigh = [1000, 900, 850, 700, 600, 500, 450, 450, 550, 700, 850, 950]; // 8500 kWh
  
  const resultLowRatio = calculateMonthlyAutoconsumption(prodLow, consoHigh);
  
  // When R < 1: autoconsumption = production
  assert(
    resultLowRatio.monthlyAutoconsumption[0] === 500,
    `Ratio < 1: autoconso janvier = production (500 kWh)`
  );
  assert(
    resultLowRatio.monthlySurplus[0] === 0,
    `Ratio < 1: surplus janvier = 0 kWh`
  );

  // Test 2: Ratio couverture > 1 (production > consommation)
  // Autoconsommation limitée par la consommation
  const prodHigh = [1200, 1100, 1000, 900, 800, 700, 650, 650, 750, 900, 1000, 1150]; // 10800 kWh
  const consoLow = [800, 750, 700, 600, 500, 400, 350, 350, 450, 600, 700, 800]; // 7000 kWh
  
  const resultHighRatio = calculateMonthlyAutoconsumption(prodHigh, consoLow);
  
  // When R > 1: autoconsumption = consumption, surplus = prod - conso
  assert(
    resultHighRatio.monthlyAutoconsumption[0] === 800,
    `Ratio > 1: autoconso janvier = consommation (800 kWh)`
  );
  assert(
    resultHighRatio.monthlySurplus[0] === 400,
    `Ratio > 1: surplus janvier = 1200 - 800 = 400 kWh`
  );

  // Test 3: Autoconsommation annuelle = somme des mensuels
  const annualAutoconso = resultHighRatio.monthlyAutoconsumption.reduce((s, v) => s + v, 0);
  assert(
    resultHighRatio.annualAutoconsumption === annualAutoconso,
    `Autoconsommation annuelle = somme mensuels (${annualAutoconso} kWh)`
  );

  // Test 4: Surplus annuel = somme des surplus mensuels
  const annualSurplus = resultHighRatio.monthlySurplus.reduce((s, v) => s + v, 0);
  assert(
    resultHighRatio.annualSurplus === annualSurplus,
    `Surplus annuel = somme mensuels (${annualSurplus} kWh)`
  );

  // Test 5: Taux d'autoconsommation calculé correctement
  const totalProd = prodHigh.reduce((s, v) => s + v, 0);
  const expectedRate = (annualAutoconso / totalProd) * 100;
  assert(
    Math.abs(resultHighRatio.autoconsumptionRate - Math.round(expectedRate * 10) / 10) < 0.1,
    `Taux autoconsommation correct (${resultHighRatio.autoconsumptionRate}%)`
  );

  // Test 6: Économies calculées (autoconso × 0.26€)
  const expectedSavings = Math.round(annualAutoconso * 0.26);
  assert(
    resultHighRatio.annualSavings === expectedSavings,
    `Économies calculées (${resultHighRatio.annualSavings}€)`
  );

  // Test 7: Cas mixte - certains mois R < 1, d'autres R > 1
  const prodMixed = [600, 500, 700, 800, 900, 1000, 950, 900, 800, 700, 600, 550];
  const consoMixed = [800, 750, 650, 600, 550, 500, 450, 450, 550, 650, 750, 850];
  
  const resultMixed = calculateMonthlyAutoconsumption(prodMixed, consoMixed);
  
  // Janvier: prod 600 < conso 800 -> autoconso = 600, surplus = 0
  assert(
    resultMixed.monthlyAutoconsumption[0] === 600 && resultMixed.monthlySurplus[0] === 0,
    `Cas mixte janvier: R < 1 -> autoconso = prod`
  );
  // Juin: prod 1000 > conso 500 -> autoconso = 500, surplus = 500
  assert(
    resultMixed.monthlyAutoconsumption[5] === 500 && resultMixed.monthlySurplus[5] === 500,
    `Cas mixte juin: R > 1 -> autoconso = conso, surplus = 500`
  );

  // ============================================
  // Tests génération Weibull (Requirements 3.4, 3.5)
  // ============================================
  console.log('\n--- Tests génération Weibull ---\n');

  // Test 8: Génération production horaire - nombre d'heures correct
  const monthlyWindSpeed = [5.5, 5.2, 5.0, 4.5, 4.0, 3.8, 3.5, 3.5, 4.0, 4.5, 5.0, 5.5];
  const hourlyProd = generateHourlyProduction(monthlyWindSpeed, 6, 1);
  
  const expectedHours = getTotalHoursInYear(); // 8760
  assert(
    hourlyProd.length === expectedHours,
    `Production horaire: ${hourlyProd.length} heures (attendu: ${expectedHours})`
  );

  // Test 9: Production horaire non négative
  const hasNegative = hourlyProd.some(p => p < 0);
  assert(
    !hasNegative,
    `Production horaire toujours >= 0`
  );

  // Test 10: Production totale cohérente avec puissance installée
  const totalHourlyProd = hourlyProd.reduce((s, v) => s + v, 0);
  // Pour 6kWc avec vent moyen ~4.5 m/s, production annuelle devrait être entre 3000-12000 kWh
  assert(
    totalHourlyProd > 1000 && totalHourlyProd < 20000,
    `Production totale réaliste (${Math.round(totalHourlyProd)} kWh)`
  );

  // Test 11: Scaling avec puissance - 3kWc devrait produire ~moitié de 6kWc
  const hourlyProd3kWc = generateHourlyProduction(monthlyWindSpeed, 3, 1);
  const totalProd3kWc = hourlyProd3kWc.reduce((s, v) => s + v, 0);
  const ratio3to6 = totalProd3kWc / totalHourlyProd;
  assert(
    ratio3to6 > 0.45 && ratio3to6 < 0.55,
    `Scaling puissance: 3kWc ≈ 50% de 6kWc (ratio: ${(ratio3to6 * 100).toFixed(1)}%)`
  );

  // Test 12: Multiple turbines - 2 turbines = ~2× production
  const hourlyProd2Turb = generateHourlyProduction(monthlyWindSpeed, 6, 2);
  const totalProd2Turb = hourlyProd2Turb.reduce((s, v) => s + v, 0);
  const ratio2to1 = totalProd2Turb / totalHourlyProd;
  assert(
    ratio2to1 > 1.9 && ratio2to1 < 2.1,
    `Multiple turbines: 2 turbines ≈ 2× production (ratio: ${ratio2to1.toFixed(2)})`
  );

  // ============================================
  // Tests calcul horaire (Requirements 3.4)
  // ============================================
  console.log('\n--- Tests calcul horaire ---\n');

  // Test 13: Calcul autoconsommation horaire
  // Créer une consommation horaire simple (constante)
  const hourlyConsumption = new Array(expectedHours).fill(0.5); // 0.5 kWh/h = 4380 kWh/an
  
  const resultHourly = calculateHourlyAutoconsumption(hourlyProd, hourlyConsumption);
  
  assert(
    resultHourly.monthlyAutoconsumption.length === 12,
    `Résultat horaire: 12 valeurs mensuelles`
  );

  // Test 14: Autoconsommation horaire <= min(prod, conso) pour chaque heure
  // La somme autoconso + surplus devrait égaler la production totale
  const sumAutocoSurplus = resultHourly.annualAutoconsumption + resultHourly.annualSurplus;
  assert(
    Math.abs(sumAutocoSurplus - Math.round(totalHourlyProd)) < 10,
    `Autoconso + Surplus ≈ Production totale`
  );

  // Test 15: Taux autoconsommation horaire cohérent
  assert(
    resultHourly.autoconsumptionRate >= 0 && resultHourly.autoconsumptionRate <= 100,
    `Taux autoconsommation horaire valide (${resultHourly.autoconsumptionRate}%)`
  );

  // ============================================
  // Tests utilitaires
  // ============================================
  console.log('\n--- Tests utilitaires ---\n');

  // Test 16: Constante WEIBULL_K
  assert(
    WEIBULL_K === 2.0,
    `Paramètre Weibull k = 2.0 (Rayleigh)`
  );

  // Test 17: HOURS_PER_MONTH somme = 8760
  const totalHours = HOURS_PER_MONTH.reduce((s, h) => s + h, 0);
  assert(
    totalHours === 8760,
    `Total heures/an = 8760 (obtenu: ${totalHours})`
  );

  // Test 18: Validation erreur si tableaux incorrects
  let errorThrown = false;
  try {
    calculateMonthlyAutoconsumption([100, 200], [100, 200, 300]);
  } catch {
    errorThrown = true;
  }
  assert(errorThrown, `Erreur levée si tableaux != 12 valeurs`);

  console.log('\n=== Tous les tests autoconsommation passés ! ===\n');

  // Afficher quelques résultats pour validation manuelle
  console.log('Résultats de référence:');
  console.log(`- Ratio < 1: autoconso ${resultLowRatio.annualAutoconsumption} kWh, taux ${resultLowRatio.autoconsumptionRate}%`);
  console.log(`- Ratio > 1: autoconso ${resultHighRatio.annualAutoconsumption} kWh, surplus ${resultHighRatio.annualSurplus} kWh`);
  console.log(`- Production horaire Weibull: ${Math.round(totalHourlyProd)} kWh/an`);
  console.log(`- Autoconso horaire: ${resultHourly.annualAutoconsumption} kWh, taux ${resultHourly.autoconsumptionRate}%`);
}

// Export pour pouvoir l'exécuter
export { runTests };

// Auto-run si exécuté directement
if (typeof window === 'undefined') {
  runTests();
}
