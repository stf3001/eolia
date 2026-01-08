import { fetchAuthSession } from 'aws-amplify/auth';
import type { Order } from '../types/order';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
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
