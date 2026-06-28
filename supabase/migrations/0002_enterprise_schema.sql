-- The Scarlet Thread Enterprise Schema Extension
-- Adds support for subcategories, variants, collections, inventory tracking, guest checkout, CMS, coupons, admin tracking, and notifications.

-- 1. Alterations to Existing Tables
-- Categories: Subcategories support
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- Products: SKU, customization info, SEO, and extra fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku varchar(100) UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS customization_enabled boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS whatsapp_instructions text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS production_time integer DEFAULT 2;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_gift boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight numeric(10,2) DEFAULT 0.0;

-- Orders: Guest checkout support, shipping costs, order tracking, and sequential order numbers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email varchar(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_phone varchar(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_guest_checkout boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method varchar(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost numeric(10,2) DEFAULT 0.0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number varchar(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier varchar(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_date timestamp with time zone;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number varchar(50) UNIQUE;

-- 2. New Product & Inventory Tables
-- Table: product_variants (Size, Color, Material variants)
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size varchar(50),
  color varchar(50),
  material varchar(50),
  sku varchar(100) UNIQUE,
  price_modifier numeric(10,2) DEFAULT 0.00,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: collections (Featured, Trending, Occasions, Seasonal)
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: product_collections (Junction)
CREATE TABLE IF NOT EXISTS product_collections (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- Table: inventory_logs (Detailed audit log for stock)
CREATE TABLE IF NOT EXISTS inventory_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_changed integer NOT NULL,
  change_type varchar(50) NOT NULL, -- 'restock', 'order_deduction', 'return_add', 'manual_adjustment'
  note text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- 3. Shopping Cart & Wishlist Tables
-- Table: wishlists (Persistent customer wishlists)
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  UNIQUE(user_id, product_id)
);

-- Table: carts (Persistent shopping carts, synced for logged-in and guest users)
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE, -- nullable for guest cart
  session_id varchar(255) UNIQUE, -- identifier for guest carts
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: cart_items (Items in the persistent cart)
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  personalization_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- 4. Shipping, Coupons & Discounts Tables
-- Table: shipping_zones (Shipping cost configured by zone/country)
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  country varchar(100) NOT NULL DEFAULT 'United Arab Emirates',
  rate numeric(10,2) NOT NULL DEFAULT 0.00, -- in AED
  free_shipping_threshold numeric(10,2),
  estimated_delivery varchar(100) NOT NULL, -- e.g., '1-2 business days'
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: coupons (Promotions and discount codes)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code varchar(50) UNIQUE NOT NULL,
  description text,
  discount_type varchar(50) NOT NULL, -- 'percentage', 'fixed_amount', 'free_shipping'
  discount_value numeric(10,2) NOT NULL DEFAULT 0.00,
  min_purchase_amount numeric(10,2) DEFAULT 0.00,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: coupon_usages (Tracks coupon usage to limit/audit)
CREATE TABLE IF NOT EXISTS coupon_usages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- 5. Order Management Extensions
-- Table: order_status_history (Tracks full status timeline changes)
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status varchar(50) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL, -- admin/user who triggered
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: returns (Order return requests)
CREATE TABLE IF NOT EXISTS returns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status varchar(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected', 'completed'
  refund_amount numeric(10,2) DEFAULT 0.00,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: return_items (Junction for returned items)
CREATE TABLE IF NOT EXISTS return_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id uuid REFERENCES returns(id) ON DELETE CASCADE NOT NULL,
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- 6. CMS & Frontend Customization Tables
-- Table: hero_slides (Sliders for homepage)
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255),
  subtitle text,
  image_desktop text NOT NULL,
  image_mobile text,
  button_text varchar(100),
  button_link text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: homepage_sections (CMS blocks like "how it works", "testimonials")
CREATE TABLE IF NOT EXISTS homepage_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key varchar(100) UNIQUE NOT NULL, -- e.g., 'how-it-works', 'store-features'
  title varchar(255),
  subtitle text,
  content jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: banners (Promotional banner blocks)
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255),
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  banner_type varchar(50) DEFAULT 'promo' NOT NULL, -- 'hero_banner', 'featured_banner', 'promo'
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: gallery_categories (For filtering showcase/lookbook items)
CREATE TABLE IF NOT EXISTS gallery_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: gallery_items (Embroidery showcase / lookbook)
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES gallery_categories(id) ON DELETE SET NULL,
  title varchar(255),
  description text,
  media_url text NOT NULL,
  media_type varchar(50) DEFAULT 'image' NOT NULL, -- 'image', 'video'
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: testimonials (Customer reviews display)
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  role varchar(100),
  rating integer DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: cms_pages (Legal and info pages like privacy, terms, about us)
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  content text NOT NULL,
  meta_title varchar(255),
  meta_description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: faqs (Frequently asked questions)
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category varchar(100) NOT NULL, -- 'general', 'personalization', 'shipping', 'payments'
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- 7. Admin Specific Tables
-- Table: admin_users (Tracks administrator user profiles and permissions)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  is_active boolean DEFAULT true,
  permissions jsonb DEFAULT '[]'::jsonb, -- e.g., ["manage_products", "manage_orders"]
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: admin_activity_logs (Audit log for admin activities)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  action varchar(255) NOT NULL,
  entity_type varchar(100),
  entity_id varchar(100),
  details jsonb,
  ip_address varchar(50),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- 8. Settings Table
-- Table: settings (Global configuration settings in key-value format)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key varchar(100) UNIQUE NOT NULL, -- e.g., 'store_name', 'default_currency', 'smtp_settings'
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);
