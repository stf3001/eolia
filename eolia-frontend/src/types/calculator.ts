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
