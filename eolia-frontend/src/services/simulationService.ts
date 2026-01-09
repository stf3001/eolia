import { fetchAuthSession } from 'aws-amplify/auth';
import type { CalculatorInputs, CalculatorResults } from '../types/calculator';
import type { SavedSimulation, CreateSimulationResponse } from '../types/simulation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEMO_MODE = !import.meta.env.VITE_COGNITO_USER_POOL_ID;

const getAuthHeaders = async () => {
  if (DEMO_MODE) {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Bearer demo-token',
    };
  }
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const simulationService = {
  /**
   * Sauvegarde une simulation
   */
  async saveSimulation(
    inputs: CalculatorInputs,
    results: CalculatorResults,
    departmentName: string
  ): Promise<CreateSimulationResponse> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        simulationId: `demo-${Date.now()}`,
        name: `Simulation ${departmentName} - ${new Date().toLocaleDateString('fr-FR')}`,
        createdAt: new Date().toISOString(),
      };
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ inputs, results, departmentName }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 400 && error.message?.includes('limite')) {
        throw new Error('Vous avez atteint la limite de 10 simulations. Supprimez-en une depuis votre espace client.');
      }
      throw new Error(error.message || 'Erreur lors de la sauvegarde de la simulation');
    }

    return response.json();
  },

  /**
   * Récupère toutes les simulations de l'utilisateur
   */
  async getSimulations(): Promise<SavedSimulation[]> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [];
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des simulations');
    }

    const data = await response.json();
    return data.simulations || [];
  },

  /**
   * Supprime une simulation
   */
  async deleteSimulation(simulationId: string): Promise<void> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/simulations/${simulationId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 404) {
        throw new Error('Simulation introuvable');
      }
      throw new Error(error.message || 'Erreur lors de la suppression de la simulation');
    }
  },

  /**
   * Récupère le nombre de simulations de l'utilisateur
   */
  async getSimulationCount(): Promise<number> {
    const simulations = await this.getSimulations();
    return simulations.length;
  },
};
