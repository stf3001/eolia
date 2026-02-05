import { ELECTRICITY_PRICE } from '../types/calculator';

// ============================================
// Types for Autoconsumption Calculations
// ============================================

/** Results from autoconsumption calculation */
export interface AutoconsumptionResults {
  monthlyAutoconsumption: number[];  // 12 values in kWh
  monthlySurplus: number[];          // 12 values in kWh
  annualAutoconsumption: number;     // Total kWh
  annualSurplus: number;             // Total kWh
  autoconsumptionRate: number;       // % of production self-consumed
  annualSavings: number;             // € saved from autoconsumption
}

// ============================================
// Weibull Distribution Constants
// ============================================

/** Weibull shape parameter (k=2.0 for wind distribution) */
export const WEIBULL_K = 2.0;

/** Hours per month for hourly calculations */
export const HOURS_PER_MONTH = [744, 672, 744, 720, 744, 720, 744, 744, 720, 744, 720, 744];

// ============================================
// Monthly Autoconsumption Calculation
// ============================================

/**
 * Calculate monthly autoconsumption by comparing production and consumption.
 * 
 * For each month:
 * - If production <= consumption: autoconsumption = production (all is consumed)
 * - If production > consumption: autoconsumption = consumption, surplus = production - consumption
 * 
 * This implements the coverage ratio logic from Requirements 3.1, 3.2, 3.3
 * 
 * @param monthlyProduction - Array of 12 monthly production values in kWh
 * @param monthlyConsumption - Array of 12 monthly consumption values in kWh
 * @returns AutoconsumptionResults with monthly and annual values
 */
export function calculateMonthlyAutoconsumption(
  monthlyProduction: number[],
  monthlyConsumption: number[]
): AutoconsumptionResults {
  if (monthlyProduction.length !== 12 || monthlyConsumption.length !== 12) {
    throw new Error('Les tableaux de production et consommation doivent contenir 12 valeurs');
  }

  const monthlyAutoconsumption: number[] = [];
  const monthlySurplus: number[] = [];

  for (let i = 0; i < 12; i++) {
    const prod = monthlyProduction[i];
    const conso = monthlyConsumption[i];

    // Coverage ratio R = Production / Consumption
    // If R <= 1: autoconsumption = production (all production is consumed)
    // If R > 1: autoconsumption = consumption (limited by demand), surplus exists
    const autoconso = Math.min(prod, conso);
    const surplus = Math.max(0, prod - conso);

    monthlyAutoconsumption.push(Math.round(autoconso));
    monthlySurplus.push(Math.round(surplus));
  }

  const annualAutoconsumption = monthlyAutoconsumption.reduce((sum, val) => sum + val, 0);
  const annualSurplus = monthlySurplus.reduce((sum, val) => sum + val, 0);
  const totalProduction = monthlyProduction.reduce((sum, val) => sum + val, 0);

  // Autoconsumption rate = (Total Autoconsumption / Total Production) × 100
  const autoconsumptionRate = totalProduction > 0 
    ? (annualAutoconsumption / totalProduction) * 100 
    : 0;

  // Savings from autoconsumption
  const annualSavings = annualAutoconsumption * ELECTRICITY_PRICE;

  return {
    monthlyAutoconsumption,
    monthlySurplus,
    annualAutoconsumption,
    annualSurplus,
    autoconsumptionRate: Math.round(autoconsumptionRate * 10) / 10, // 1 decimal
    annualSavings: Math.round(annualSavings),
  };
}


// ============================================
// Weibull Distribution Functions
// ============================================

/**
 * Calculate the Weibull scale parameter (lambda) from mean wind speed.
 * For k=2 (Rayleigh distribution): lambda = mean / sqrt(pi/4) ≈ mean / 0.8862
 * 
 * @param meanSpeed - Mean wind speed in m/s
 * @returns Scale parameter lambda
 */
function calculateWeibullScale(meanSpeed: number): number {
  // For k=2: lambda = mean * sqrt(4/pi) ≈ mean * 1.128
  return meanSpeed * Math.sqrt(4 / Math.PI);
}

/**
 * Calculate Weibull probability density function (PDF).
 * f(v) = (k/λ) * (v/λ)^(k-1) * exp(-(v/λ)^k)
 * 
 * @param windSpeed - Wind speed in m/s
 * @param lambda - Scale parameter
 * @param k - Shape parameter (default 2.0)
 * @returns Probability density at given wind speed
 */
