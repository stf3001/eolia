import type { BatteryResults } from '../types/calculator';
import {
  CYCLES_PER_YEAR,
  ELECTRICITY_PRICE,
  DEFAULT_ANNUAL_CONSUMPTION,
} from '../types/calculator';

/**
 * Calculate the impact of adding a battery to the wind installation.
 *
 * The battery gain is calculated as: capacity × CYCLES_PER_YEAR (300)
 * This represents the additional energy that can be self-consumed thanks to storage.
 *
 * The total autoconsumption is capped at min(production, consumption) since
 * you cannot consume more than you produce or more than you need.
 *
 * @param capacity - Battery capacity in kWh
 * @param naturalAutoconsumption - Energy already self-consumed without battery (kWh)
 * @param annualProduction - Total annual wind production (kWh)
 * @param annualConsumption - Total annual household consumption (kWh), defaults to 10000
 * @returns BatteryResults with gain, total autoconsumption, savings and rate
 */
export function calculateBatteryImpact(
  capacity: number,
  naturalAutoconsumption: number,
  annualProduction: number,
  annualConsumption: number = DEFAULT_ANNUAL_CONSUMPTION
): BatteryResults {
  // Calculate theoretical battery gain: capacity × 300 cycles/year
  const theoreticalGain = capacity * CYCLES_PER_YEAR;

  // Maximum possible autoconsumption is limited by both production and consumption
  const maxAutoconsumption = Math.min(annualProduction, annualConsumption);

  // Calculate actual battery gain (cannot exceed what's available after natural autoconsumption)
  const availableForBattery = maxAutoconsumption - naturalAutoconsumption;
  const batteryGain = Math.max(0, Math.min(theoreticalGain, availableForBattery));

  // Total autoconsumption = natural + battery gain
  const totalAutoconsumption = naturalAutoconsumption + batteryGain;

  // Additional savings from battery (€)
  const additionalSavings = batteryGain * ELECTRICITY_PRICE;

  // Autoconsumption rate as percentage of production
  const autoconsumptionRate =
    annualProduction > 0 ? (totalAutoconsumption / annualProduction) * 100 : 0;

  return {
    batteryGain: Math.round(batteryGain),
    totalAutoconsumption: Math.round(totalAutoconsumption),
    additionalSavings: Math.round(additionalSavings),
    autoconsumptionRate: Math.round(autoconsumptionRate * 10) / 10, // 1 decimal
  };
}

/**
 * Calculate the maximum useful battery capacity for a given installation.
 * Beyond this capacity, additional storage provides no benefit.
 *
 * @param naturalAutoconsumption - Energy already self-consumed without battery (kWh)
 * @param annualProduction - Total annual wind production (kWh)
 * @param annualConsumption - Total annual household consumption (kWh)
 * @returns Maximum useful capacity in kWh
 */
export function calculateMaxUsefulCapacity(
  naturalAutoconsumption: number,
  annualProduction: number,
  annualConsumption: number
): number {
  const maxAutoconsumption = Math.min(annualProduction, annualConsumption);
  const availableForBattery = maxAutoconsumption - naturalAutoconsumption;

  // Convert to capacity: available kWh / 300 cycles
  const maxCapacity = availableForBattery / CYCLES_PER_YEAR;

  return Math.max(0, Math.round(maxCapacity));
}

/**
 * Check if a battery capacity would be fully utilized.
 * Returns true if the battery gain equals the theoretical maximum (capacity × 300).
 *
 * @param capacity - Battery capacity in kWh
 * @param results - Results from calculateBatteryImpact
 * @returns true if battery is fully utilized
 */
export function isBatteryFullyUtilized(capacity: number, results: BatteryResults): boolean {
  const theoreticalGain = capacity * CYCLES_PER_YEAR;
  return results.batteryGain >= theoreticalGain;
}
