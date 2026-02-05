// Types for saved simulations

import type { CalculatorInputs, CalculatorResults, ConsumptionMode } from './calculator';

/**
 * Données de consommation pour la simulation sauvegardée
 */
export interface SimulationConsumptionData {
  mode: ConsumptionMode | 'default';
  annualTotal: number;
  monthlyValues: number[];
}

/**
 * Données de batterie pour la simulation sauvegardée
 */
export interface SimulationBatteryData {
  capacity: number; // kWh
}

/**
 * Résultats d'autoconsommation pour la simulation sauvegardée
 */
export interface SimulationAutoconsumptionResults {
  natural: number;           // kWh autoconsommés naturellement
  withBattery?: number;      // kWh autoconsommés avec batterie
  rate: number;              // % taux d'autoconsommation
  surplus: number;           // kWh surplus réinjecté
}

/**
 * Simulation sauvegardée en base de données
 */
export interface SavedSimulation {
  simulationId: string;
  userId: string;
  name: string;
  inputs: {
    departmentCode: string;
    departmentName: string;
    powerKwc: number;
    turbineCount: number;
    anemometerSpeed?: number;
    anemometerMonth?: number;
    // Extended fields for consumption and battery
    consumption?: SimulationConsumptionData;
    battery?: SimulationBatteryData;
  };
  results: {
    annualProduction: number;
    annualSavings: number;
    monthlyProduction: number[];
    usedAnemometerData: boolean;
    scalingFactor?: number;
    // Extended fields for autoconsumption results
    autoconsumption?: SimulationAutoconsumptionResults;
  };
  createdAt: string; // ISO date
}

/**
 * Simulation en attente de sauvegarde (stockée en localStorage)
 * Utilisée quand un utilisateur non connecté veut sauvegarder
 */
export interface PendingSimulation {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  departmentName: string;
  timestamp: number;
  // Extended fields for consumption and battery
  consumption?: SimulationConsumptionData;
  battery?: SimulationBatteryData;
  autoconsumption?: SimulationAutoconsumptionResults;
}

/**
 * Payload pour créer une simulation
 */
export interface CreateSimulationPayload {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  departmentName: string;
  // Extended fields for consumption and battery
  consumption?: SimulationConsumptionData;
  battery?: SimulationBatteryData;
  autoconsumption?: SimulationAutoconsumptionResults;
}

/**
 * Réponse de l'API lors de la création d'une simulation
 */
export interface CreateSimulationResponse {
  simulationId: string;
  name: string;
  createdAt: string;
}
