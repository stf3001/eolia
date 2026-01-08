import type { Address, AddressFormData } from '../types/address';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const addressService = {
  async createAddress(addressData: AddressFormData, token: string): Promise<Address> {
    const response = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'adresse');
    }

    return response.json();
  },

  async getAddresses(token: string): Promise<Address[]> {
    const response = await fetch(`${API_URL}/addresses`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des adresses');
    }

    return response.json();
  },

  async updateAddress(addressId: string, addressData: AddressFormData, token: string): Promise<Address> {
    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la modification de l\'adresse');
    }

    return response.json();
  },

  async deleteAddress(addressId: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression de l\'adresse');
    }
  },

  async setDefaultAddress(addressId: string, token: string): Promise<Address> {
    const response = await fetch(`${API_URL}/addresses/${addressId}/default`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la définition de l\'adresse par défaut');
    }

    return response.json();
  },
};
