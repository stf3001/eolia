/**
 * Tests d'intégration pour le flux de création de dossiers
 * Requirements: 6.1, 6.2, 6.3
 * 
 * Ces tests vérifient la logique de création de dossiers selon les catégories de produits
 */

import { describe, it, expect } from 'vitest';
import { ProductCategory, isPhysicalProduct } from '../../models/product';
import { DossierType, DossierStatus } from '../../models/dossier';
import { getInitialStatus } from '../stateTransitionService';

// Types pour les tests
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  category?: ProductCategory;
}

interface DossierConfig {
  type: DossierType;
  status: DossierStatus;
}

/**
 * Fonction de détermination des dossiers (extraite de createOrder pour tests)
 */
function determineDossiersToCreate(items: OrderItem[]): DossierConfig[] {
  const dossierConfigs: DossierConfig[] = [];
  const addedTypes = new Set<DossierType>();

  for (const item of items) {
    if (!item.category) continue;

    // Produits physiques -> dossier shipping
    if (isPhysicalProduct(item.category) && !addedTypes.has('shipping')) {
      dossierConfigs.push({
        type: 'shipping',
        status: getInitialStatus('shipping'),
      });
      addedTypes.add('shipping');
    }

    // Forfait administratif -> dossiers admin_enedis et admin_consuel
    if (item.category === 'administrative') {
      if (!addedTypes.has('admin_enedis')) {
        dossierConfigs.push({
          type: 'admin_enedis',
          status: getInitialStatus('admin_enedis'),
        });
        addedTypes.add('admin_enedis');
      }
      if (!addedTypes.has('admin_consuel')) {
        dossierConfigs.push({
          type: 'admin_consuel',
          status: getInitialStatus('admin_consuel'),
        });
        addedTypes.add('admin_consuel');
      }
    }

    // Forfait installation -> dossier installation
    if (item.category === 'installation' && !addedTypes.has('installation')) {
      dossierConfigs.push({
        type: 'installation',
        status: getInitialStatus('installation'),
      });
      addedTypes.add('installation');
    }
  }

  return dossierConfigs;
}

describe('Dossier Creation Integration', () => {
  describe('determineDossiersToCreate', () => {
    describe('physical products (turbine, inverter, accessory)', () => {
      it('should create shipping dossier for turbine', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Turbine Tulipe', quantity: 1, price: 5000, category: 'turbine' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(1);
        expect(dossiers[0].type).toBe('shipping');
        expect(dossiers[0].status).toBe('received');
      });

      it('should create shipping dossier for inverter', () => {
        const items: OrderItem[] = [
          { productId: '2', name: 'Onduleur', quantity: 1, price: 1500, category: 'inverter' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(1);
        expect(dossiers[0].type).toBe('shipping');
      });

      it('should create shipping dossier for accessory', () => {
        const items: OrderItem[] = [
          { productId: '3', name: 'Câble', quantity: 2, price: 100, category: 'accessory' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(1);
        expect(dossiers[0].type).toBe('shipping');
      });

      it('should create only one shipping dossier for multiple physical products', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Turbine', quantity: 1, price: 5000, category: 'turbine' },
          { productId: '2', name: 'Onduleur', quantity: 1, price: 1500, category: 'inverter' },
          { productId: '3', name: 'Câble', quantity: 2, price: 100, category: 'accessory' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        const shippingDossiers = dossiers.filter(d => d.type === 'shipping');
        
        expect(shippingDossiers).toHaveLength(1);
      });
    });

    describe('administrative forfait', () => {
      it('should create admin_enedis and admin_consuel dossiers', () => {
        const items: OrderItem[] = [
          { productId: '4', name: 'Forfait Admin', quantity: 1, price: 500, category: 'administrative' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(2);
        expect(dossiers.some(d => d.type === 'admin_enedis')).toBe(true);
        expect(dossiers.some(d => d.type === 'admin_consuel')).toBe(true);
      });

      it('should set initial status to not_started for admin dossiers', () => {
        const items: OrderItem[] = [
          { productId: '4', name: 'Forfait Admin', quantity: 1, price: 500, category: 'administrative' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        const enedisDossier = dossiers.find(d => d.type === 'admin_enedis');
        const consuelDossier = dossiers.find(d => d.type === 'admin_consuel');
        
        expect(enedisDossier?.status).toBe('not_started');
        expect(consuelDossier?.status).toBe('not_started');
      });
    });

    describe('installation forfait', () => {
      it('should create installation dossier', () => {
        const items: OrderItem[] = [
          { productId: '5', name: 'Forfait Installation', quantity: 1, price: 2000, category: 'installation' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(1);
        expect(dossiers[0].type).toBe('installation');
      });

      it('should set initial status to vt_pending for installation dossier', () => {
        const items: OrderItem[] = [
          { productId: '5', name: 'Forfait Installation', quantity: 1, price: 2000, category: 'installation' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers[0].status).toBe('vt_pending');
      });
    });

    describe('combined orders', () => {
      it('should create all dossiers for complete order (turbine + admin + installation)', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Turbine', quantity: 1, price: 5000, category: 'turbine' },
          { productId: '4', name: 'Forfait Admin', quantity: 1, price: 500, category: 'administrative' },
          { productId: '5', name: 'Forfait Installation', quantity: 1, price: 2000, category: 'installation' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(4);
        expect(dossiers.some(d => d.type === 'shipping')).toBe(true);
        expect(dossiers.some(d => d.type === 'admin_enedis')).toBe(true);
        expect(dossiers.some(d => d.type === 'admin_consuel')).toBe(true);
        expect(dossiers.some(d => d.type === 'installation')).toBe(true);
      });

      it('should not duplicate dossiers for multiple items of same category', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Turbine 1', quantity: 1, price: 5000, category: 'turbine' },
          { productId: '2', name: 'Turbine 2', quantity: 1, price: 5000, category: 'turbine' },
          { productId: '4', name: 'Forfait Admin', quantity: 2, price: 500, category: 'administrative' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        const shippingCount = dossiers.filter(d => d.type === 'shipping').length;
        const enedisCount = dossiers.filter(d => d.type === 'admin_enedis').length;
        const consuelCount = dossiers.filter(d => d.type === 'admin_consuel').length;
        
        expect(shippingCount).toBe(1);
        expect(enedisCount).toBe(1);
        expect(consuelCount).toBe(1);
      });
    });

    describe('edge cases', () => {
      it('should return empty array for items without category', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Unknown', quantity: 1, price: 100 },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(0);
      });

      it('should return empty array for empty items', () => {
        const dossiers = determineDossiersToCreate([]);
        
        expect(dossiers).toHaveLength(0);
      });

      it('should handle mixed items with and without category', () => {
        const items: OrderItem[] = [
          { productId: '1', name: 'Unknown', quantity: 1, price: 100 },
          { productId: '2', name: 'Turbine', quantity: 1, price: 5000, category: 'turbine' },
        ];
        
        const dossiers = determineDossiersToCreate(items);
        
        expect(dossiers).toHaveLength(1);
        expect(dossiers[0].type).toBe('shipping');
      });
    });
  });
});
