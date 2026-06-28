// Database Type Definitions matching Scarlet Thread PostgreSQL Schema

export interface Role {
  id: string;
  name: 'admin' | 'customer' | string;
  description: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  sub_category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number; // mapped to numeric in DB, standard to use number in TS
  compare_at_price: number | null;
  is_personalized: boolean;
  personalization_price: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'backorder';
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  is_active: boolean;
  featured: boolean;
  best_seller: boolean;
  trending: boolean;
  new_arrival: boolean;
  sku: string | null;
  customization_enabled: boolean;
  whatsapp_instructions: string | null;
  production_time: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_gift: boolean;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface PersonalizationTemplate {
  id: string;
  product_id: string;
  allowed_fields: string[]; // JSONB in DB
  max_characters: number | null;
  allowed_fonts: string[] | null; // JSONB in DB
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string | null;
  price_modifier: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string | null; // nullable for guest checkout
  title: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null; // null for guest checkout
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  coupon_code: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id: string | null;
  shipping_address_id: string;
  billing_address_id: string;
  notes: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  is_guest_checkout: boolean;
  shipping_method_name: string | null; // standard field
  shipping_cost: number;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  order_number: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  personalization_data: Record<string, any> | null; // JSONB in DB
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string | null;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refund_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReturnItem {
  id: string;
  return_id: string;
  order_item_id: string;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  title: string | null;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  personalization_data: Record<string, any> | null; // JSONB in DB
  created_at: string;
  updated_at: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  country: string;
  rate: number;
  free_shipping_threshold: number | null;
  estimated_delivery: string;
  is_active: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  discount_value: number;
  min_purchase_amount: number;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  order_id: string;
  user_id: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_desktop: string;
  image_mobile: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: any; // JSONB
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  banner_type: 'hero_banner' | 'featured_banner' | 'promo' | string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  category_id: string | null;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  comment: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category: 'general' | 'personalization' | 'shipping' | 'payments' | string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  is_active: boolean;
  permissions: string[]; // JSONB in DB
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any; // JSONB
  description: string | null;
  created_at: string;
  updated_at: string;
}

