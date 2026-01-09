// Types for saved simulations

import type { CalculatorInputs, CalculatorResults } from './calculator';

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
  };
  results: {
    annualProduction: number;
    annualSavings: number;
    monthlyProduction: number[];
    usedAnemometerData: boolean;
    scalingFactor?: number;
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
}

/**
 * Payload pour créer une simulation
 */
export interface CreateSimulationPayload {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  departmentName: string;
}

/**
 * Réponse de l'API lors de la création d'une simulation
 */
export interface CreateSimulationResponse {
  simulationId: string;
  name: string;
  createdAt: string;
}
