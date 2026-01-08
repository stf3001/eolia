export interface ProductSpecs {
  [key: string]: string | number;
}

export interface Product {
  productId: string;
  name: string;
  category: 'turbine' | 'inverter' | 'accessory' | 'installation';
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
}

export type CategoryFilter = 'all' | 'turbine' | 'inverter' | 'accessory' | 'installation';

export interface CartItem {
  product: Product;
  quantity: number;
}
