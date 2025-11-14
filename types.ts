

export type LocalizedString = {
    en: string;
    ar: string;
};

export interface Variant {
  id: string | number;
  name: LocalizedString;
  priceModifier: number;
  stock: number;
  lowStockThreshold?: number;
}

export interface Product {
  id: number;
  name: LocalizedString;
  category: string; // key
  basePrice: number;
  stock: number;
  lowStockThreshold?: number;
  variants: Variant[];
  imageUrl: string;
  isFavorited?: boolean;
}

export interface Category {
    key: string;
    name: LocalizedString;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  variant?: Variant;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type OrderPaymentMethod = 'Credit Card' | 'PayPal' | 'Cash' | 'Cash on Delivery';

export interface ShippingInfo {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  shippingInfo?: ShippingInfo;
  loyaltyPoints: number;
}

export interface Order {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  shippingInfo: ShippingInfo;
  paymentMethod: OrderPaymentMethod;
  customerId?: number;
  pointsEarned: number;
  pointsRedeemed?: number;
}

export interface Employee {
  id: number;
  name: LocalizedString;
  role: LocalizedString;
  salary: number;
  startDate: Date;
}

export interface ShippingMethod {
  id: 'standard' | 'free' | 'custom';
  label: string;
  cost: number;
  threshold?: number;
  enabled?: boolean;
}

export interface PaymentSettings {
  paypal: {
    enabled: boolean;
    apiKey: string;
  };
  stripe: {
    enabled: boolean;
    apiKey: string;
  };
}

export interface ReceiptSettings {
  showLogo: boolean;
  showStoreAddress: boolean;
  showBarcode: boolean;
  customFooterText: string;
}

export interface PrinterSettings {
  autoPrint: boolean;
  printerName: string;
  receipt: ReceiptSettings;
}

export interface StoreInfo {
    name: string;
    address: string;
    currency: 'USD';
    logoUrl: string;
}

export interface AppSettings {
  storeInfo: StoreInfo;
  taxRate: number;
  shippingMethods: ShippingMethod[];
  paymentSettings: PaymentSettings;
  printerSettings: PrinterSettings;
  loyaltySettings: {
    pointsPerDollar: number;
    dollarsPerPoint: number;
  };
}

export interface LowStockNotification {
  uniqueId: string;
  productId: number;
  variantId?: string | number;
  productName: LocalizedString;
  variantName?: LocalizedString;
  remainingStock: number;
  threshold: number;
}