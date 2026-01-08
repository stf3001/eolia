export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

export interface InstallationDetails {
  installationType: 'mono' | 'tri';
  meterPower: number;
  tgbtDistance: '<30m' | '30-60m' | '60-100m';
  postalCode: string;
}

export interface Order {
  orderId: string;
  createdAt: number;
  userId: string;
  status: 'pending' | 'confirmed' | 'validated' | 'shipped' | 'delivered' | 'cancelled';
  type: 'standard' | 'anemometer_loan';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  installationDetails?: InstallationDetails;
  paymentIntentId: string;
  affiliateCode?: string;
  suspensiveConditions?: string;
  updatedAt: number;
}
