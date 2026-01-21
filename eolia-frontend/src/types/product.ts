export interface ProductSpecs {
  [key: string]: string | number;
}

export interface Product {
  productId: string;
  name: string;
  category: 'turbine' | 'inverter' | 'accessory' | 'installation' | 'administrative';
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
  // Pour les produits administratifs
  adminServices?: ('enedis' | 'consuel')[];
}

export type CategoryFilter = 'all' | 'turbine' | 'inverter' | 'accessory' | 'installation' | 'administrative';

export interface CartItem {
  product: Product;
  quantity: number;
}
