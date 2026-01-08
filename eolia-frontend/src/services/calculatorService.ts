import windDataJson from '../data/windData.json';
import turbineModelsJson from '../data/turbineModels.json';
import type {
  CalculatorInputs,
  CalculatorResults,
  WindData,
  TurbineModelsData,
  DepartmentOption,
} from '../types/calculator';

const windData = windDataJson as WindData;
const turbineModels = turbineModelsJson as TurbineModelsData;

/**
 * Linear interpolation on the power curve
 * Returns the power output (kW) for a given wind speed
 */
function interpolatePowerCurve(windSpeed: number): number {
  const { windSpeedMs, powerKw } = turbineModels.tulipe.powerCurve;

  // Below minimum wind speed
  if (windSpeed <= windSpeedMs[0]) {
    return powerKw[0];
  }

  // Above maximum wind speed
  if (windSpeed >= windSpeedMs[windSpeedMs.length - 1]) {
    return powerKw[powerKw.length - 1];
  }

  // Find the two points to interpolate between
  for (let i = 0; i < windSpeedMs.length - 1; i++) {
    if (windSpeed >= windSpeedMs[i] && windSpeed < windSpeedMs[i + 1]) {
      const x0 = windSpeedMs[i];
      const x1 = windSpeedMs[i + 1];
      const y0 = powerKw[i];
      const y1 = powerKw[i + 1];

      // Linear interpolation formula: y = y0 + (x - x0) * (y1 - y0) / (x1 - x0)
      return y0 + ((windSpeed - x0) * (y1 - y0)) / (x1 - x0);
    }
  }

  return 0;
}

/**
 * Scale power output based on selected kWc
 * Base model is 6 kWc, scaling is linear
 */
function scalePowerByKwc(powerKw: number, selectedKwc: number): number {
  const nominalKwc = turbineModels.tulipe.nominalPowerKwc;
  return powerKw * (selectedKwc / nominalKwc);
}

/**
 * Calculate the scaling factor when anemometer data is provided
 * Compares measured wind speed to historical data for that month
 */
function calculateScalingFactor(
  departmentCode: string,
  anemometerSpeed: number,
  anemometerMonth: number
): number {
  const department = windData.departments[departmentCode];
  if (!department) return 1;

  const historicalSpeed = department.monthlyWindSpeed[anemometerMonth.toString()];
  if (!historicalSpeed || historicalSpeed === 0) return 1;

  return anemometerSpeed / historicalSpeed;
}

/**
 * Get list of available departments for the calculator
 */
export function getDepartments(): DepartmentOption[] {
  return Object.entries(windData.departments).map(([code, data]) => ({
    code,
    name: data.name,
  }));
}

/**
 * Get available power options (kWc)
 */
export function getAvailablePowers(): number[] {
  return turbineModels.tulipe.availablePowers;
}

/**
 * Main calculator function
 * Calculates annual and monthly production based on inputs
 */
export function calculateProduction(inputs: CalculatorInputs): CalculatorResults {
  const { departmentCode, powerKwc, turbineCount, anemometerSpeed, anemometerMonth } = inputs;

  const department = windData.departments[departmentCode];
  if (!department) {
    throw new Error(`Département non trouvé: ${departmentCode}`);
  }

  const { hoursPerMonth, grappeBonus, electricityPricePerKwh } = turbineModels.constants;

  // Calculate scaling factor if anemometer data provided
  let scalingFactor: number | undefined;
  const usedAnemometerData =
    anemometerSpeed !== undefined &&
    anemometerSpeed > 0 &&
    anemometerMonth !== undefined &&
    anemometerMonth >= 1 &&
    anemometerMonth <= 12;

  if (usedAnemometerData) {
    scalingFactor = calculateScalingFactor(departmentCode, anemometerSpeed!, anemometerMonth!);
  }

  // Calculate monthly production
  const monthlyProduction: number[] = [];

  for (let month = 1; month <= 12; month++) {
    let windSpeed = department.monthlyWindSpeed[month.toString()];

    // Apply scaling factor if anemometer data was provided
    if (scalingFactor !== undefined) {
      windSpeed = windSpeed * scalingFactor;
    }

    // Get power from curve (for base 6kWc model)
    const basePower = interpolatePowerCurve(windSpeed);

    // Scale to selected kWc
    const scaledPower = scalePowerByKwc(basePower, powerKwc);

    // Calculate energy for this month (kWh)
    // Power (kW) × hours in month × number of turbines
    let monthlyEnergy = scaledPower * hoursPerMonth[month - 1] * turbineCount;

    // Apply grappe bonus if multiple turbines (+5%)
    if (turbineCount > 1) {
      monthlyEnergy = monthlyEnergy * (1 + grappeBonus);
    }

    monthlyProduction.push(Math.round(monthlyEnergy));
  }

  // Calculate annual totals
  const annualProduction = monthlyProduction.reduce((sum, val) => sum + val, 0);
  const annualSavings = Math.round(annualProduction * electricityPricePerKwh);

  return {
    annualProduction,
    monthlyProduction,
    annualSavings,
    scalingFactor,
    usedAnemometerData,
  };
}

/**
 * Get month names in French
 */
export function getMonthNames(): string[] {
  return [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
}