function weibullPDF(windSpeed: number, lambda: number, k: number = WEIBULL_K): number {
  if (windSpeed <= 0 || lambda <= 0) return 0;
  
  const ratio = windSpeed / lambda;
  return (k / lambda) * Math.pow(ratio, k - 1) * Math.exp(-Math.pow(ratio, k));
}

/**
 * Generate hourly wind speeds for a month using Weibull distribution.
 * Distributes hours across wind speed bins based on Weibull probability.
 * 
 * @param meanSpeed - Mean wind speed for the month in m/s
 * @param hoursInMonth - Number of hours in the month
 * @returns Array of hourly wind speeds
 */
function generateMonthlyHourlyWindSpeeds(meanSpeed: number, hoursInMonth: number): number[] {
  const lambda = calculateWeibullScale(meanSpeed);
  const hourlyWindSpeeds: number[] = [];
  
  // Create wind speed bins from 0 to 25 m/s with 0.5 m/s resolution
  const maxSpeed = 25;
  const binSize = 0.5;
  const bins: { speed: number; probability: number }[] = [];
  
  let totalProbability = 0;
  for (let speed = binSize / 2; speed <= maxSpeed; speed += binSize) {
    const prob = weibullPDF(speed, lambda) * binSize;
    bins.push({ speed, probability: prob });
    totalProbability += prob;
  }
  
  // Normalize probabilities and calculate hours per bin
  const hoursPerBin: { speed: number; hours: number }[] = bins.map(bin => ({
    speed: bin.speed,
    hours: Math.round((bin.probability / totalProbability) * hoursInMonth)
  }));
  
  // Adjust to match exact hours in month
  let totalHours = hoursPerBin.reduce((sum, bin) => sum + bin.hours, 0);
  const diff = hoursInMonth - totalHours;
  
  // Add/remove hours from the bin closest to mean speed
  if (diff !== 0) {
    const meanBinIndex = hoursPerBin.findIndex(bin => bin.speed >= meanSpeed) || 
                         Math.floor(hoursPerBin.length / 2);
    hoursPerBin[meanBinIndex].hours += diff;
  }
  
  // Generate hourly array
  for (const bin of hoursPerBin) {
    for (let i = 0; i < bin.hours; i++) {
      hourlyWindSpeeds.push(bin.speed);
    }
  }
  
  return hourlyWindSpeeds;
}

/**
 * Interpolate power output from power curve for a given wind speed.
 * 
 * @param windSpeed - Wind speed in m/s
 * @param powerCurve - Power curve with windSpeedMs and powerKw arrays
 * @returns Power output in kW
 */
function interpolatePowerCurve(
  windSpeed: number,
  powerCurve: { windSpeedMs: number[]; powerKw: number[] }
): number {
  const { windSpeedMs, powerKw } = powerCurve;
  
  if (windSpeed <= windSpeedMs[0]) return powerKw[0];
  if (windSpeed >= windSpeedMs[windSpeedMs.length - 1]) {
    return powerKw[powerKw.length - 1];
  }
  
  for (let i = 0; i < windSpeedMs.length - 1; i++) {
    if (windSpeed >= windSpeedMs[i] && windSpeed < windSpeedMs[i + 1]) {
      const x0 = windSpeedMs[i];
      const x1 = windSpeedMs[i + 1];
      const y0 = powerKw[i];
      const y1 = powerKw[i + 1];
      return y0 + ((windSpeed - x0) * (y1 - y0)) / (x1 - x0);
    }
  }
  
  return 0;
}

// Default power curve (Tulipe 6kWc)
const DEFAULT_POWER_CURVE = {
  windSpeedMs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  powerKw: [0, 0, 0.05, 0.25, 0.6, 1.0, 1.6, 2.3, 3.0, 3.6, 4.2, 4.7, 5.0, 5.05, 5.0]
};

const NOMINAL_POWER_KWC = 6.0;

/**
 * Generate hourly production for a full year using Weibull distribution.
 * 
 * For each month:
 * 1. Generate hourly wind speeds using Weibull distribution (k=2.0)
 * 2. Calculate power output for each hour using the power curve
 * 3. Scale power based on selected kWc and turbine count
 * 
 * Requirements: 3.4, 3.5
 * 
 * @param monthlyWindSpeed - Array of 12 monthly mean wind speeds in m/s
 * @param powerKwc - Selected power in kWc
 * @param turbineCount - Number of turbines
 * @param powerCurve - Optional custom power curve
 * @returns Array of 8760 hourly production values in kWh
 */
