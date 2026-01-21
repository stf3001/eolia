/**
 * Types pour les produits
 */

export type ProductCategory = 
  | 'turbine' 
  | 'inverter' 
  | 'accessory' 
  | 'installation' 
  | 'administrative';

// Catégories considérées comme matériel physique (déclenchent le suivi logistique)
export const PHYSICAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  'turbine',
  'inverter',
  'accessory',
];

export interface ProductSpecs {
  [key: string]: string | number;
}

export interface Product {
  productId: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  powerKwc?: number;
  description: string;
  specs: ProductSpecs;
  imageUrl: string;
  images?: string[];
  stock: number;
  includes?: string[];
  warranty?: string;
  createdAt: number;
  updatedAt?: number;
  // Pour les produits administratifs
  adminServices?: ('enedis' | 'consuel')[];
}

/**
 * Vérifie si une catégorie correspond à un produit physique
 */
export function isPhysicalProduct(category: ProductCategory): boolean {
  return PHYSICAL_PRODUCT_CATEGORIES.includes(category);
}

/**
 * Détermine les types de dossiers à créer pour une liste de produits
 */
export function getDossierTypesForProducts(products: { category: ProductCategory }[]): string[] {
  const dossierTypes: Set<string> = new Set();
  
  for (const product of products) {
    if (isPhysicalProduct(product.category)) {
      dossierTypes.add('shipping');
    }
    if (product.category === 'administrative') {
      dossierTypes.add('admin_enedis');
      dossierTypes.add('admin_consuel');
    }
    if (product.category === 'installation') {
      dossierTypes.add('installation');
    }
  }
  
  return Array.from(dossierTypes);
}
