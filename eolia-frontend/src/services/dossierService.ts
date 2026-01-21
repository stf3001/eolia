import { fetchAuthSession } from 'aws-amplify/auth';
import type { Dossier, DossierEvent, VTFormData } from '../types/dossier';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export interface GetDossiersResponse {
  dossiers: Dossier[];
}

export interface GetDossierDetailResponse {
  dossier: Dossier;
  events: DossierEvent[];
}

export interface GetDossierEventsResponse {
  events: DossierEvent[];
}

export interface SubmitVTRequest {
  roofType: VTFormData['roofType'];
  mountingHeight: number;
  electricalDistance: VTFormData['electricalDistance'];
  obstacles: string[];
  comments?: string;
  photoIds: string[];
}

export const dossierService = {
  /**
   * Récupère tous les dossiers d'une commande
   */
  async getDossiers(orderId: string): Promise<Dossier[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/dossiers`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des dossiers');
    }

    const data: GetDossiersResponse = await response.json();
    return data.dossiers;
  },

  /**
   * Récupère le détail d'un dossier avec son historique
   */
  async getDossierDetail(orderId: string, dossierId: string): Promise<GetDossierDetailResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/dossiers/${dossierId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération du dossier');
    }

    return response.json();
  },

  /**
   * Récupère l'historique des événements d'un dossier
   */
  async getDossierEvents(orderId: string, dossierId: string): Promise<DossierEvent[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/dossiers/${dossierId}/events`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération de l\'historique');
    }

    const data: GetDossierEventsResponse = await response.json();
    return data.events;
  },

  /**
   * Soumet le formulaire de visite technique
   */
  async submitVT(orderId: string, vtData: SubmitVTRequest): Promise<Dossier> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/installation/vt`, {
      method: 'POST',
      headers,
      body: JSON.stringify(vtData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la soumission de la VT');
    }

    const data = await response.json();
    return data.dossier;
  },

  /**
   * Envoie la VT au bureau d'études
   */
  async sendVTToBE(orderId: string): Promise<Dossier> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/orders/${orderId}/installation/send-to-be`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'envoi au BE');
    }

    const data = await response.json();
    return data.dossier;
  },
};