export function generateHourlyProduction(
  monthlyWindSpeed: number[],
  powerKwc: number,
  turbineCount: number,
  powerCurve: { windSpeedMs: number[]; powerKw: number[] } = DEFAULT_POWER_CURVE
): number[] {
  if (monthlyWindSpeed.length !== 12) {
    throw new Error('monthlyWindSpeed doit contenir 12 valeurs');
  }
  
  const hourlyProduction: number[] = [];
  const scaleFactor = powerKwc / NOMINAL_POWER_KWC;
  
  for (let month = 0; month < 12; month++) {
    const meanSpeed = monthlyWindSpeed[month];
    const hoursInMonth = HOURS_PER_MONTH[month];
    
    // Generate hourly wind speeds using Weibull distribution
    const hourlyWindSpeeds = generateMonthlyHourlyWindSpeeds(meanSpeed, hoursInMonth);
    
    // Calculate production for each hour
    for (const windSpeed of hourlyWindSpeeds) {
      // Get base power from curve (6kWc nominal)
      const basePower = interpolatePowerCurve(windSpeed, powerCurve);
      
      // Scale to selected kWc and multiply by turbine count
      // Each hour produces power (kW) × 1 hour = kWh
      const hourlyEnergy = basePower * scaleFactor * turbineCount;
      
      hourlyProduction.push(hourlyEnergy);
    }
  }
  
  return hourlyProduction;
}

// ============================================
// Hourly Autoconsumption Calculation
// ============================================

/**
 * Calculate hourly autoconsumption by comparing hourly production and consumption.
 * 
 * For each hour: autoconsumption = min(production, consumption)
 * This provides ultra-precise calculation when Enedis data is available.
 * 
 * Requirements: 3.4
 * 
 * @param hourlyProduction - Array of 8760 hourly production values in kWh
 * @param hourlyConsumption - Array of 8760 hourly consumption values in kWh (from Enedis)
 * @returns AutoconsumptionResults with monthly and annual aggregations
 */
export function calculateHourlyAutoconsumption(
  hourlyProduction: number[],
  hourlyConsumption: number[]
): AutoconsumptionResults {
  const expectedHours = HOURS_PER_MONTH.reduce((sum, h) => sum + h, 0); // 8760
  
  if (hourlyProduction.length !== expectedHours || hourlyConsumption.length !== expectedHours) {
    throw new Error(`Les tableaux doivent contenir ${expectedHours} valeurs horaires`);
  }
  
  const monthlyAutoconsumption: number[] = [];
  const monthlySurplus: number[] = [];
  
  let hourIndex = 0;
  
  for (let month = 0; month < 12; month++) {
    const hoursInMonth = HOURS_PER_MONTH[month];
    let monthAutoconso = 0;
    let monthSurplus = 0;
    
    for (let h = 0; h < hoursInMonth; h++) {
      const prod = hourlyProduction[hourIndex];
      const conso = hourlyConsumption[hourIndex];
      
      // Autoconsumption = min(production, consumption) for each hour
      monthAutoconso += Math.min(prod, conso);
      monthSurplus += Math.max(0, prod - conso);
      
      hourIndex++;
    }
    
    monthlyAutoconsumption.push(Math.round(monthAutoconso));
    monthlySurplus.push(Math.round(monthSurplus));
  }
  
  const annualAutoconsumption = monthlyAutoconsumption.reduce((sum, val) => sum + val, 0);
  const annualSurplus = monthlySurplus.reduce((sum, val) => sum + val, 0);
  const totalProduction = hourlyProduction.reduce((sum, val) => sum + val, 0);
  
  const autoconsumptionRate = totalProduction > 0 
    ? (annualAutoconsumption / totalProduction) * 100 
    : 0;
  
  const annualSavings = annualAutoconsumption * ELECTRICITY_PRICE;
  
  return {
    monthlyAutoconsumption,
    monthlySurplus,
    annualAutoconsumption,
    annualSurplus,
    autoconsumptionRate: Math.round(autoconsumptionRate * 10) / 10,
    annualSavings: Math.round(annualSavings),
  };
}

/**
 * Get the total hours in a year (sum of HOURS_PER_MONTH).
 * Useful for validation.
 * 
 * @returns Total hours (8760)
 */
export function getTotalHoursInYear(): number {
  return HOURS_PER_MONTH.reduce((sum, h) => sum + h, 0);
}
