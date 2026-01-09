import type { Address, AddressFormData } from '../types/address';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEMO_MODE = !import.meta.env.VITE_COGNITO_USER_POOL_ID;

// Stockage local pour le mode démo
const DEMO_STORAGE_KEY = 'demo_addresses';

const getDemoAddresses = (): Address[] => {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Adresse par défaut en mode démo
  const defaultAddresses: Address[] = [
    {
      addressId: 'demo-addr-1',
      userId: 'demo-user-123',
      label: 'Maison',
      firstName: 'Jean',
      lastName: 'Dupont',
      addressLine1: '123 Rue du Vent',
      addressLine2: '',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
      phone: '06 12 34 56 78',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultAddresses));
  return defaultAddresses;
};

const saveDemoAddresses = (addresses: Address[]) => {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(addresses));
};

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const addressService = {
  async createAddress(addressData: AddressFormData, token: string): Promise<Address> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const addresses = getDemoAddresses();
      const newAddress: Address = {
        ...addressData,
        addressId: `demo-addr-${Date.now()}`,
        userId: 'demo-user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (newAddress.isDefault) {
        addresses.forEach(a => a.isDefault = false);
      }
      addresses.push(newAddress);
      saveDemoAddresses(addresses);
      return newAddress;
    }

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
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return getDemoAddresses();
    }

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
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const addresses = getDemoAddresses();
      const index = addresses.findIndex(a => a.addressId === addressId);
      if (index === -1) throw new Error('Adresse non trouvée');
      if (addressData.isDefault) {
        addresses.forEach(a => a.isDefault = false);
      }
      addresses[index] = { ...addresses[index], ...addressData, updatedAt: new Date().toISOString() };
      saveDemoAddresses(addresses);
      return addresses[index];
    }

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
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const addresses = getDemoAddresses().filter(a => a.addressId !== addressId);
      saveDemoAddresses(addresses);
      return;
    }

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
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const addresses = getDemoAddresses();
      addresses.forEach(a => a.isDefault = a.addressId === addressId);
      saveDemoAddresses(addresses);
      return addresses.find(a => a.addressId === addressId)!;
    }

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
