

import { Product, Employee, AppSettings, Order, CartItem, ShippingInfo, Category, Customer } from './types.ts';

export const CATEGORIES: Category[] = [
    { key: 'hot_drinks', name: { en: 'Hot Drinks', ar: 'مشروبات ساخنة' } },
    { key: 'cold_drinks', name: { en: 'Cold Drinks', ar: 'مشروبات باردة' } },
    { key: 'bakery', name: { en: 'Bakery', ar: 'مخبوزات' } },
    { key: 'sweets', name: { en: 'Sweets', ar: 'حلويات' } },
    { key: 'sandwiches', name: { en: 'Sandwiches', ar: 'ساندويتشات' } },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 101, name: {en: 'Espresso Coffee', ar: 'قهوة اسبريسو'}, category: 'hot_drinks', basePrice: 2.50, stock: 100, variants: [], imageUrl: 'https://picsum.photos/seed/101/400', lowStockThreshold: 10, isFavorited: false },
  { id: 102, name: {en: 'Cappuccino', ar: 'كابتشينو'}, category: 'hot_drinks', basePrice: 3.50, stock: 80, variants: [
      { id: 'sm', name: {en: 'Small', ar: 'صغير'}, priceModifier: -0.5, stock: 30 },
      { id: 'md', name: {en: 'Medium', ar: 'وسط'}, priceModifier: 0, stock: 50, lowStockThreshold: 5 },
      { id: 'lg', name: {en: 'Large', ar: 'كبير'}, priceModifier: 0.75, stock: 20 },
  ], imageUrl: 'https://picsum.photos/seed/102/400', isFavorited: false },
  { id: 103, name: {en: 'Green Tea', ar: 'شاي أخضر'}, category: 'hot_drinks', basePrice: 2.00, stock: 120, variants: [], imageUrl: 'https://picsum.photos/seed/103/400', isFavorited: false },
  { id: 201, name: {en: 'Fresh Orange Juice', ar: 'عصير برتقال طازج'}, category: 'cold_drinks', basePrice: 4.00, stock: 50, variants: [], imageUrl: 'https://picsum.photos/seed/201/400', isFavorited: false },
  { id: 202, name: {en: 'Strawberry Milkshake', ar: 'ميلك شيك فراولة'}, category: 'cold_drinks', basePrice: 5.50, stock: 40, variants: [], imageUrl: 'https://picsum.photos/seed/202/400', isFavorited: false },
  { id: 301, name: {en: 'Cheese Croissant', ar: 'كرواسان بالجبنة'}, category: 'bakery', basePrice: 2.75, stock: 60, variants: [], imageUrl: 'https://picsum.photos/seed/301/400', lowStockThreshold: 5, isFavorited: false },
  { id: 302, name: {en: 'Chocolate Cake', ar: 'كيكة الشوكولاتة'}, category: 'sweets', basePrice: 4.50, stock: 30, variants: [], imageUrl: 'https://picsum.photos/seed/302/400', isFavorited: false },
  { id: 303, name: {en: 'Chicken Sandwich', ar: 'ساندويتش دجاج'}, category: 'sandwiches', basePrice: 6.00, stock: 25, variants: [], imageUrl: 'https://picsum.photos/seed/303/400', isFavorited: false },
];

const MOCK_CUSTOMER: Customer = {
  id: 1,
  name: 'Abdullah Mohammed',
  email: 'customer@example.com',
  passwordHash: 'password', // Simple for mock
  shippingInfo: {
    name: 'عبدالله محمد',
    address: '123 شارع الملك فهد',
    city: 'الرياض',
    state: 'منطقة الرياض',
    zip: '12345'
  },
  loyaltyPoints: 150,
};
export const INITIAL_CUSTOMERS: Customer[] = [MOCK_CUSTOMER];


export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: { en: 'Ahmed Mahmoud', ar: 'أحمد محمود' }, role: { en: 'Manager', ar: 'مدير' }, salary: 5000, startDate: new Date('2022-01-15') },
  { id: 2, name: { en: 'Fatima Ali', ar: 'فاطمة علي' }, role: { en: 'Cashier', ar: 'كاشير' }, salary: 3200, startDate: new Date('2022-05-20') },
  { id: 3, name: { en: 'Khalid Saeed', ar: 'خالد سعيد' }, role: { en: 'Barista', ar: 'باريستا' }, salary: 3500, startDate: new Date('2023-02-10') },
];

export const INITIAL_SETTINGS: AppSettings = {
  storeInfo: {
    name: 'My Awesome Store',
    address: '123 Tech Street, Silicon Valley',
    currency: 'USD',
    logoUrl: '',
  },
  taxRate: 0.15, // 15%
  shippingMethods: [
    { id: 'standard', label: 'شحن قياسي', cost: 5, enabled: true },
    { id: 'free', label: 'شحن مجاني', cost: 0, threshold: 35, enabled: true },
    { id: 'custom', label: 'شحن سريع', cost: 15, enabled: false },
  ],
  paymentSettings: {
    paypal: { enabled: true, apiKey: 'YOUR_PAYPAL_API_KEY' },
    stripe: { enabled: true, apiKey: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY' },
  },
  printerSettings: {
    autoPrint: false,
    printerName: 'Default Printer',
    receipt: {
      showLogo: true,
      showStoreAddress: true,
      showBarcode: true,
      customFooterText: 'شكرًا لتسوقك معنا!',
    },
  },
  loyaltySettings: {
    pointsPerDollar: 1, // 1 point for every $1 spent
    dollarsPerPoint: 0.01, // 100 points = $1 discount
  },
};

const MOCK_SHIPPING_INFO: ShippingInfo = {
    name: 'عبدالله محمد',
    address: '123 شارع الملك فهد',
    city: 'الرياض',
    state: 'منطقة الرياض',
    zip: '12345'
};

const MOCK_CART_ITEMS: CartItem[] = [
    { ...INITIAL_PRODUCTS[1], cartId: '102-md', quantity: 1, variant: INITIAL_PRODUCTS[1].variants[1] },
    { ...INITIAL_PRODUCTS[6], cartId: '302', quantity: 2 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2023-001',
    date: new Date('2023-10-26T10:30:00Z'),
    items: MOCK_CART_ITEMS,
    subtotal: 12.50,
    tax: 1.88,
    shippingCost: 5,
    total: 19.38,
    status: 'Delivered',
    shippingInfo: MOCK_SHIPPING_INFO,
    paymentMethod: 'Credit Card',
    customerId: 1,
    pointsEarned: 19,
  },
  {
    id: 'ORD-2023-002',
    date: new Date('2023-10-27T14:00:00Z'),
    items: [{ ...INITIAL_PRODUCTS[0], cartId: '101', quantity: 2 }],
    subtotal: 5.00,
    tax: 0.75,
    shippingCost: 5,
    total: 10.75,
    status: 'Processing',
    shippingInfo: MOCK_SHIPPING_INFO,
    paymentMethod: 'PayPal',
    pointsEarned: 10,
  },
];

export const ADMIN_USER = {
    username: '1111',
    password: '1111'
};