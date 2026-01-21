/**
 * Service Admin - Gestion de l'authentification et des données admin
 * Requirements: 1.1, 1.2, 1.4, 1.5
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ADMIN_TOKEN_KEY = 'admin_token';

// Types
export interface AdminStats {
  confirmedOrders: number;
  pendingInstallations: number;
  pendingEnedis: number;
  pendingConsuel: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface OrderSummary {
  orderId: string;
  createdAt: number;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dossiersSummary: {
    shipping?: string;
    admin_enedis?: string;
    admin_consuel?: string;
    installation?: string;
  };
}

export interface AdminNote {
  noteId: string;
  orderId: string;
  dossierId?: string;
  content: string;
  createdAt: number;
  createdBy: string;
}

export interface OrderDetail {
  order: Record<string, unknown>;
  dossiers: Array<Record<string, unknown>>;
  documents: Array<Record<string, unknown>>;
  notes: AdminNote[];
}

export interface GetOrdersResponse {
  orders: OrderSummary[];
  lastKey?: string;
}

// Helper pour les headers avec token admin
const getAdminHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const adminService = {
  /**
   * Authentification admin
   * Requirements: 1.1, 1.2
   */
  async login(username: string, password: string): Promise<{ token: string; expiresAt: number }> {
    const response = await fetch(`${API_URL}/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Identifiants incorrects');
    }

    const data = await response.json();
    
    // Stocker le token en localStorage
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    
    return data;
  },

  /**
   * Vérification du token admin
   * Requirements: 1.5
   */
  async verify(): Promise<boolean> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        method: 'GET',
        headers: getAdminHeaders(),
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data = await response.json();
      return data.valid === true;
    } catch {
      this.logout();
      return false;
    }
  },

  /**
   * Déconnexion admin
   * Requirements: 1.4
   */
  logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  /**
   * Vérifie si un token admin existe
   */
  hasToken(): boolean {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  /**
   * Récupère les statistiques du dashboard
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  async getStats(): Promise<AdminStats> {
    const response = await fetch(`${API_URL}/admin/stats`, {
      method: 'GET',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expirée');
      }
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des statistiques');
    }

    return response.json();
  },

  /**
   * Récupère la liste des commandes
   * Requirements: 3.1, 3.2, 3.3, 3.4
   */
  async getOrders(params?: {
    search?: string;
    status?: string;
    limit?: number;
    lastKey?: string;
  }): Promise<GetOrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.lastKey) queryParams.set('lastKey', params.lastKey);

    const url = `${API_URL}/admin/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expirée');
      }
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }

    return response.json();
  },

  /**
   * Récupère le détail d'une commande
   * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
   */
  async getOrderDetail(orderId: string): Promise<OrderDetail> {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'GET',
      headers: getAdminHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expirée');
      }
      if (response.status === 404) {
        throw new Error('Commande non trouvée');
      }
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération de la commande');
    }

    return response.json();
  },

  /**
   * Ajoute une note admin
   * Requirements: 7.1, 7.2, 7.3, 7.4
   */
  async addNote(orderId: string, content: string, dossierId?: string): Promise<AdminNote> {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}/notes`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ content, dossierId }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expirée');
      }
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'ajout de la note');
    }

    const data = await response.json();
    return data.note;
  },
};
