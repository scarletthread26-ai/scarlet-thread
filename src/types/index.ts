// Central exports and composite e-commerce types for Scarlet Thread

export * from './database';

import {
  Product,
  ProductImage,
  Category,
  ProductVariant,
  PersonalizationTemplate,
  Order,
  OrderItem,
  Address,
  UserProfile,
  CartItem,
  Cart
} from './database';

// 1. Composite Product Types
export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductWithDetails extends Product {
  images: ProductImage[];
  category: Category;
  sub_category?: Category | null;
  variants: ProductVariant[];
  templates: PersonalizationTemplate[];
}

// 2. Composite Order Types
export interface OrderItemWithDetails extends OrderItem {
  product: Product;
  variant?: ProductVariant | null;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithDetails[];
  shipping_address?: Address | null;
  billing_address?: Address | null;
  user?: UserProfile | null;
}

// 3. Composite Cart Types
export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant?: ProductVariant | null;
}

export interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}
