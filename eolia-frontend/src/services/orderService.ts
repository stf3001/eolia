import { fetchAuthSession } from 'aws-amplify/auth';
import type { Order } from '../types/order';

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

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (DEMO_MODE) {
      // En mode démo, retourner une liste vide (pas de commandes)
      await new Promise(resolve => setTimeout(resolve, 200));
      return [];
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }

    return response.json();
  },

  async getOrder(orderId: string): Promise<Order> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      throw new Error('Commande non trouvée');
    }

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération de la commande');
    }

    return response.json();
  },
};
