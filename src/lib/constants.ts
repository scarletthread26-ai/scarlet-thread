// Application constants for Scarlet Thread e-commerce platform

// Currency Configurations
export const CURRENCY = {
  code: 'AED',
  symbol: 'AED',
  name: 'United Arab Emirates Dirham',
};

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'Pending Payment / Confirmation',
  [ORDER_STATUS.PROCESSING]: 'In Production',
  [ORDER_STATUS.SHIPPED]: 'Shipped / Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// Payment Statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: 'Pending Payment',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.FAILED]: 'Payment Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

// Payment Methods
export const PAYMENT_METHOD = {
  STRIPE: 'stripe',
  COD: 'cod', // Cash on Delivery
} as const;

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.STRIPE]: 'Credit Card (Stripe)',
  [PAYMENT_METHOD.COD]: 'Cash on Delivery (COD)',
};

// Stock Statuses
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  BACKORDER: 'backorder',
} as const;

export type StockStatus = typeof STOCK_STATUS[keyof typeof STOCK_STATUS];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  [STOCK_STATUS.IN_STOCK]: 'In Stock',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Out of Stock',
  [STOCK_STATUS.BACKORDER]: 'On Backorder',
};

// Admin Permissions
export const ADMIN_PERMISSIONS = {
  ALL: '*',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_CUSTOMERS: 'manage_customers',
  MANAGE_REVIEWS: 'manage_reviews',
  MANAGE_COUPONS: 'manage_coupons',
  MANAGE_CMS: 'manage_cms',
  MANAGE_SETTINGS: 'manage_settings',
} as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

// Personalization Templates Config
export const PERSONALIZATION_FONTS = [
  'Elegant Script',
  'Modern Sans',
  'Luxury Serif',
  'Kids Font',
  'Classic Cursive',
  'Block Print'
] as const;

export const PERSONALIZATION_FIELDS = [
  'name',
  'custom_text',
  'initials',
  'logo',
  'placement_notes'
] as const;
