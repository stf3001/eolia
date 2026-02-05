// Types for the wind production calculator

export interface DepartmentWindData {
  name: string;
  monthlyWindSpeed: Record<string, number>; // Month (1-12) -> wind speed (m/s)
}

export interface WindData {
  departments: Record<string, DepartmentWindData>;
}

export interface PowerCurve {
  windSpeedMs: number[];
  powerKw: number[];
}

export interface TurbineModel {
  name: string;
  manufacturer: string;
  type: string;
  nominalPowerKwc: number;
  warranty: string;
  description: string;
  powerCurve: PowerCurve;
  availablePowers: number[];
  specs: Record<string, string>;
}

export interface TurbineConstants {
  grappeBonus: number;
  electricityPricePerKwh: number;
  hoursPerMonth: number[];
}

export interface TurbineModelsData {
  tulipe: TurbineModel;
  constants: TurbineConstants;
}

export interface CalculatorInputs {
  departmentCode: string;
  powerKwc: number;
  turbineCount: number;
  // Optional - anemometer data
  anemometerSpeed?: number;
  anemometerMonth?: number;
}

export interface CalculatorResults {
  annualProduction: number;      // kWh
  monthlyProduction: number[];   // 12 values
  annualSavings: number;         // € (production × 0.26)
  scalingFactor?: number;        // If anemometer used
  usedAnemometerData: boolean;
}

export interface DepartmentOption {
  code: string;
  name: string;
}

// ============================================
// Battery Types and Constants
// ============================================

/** Available battery capacities in kWh */
export const BATTERY_CAPACITIES = [5, 10, 15, 20, 25, 30, 35] as const;

/** Number of complete charge/discharge cycles per year */
export const CYCLES_PER_YEAR = 300;

/** Electricity price in €/kWh for savings calculation */
export const ELECTRICITY_PRICE = 0.26;

/** Inputs for battery simulation */
export interface BatteryInputs {
  capacity: number; // kWh (one of BATTERY_CAPACITIES)
}

/** Results from battery impact calculation */
export interface BatteryResults {
  batteryGain: number;           // kWh autoconsommés grâce à la batterie
  totalAutoconsumption: number;  // Naturelle + Batterie
  additionalSavings: number;     // € économisés grâce à la batterie
  autoconsumptionRate: number;   // % (avec batterie)
}

// ============================================
// Consumption Types and Constants
// ============================================

/** Standard seasonal consumption profile for France (monthly percentages) */
export const SEASONAL_PROFILE = [
  0.135,  // Janvier
  0.12,   // Février
  0.105,  // Mars
  0.08,   // Avril
  0.065,  // Mai
  0.055,  // Juin
  0.05,   // Juillet
  0.05,   // Août
  0.06,   // Septembre
  0.08,   // Octobre
  0.095,  // Novembre
  0.105   // Décembre
] as const;

/** Consumption input mode */
export type ConsumptionMode = 'simple' | 'precise' | 'enedis';

/** Consumption data structure */
export interface ConsumptionData {
  mode: ConsumptionMode;
  annualTotal?: number;           // Mode simple - total annuel en kWh
  monthlyValues?: number[];       // Mode précis - 12 valeurs mensuelles en kWh
  enedisData?: {                  // Mode expert - données Enedis
    hourlyConsumption: number[];  // 8760 valeurs horaires
    monthlyAggregated: number[];  // 12 valeurs agrégées
  };
}

/** Consumption profile with source information */
export interface ConsumptionProfile {
  monthlyConsumption: number[];  // 12 valeurs kWh
  annualTotal: number;
  source: 'default' | 'simple' | 'precise' | 'enedis';
}

/** Default annual consumption when none is provided */
export const DEFAULT_ANNUAL_CONSUMPTION = 10000; // kWh
