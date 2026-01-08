/**
 * Tests de validation du calculateur de production éolienne
 * Ces tests vérifient la logique de calcul sans framework de test
 */

import { calculateProduction, getDepartments, getAvailablePowers } from './calculatorService'

// Test helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAILED: ${message}`)
  }
  console.log(`✓ ${message}`)
}

function runTests(): void {
  console.log('\n=== Tests du calculateur EOLIA ===\n')

  // Test 1: Vérifier que les départements sont disponibles
  const departments = getDepartments()
  assert(departments.length >= 10, 'Au moins 10 départements disponibles')
  assert(departments.some(d => d.code === '29'), 'Finistère (29) disponible')
  assert(departments.some(d => d.code === '75'), 'Paris (75) disponible')

  // Test 2: Vérifier les puissances disponibles
  const powers = getAvailablePowers()
  assert(powers.includes(1), 'Puissance 1 kWc disponible')
  assert(powers.includes(3), 'Puissance 3 kWc disponible')
  assert(powers.includes(10), 'Puissance 10 kWc disponible')

  // Test 3: Calcul basique - Brest 3kWc 1 éolienne
  const result1 = calculateProduction({
    departmentCode: '29',
    powerKwc: 3,
    turbineCount: 1
  })
  assert(result1.annualProduction > 0, 'Production annuelle > 0 pour Brest')
  assert(result1.annualProduction > 3000, 'Production Brest 3kWc > 3000 kWh (zone ventée)')
  assert(result1.monthlyProduction.length === 12, '12 mois de production')
  assert(result1.annualSavings > 0, 'Économies annuelles > 0')
  assert(!result1.usedAnemometerData, 'Pas de données anémomètre utilisées')

  // Test 4: Calcul Paris vs Brest (Paris moins venté)
  const resultParis = calculateProduction({
    departmentCode: '75',
    powerKwc: 3,
    turbineCount: 1
  })
  assert(resultParis.annualProduction < result1.annualProduction, 
    'Paris produit moins que Brest (moins venté)')

  // Test 5: Scaling linéaire par puissance
  const result3kWc = calculateProduction({
    departmentCode: '29',
    powerKwc: 3,
    turbineCount: 1
  })
  const result6kWc = calculateProduction({
    departmentCode: '29',
    powerKwc: 6,
    turbineCount: 1
  })
  // La production devrait doubler (approximativement) avec le double de puissance
  const ratio = result6kWc.annualProduction / result3kWc.annualProduction
  assert(ratio > 1.8 && ratio < 2.2, `Ratio 6kWc/3kWc proche de 2 (obtenu: ${ratio.toFixed(2)})`)

  // Test 6: Bonus grappe (+5% avec plusieurs éoliennes)
  const result1Turbine = calculateProduction({
    departmentCode: '29',
    powerKwc: 3,
    turbineCount: 1
  })
  const result2Turbines = calculateProduction({
    departmentCode: '29',
    powerKwc: 3,
    turbineCount: 2
  })
  // 2 éoliennes avec bonus 5% = 2 * 1.05 = 2.1x la production d'une seule
  const turbineRatio = result2Turbines.annualProduction / result1Turbine.annualProduction
  assert(turbineRatio > 2.0 && turbineRatio < 2.2, 
    `Ratio 2 turbines/1 turbine avec bonus grappe (obtenu: ${turbineRatio.toFixed(2)})`)

  // Test 7: Données anémomètre - scaling factor
  const resultWithAnemometer = calculateProduction({
    departmentCode: '29',
    powerKwc: 3,
    turbineCount: 1,
    anemometerSpeed: 8.0, // Plus élevé que la moyenne historique
    anemometerMonth: 1
  })
  assert(resultWithAnemometer.usedAnemometerData === true, 'Données anémomètre utilisées')
  assert(resultWithAnemometer.scalingFactor !== undefined, 'Scaling factor calculé')
  assert(resultWithAnemometer.scalingFactor! > 1, 
    'Scaling factor > 1 car vent mesuré > historique')
  assert(resultWithAnemometer.annualProduction > result1.annualProduction,
    'Production plus élevée avec anémomètre indiquant plus de vent')

  // Test 8: Économies calculées correctement
  const electricityPrice = 0.26 // €/kWh
  const expectedSavings = Math.round(result1.annualProduction * electricityPrice)
  assert(result1.annualSavings === expectedSavings, 
    `Économies calculées correctement (${result1.annualSavings}€)`)

  // Test 9: Production mensuelle cohérente
  const sumMonthly = result1.monthlyProduction.reduce((a, b) => a + b, 0)
  assert(sumMonthly === result1.annualProduction, 
    'Somme mensuelle = production annuelle')

  // Test 10: Mois d'hiver plus productifs (plus de vent)
  const winterProduction = result1.monthlyProduction[0] + result1.monthlyProduction[11] // Jan + Dec
  const summerProduction = result1.monthlyProduction[6] + result1.monthlyProduction[7] // Jul + Aug
  assert(winterProduction > summerProduction, 
    'Production hivernale > production estivale (plus de vent en hiver)')

  console.log('\n=== Tous les tests passés ! ===\n')
  
  // Afficher quelques résultats pour validation manuelle
  console.log('Résultats de référence:')
  console.log(`- Brest 3kWc: ${result1.annualProduction} kWh/an, ${result1.annualSavings}€ économisés`)
  console.log(`- Paris 3kWc: ${resultParis.annualProduction} kWh/an`)
  console.log(`- Brest 6kWc: ${result6kWc.annualProduction} kWh/an`)
  console.log(`- Brest 3kWc x2 turbines: ${result2Turbines.annualProduction} kWh/an`)
}

// Export pour pouvoir l'exécuter
export { runTests }

// Auto-run si exécuté directement
if (typeof window === 'undefined') {
  runTests()
}
