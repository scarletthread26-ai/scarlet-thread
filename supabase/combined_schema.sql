-- =========================================================================
-- Scarlet Thread Unified Supabase Schema, Functions, Triggers, RLS, and Seed Data
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Triggers will be dropped and created safely after tables are defined

-- =========================================================================
-- 1. Table Creation (Ordered to satisfy Foreign Key constraints)
-- =========================================================================

-- Table: roles
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(50) UNIQUE NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role_id uuid REFERENCES public.roles(id) ON DELETE SET NULL,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  is_personalized boolean DEFAULT false,
  personalization_price numeric(10,2) DEFAULT 0,
  stock_status varchar(50) DEFAULT 'in_stock', -- in_stock, out_of_stock, backorder
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  featured boolean DEFAULT false,
  sku varchar(100) UNIQUE,
  customization_enabled boolean DEFAULT false,
  whatsapp_instructions text,
  production_time integer DEFAULT 2,
  meta_title text,
  meta_description text,
  meta_keywords text,
  is_gift boolean DEFAULT false,
  weight numeric(10,2) DEFAULT 0.0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: product_images
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: personalization_templates
CREATE TABLE IF NOT EXISTS public.personalization_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  allowed_fields jsonb NOT NULL, -- e.g., ["name", "custom_text"]
  max_characters integer,
  allowed_fonts jsonb, -- e.g., ["Elegant Script", "Modern Sans"]
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size varchar(50),
  color varchar(50),
  material varchar(50),
  sku varchar(100) UNIQUE,
  price_modifier numeric(10,2) DEFAULT 0.00,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: collections
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: product_collections
CREATE TABLE IF NOT EXISTS public.product_collections (
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- Table: inventory_logs
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity_changed integer NOT NULL,
  change_type varchar(50) NOT NULL, -- 'restock', 'order_deduction', 'manual_adjustment'
  note text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Table: carts
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE, -- Nullable for guests
  session_id varchar(255) UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: cart_items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id uuid REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  personalization_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: shipping_zones
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  country varchar(100) NOT NULL DEFAULT 'United Arab Emirates',
  rate numeric(10,2) NOT NULL DEFAULT 0.00, -- AED
  free_shipping_threshold numeric(10,2),
  estimated_delivery varchar(100) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: coupons
CREATE TABLE IF NOT EXISTS public.coupons (
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
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE, -- Nullable for guests
  title varchar(100) DEFAULT 'Home',
  full_name varchar(255) NOT NULL,
  phone varchar(50) not null,
  address_line1 text not null,
  address_line2 text,
  city varchar(100) not null,
  state varchar(100) not null,
  postal_code varchar(20) not null,
  country varchar(100) default 'United Arab Emirates',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status varchar(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) default 0,
  discount_amount numeric(10,2) default 0,
  coupon_code varchar(50),
  payment_method varchar(50),
  payment_status varchar(50) default 'pending', -- pending, paid, failed, refunded
  payment_intent_id varchar(255),
  shipping_address_id uuid REFERENCES public.addresses(id) ON DELETE RESTRICT,
  billing_address_id uuid REFERENCES public.addresses(id) ON DELETE RESTRICT,
  notes text,
  guest_email varchar(255),
  guest_phone varchar(50),
  is_guest_checkout boolean DEFAULT false,
  shipping_method varchar(100),
  shipping_cost numeric(10,2) DEFAULT 0.0,
  tracking_number varchar(100),
  carrier varchar(100),
  estimated_delivery_date timestamp with time zone,
  order_number varchar(50) UNIQUE,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  personalization_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: coupon_usages
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id uuid REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: order_status_history
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status varchar(50) NOT NULL,
  notes text,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: returns
CREATE TABLE IF NOT EXISTS public.returns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status varchar(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected', 'completed'
  refund_amount numeric(10,2) DEFAULT 0.00,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: return_items
CREATE TABLE IF NOT EXISTS public.return_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id uuid REFERENCES public.returns(id) ON DELETE CASCADE NOT NULL,
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer not null check (rating >= 1 and rating <= 5),
  title varchar(255),
  comment text,
  status varchar(50) default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: hero_slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
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

-- Table: homepage_sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key varchar(100) UNIQUE NOT NULL, -- e.g., 'how-it-works', 'store-features'
  title varchar(255),
  subtitle text,
  content jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: banners
CREATE TABLE IF NOT EXISTS public.banners (
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

-- Table: gallery_categories
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: gallery_items
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  title varchar(255),
  description text,
  media_url text NOT NULL,
  media_type varchar(50) DEFAULT 'image' NOT NULL, -- 'image', 'video'
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
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

-- Table: cms_pages
CREATE TABLE IF NOT EXISTS public.cms_pages (
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

-- Table: faqs
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category varchar(100) NOT NULL, -- 'general', 'personalization', 'shipping', 'payments'
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_active boolean DEFAULT true,
  permissions jsonb DEFAULT '[]'::jsonb, -- e.g., ["*"]
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: admin_activity_logs
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action varchar(255) NOT NULL,
  entity_type varchar(100),
  entity_id varchar(100),
  details jsonb,
  ip_address varchar(50),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- Table: settings
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key varchar(100) UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. Row Level Security Activation
-- =========================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 3. Functions, Automation & Database Triggers
-- =========================================================================

-- Trigger to copy newly authenticated auth.users profiles into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, role_id)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'c3e0e660-31e0-4966-9e1f-7b0028ed2ce1' -- Default to customer role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to active tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON public.collections;
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_carts_updated_at ON public.carts;
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_returns_updated_at ON public.returns;
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_sections_updated_at ON public.homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_banners_updated_at ON public.banners;
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_pages_updated_at ON public.cms_pages;
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = auth.uid() AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic sequential order numbers (ST-10001, ST-10002...)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 10001;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger AS $$
BEGIN
  IF new.order_number IS NULL THEN
    new.order_number := 'ST-' || nextval('order_number_seq')::text;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.generate_order_number();

-- Automatic inventory updating when order items are placed
CREATE OR REPLACE FUNCTION public.update_stock_on_order()
RETURNS trigger AS $$
BEGIN
  IF new.variant_id IS NOT NULL THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - new.quantity
    WHERE id = new.variant_id;
    
    INSERT INTO public.inventory_logs (product_id, variant_id, quantity_changed, change_type, note)
    VALUES (new.product_id, new.variant_id, -new.quantity, 'order_deduction', 'Order item created. Order ID: ' || new.order_id);
  ELSE
    UPDATE public.products
    SET stock_quantity = stock_quantity - new.quantity
    WHERE id = new.product_id;
    
    INSERT INTO public.inventory_logs (product_id, quantity_changed, change_type, note)
    VALUES (new.product_id, -new.quantity, 'order_deduction', 'Order item created. Order ID: ' || new.order_id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stock_on_order ON public.order_items;
CREATE TRIGGER trigger_update_stock_on_order
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_stock_on_order();

-- Order status timeline audit logs
CREATE OR REPLACE FUNCTION public.log_order_creation()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.order_status_history (order_id, status, notes, created_by)
  VALUES (new.id, new.status, 'Order created with status: ' || new.status, auth.uid());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_order_creation ON public.orders;
CREATE TRIGGER trigger_log_order_creation
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.log_order_creation();

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS trigger AS $$
BEGIN
  IF old.status <> new.status THEN
    INSERT INTO public.order_status_history (order_id, status, notes, created_by)
    VALUES (new.id, new.status, 'Status updated from ' || old.status || ' to ' || new.status, auth.uid());
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_order_status_change ON public.orders;
CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.log_order_status_change();

-- =========================================================================
-- 4. Row Level Security Policies
-- =========================================================================

-- Admin Full Access Policies
CREATE POLICY "Admins have full access to roles" ON roles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to users" ON users FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to categories" ON categories FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to products" ON products FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to product_images" ON product_images FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to personalization_templates" ON personalization_templates FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to addresses" ON addresses FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to orders" ON orders FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to order_items" ON order_items FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to reviews" ON reviews FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to product_variants" ON product_variants FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to collections" ON collections FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to product_collections" ON product_collections FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to inventory_logs" ON inventory_logs FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to wishlists" ON wishlists FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to carts" ON carts FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to cart_items" ON cart_items FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to shipping_zones" ON shipping_zones FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to coupons" ON coupons FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to coupon_usages" ON coupon_usages FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to order_status_history" ON order_status_history FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to returns" ON returns FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to return_items" ON return_items FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to hero_slides" ON hero_slides FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to homepage_sections" ON homepage_sections FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to banners" ON banners FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to gallery_categories" ON gallery_categories FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to gallery_items" ON gallery_items FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to testimonials" ON testimonials FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to cms_pages" ON cms_pages FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to faqs" ON faqs FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to admin_users" ON admin_users FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to admin_activity_logs" ON admin_activity_logs FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins have full access to settings" ON settings FOR ALL TO authenticated USING (public.is_admin());

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone." ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Product images are viewable by everyone." ON product_images FOR SELECT USING (true);
CREATE POLICY "Personalization templates are viewable by everyone." ON personalization_templates FOR SELECT USING (true);
CREATE POLICY "Approved reviews are viewable by everyone." ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product_collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Public can view shipping zones" ON shipping_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view hero slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view homepage sections" ON homepage_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view gallery categories" ON gallery_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view gallery items" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view CMS pages" ON cms_pages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view FAQs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);

-- User Profiles & Address Management
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own addresses." ON addresses FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own addresses." ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own addresses." ON addresses FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete own addresses." ON addresses FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Wishlist & Cart Persistency
CREATE POLICY "Customers can view their own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can add items to their own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers can delete items from their own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view their own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can create their own cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can update their own cart" ON carts FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can delete their own cart" ON carts FOR DELETE USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Anyone can view their own cart items" ON cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL))
);
CREATE POLICY "Anyone can add items to their own cart" ON cart_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL))
);
CREATE POLICY "Anyone can update their own cart items" ON cart_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL))
);
CREATE POLICY "Anyone can remove items from their own cart" ON cart_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL))
);

-- Returns
CREATE POLICY "Customers can view their own return requests" ON returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can request a return for their orders" ON returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers can update their own pending returns" ON returns FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Customers can view their own return items" ON return_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid())
);
CREATE POLICY "Customers can add items to their return requests" ON return_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid())
);

-- Orders
CREATE POLICY "Customers can view own orders." ON orders FOR SELECT USING (auth.uid() = user_id OR is_guest_checkout = true);
CREATE POLICY "Guests can place orders" ON orders FOR INSERT WITH CHECK (is_guest_checkout = true OR auth.uid() = user_id);
CREATE POLICY "Guests can view their placed orders by ID" ON orders FOR SELECT USING (is_guest_checkout = true OR auth.uid() = user_id);

CREATE POLICY "Customers can view own order items." ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.is_guest_checkout = true))
);
CREATE POLICY "Customers can view status history of their own orders" ON order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND (orders.user_id = auth.uid() OR orders.is_guest_checkout = true))
);

-- =========================================================================
-- 5. Seed Data Setup
-- =========================================================================

-- Roles Seed
INSERT INTO public.roles (id, name, description) VALUES
('a3e0e660-31e0-4966-9e1f-7b0028ed2ce0', 'admin', 'Administrator role with full backend control'),
('c3e0e660-31e0-4966-9e1f-7b0028ed2ce1', 'customer', 'Customer role for standard website shoppers')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Default Admin User (Supabase Auth Seed)
-- Email: admin@scarletthread.com / Password: AdminPassword123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e3e0e660-31e0-4966-9e1f-7b0028ed2ce2',
  'authenticated',
  'authenticated',
  'admin@scarletthread.com',
  crypt('AdminPassword123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Scarlet Admin", "avatar_url": ""}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Matching public.users profile
INSERT INTO public.users (id, role_id, full_name, phone) VALUES
('e3e0e660-31e0-4966-9e1f-7b0028ed2ce2', 'a3e0e660-31e0-4966-9e1f-7b0028ed2ce0', 'Scarlet Admin', '+971501234567')
ON CONFLICT (id) DO UPDATE SET role_id = EXCLUDED.role_id;

-- Seed admin_users credentials
INSERT INTO public.admin_users (id, is_active, permissions) VALUES
('e3e0e660-31e0-4966-9e1f-7b0028ed2ce2', true, '["*"]')
ON CONFLICT (id) DO NOTHING;

-- Global Settings
INSERT INTO public.settings (key, value, description) VALUES
('store_info', '{"name": "Scarlet Thread", "email": "contact@scarletthread.com", "phone": "+971 50 123 4567", "address": "Dubai Marina, Dubai, UAE", "currency": "AED"}', 'Basic store metadata'),
('smtp_settings', '{"host": "smtp.gmail.com", "port": 587, "user": "placeholder@gmail.com", "pass": "placeholder"}', 'Nodemailer configuration settings'),
('whatsapp_settings', '{"number": "+971501234567", "default_message": "Hello, I would like to inquire about my order.", "enabled": true}', 'WhatsApp click-to-chat settings'),
('stripe_settings', '{"publishable_key": "pk_test_dummy", "secret_key": "sk_test_dummy", "enabled": true}', 'Stripe payment configuration')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Shipping Zones (in AED)
INSERT INTO public.shipping_zones (id, name, country, rate, free_shipping_threshold, estimated_delivery, is_active) VALUES
('f3e0e660-31e0-4966-9e1f-7b0028ed2ce3', 'Dubai & Sharjah', 'United Arab Emirates', 15.00, 150.00, '1-2 business days', true),
('f3e0e660-31e0-4966-9e1f-7b0028ed2ce4', 'Abu Dhabi & Rest of UAE', 'United Arab Emirates', 25.00, 200.00, '2-3 business days', true)
ON CONFLICT (id) DO NOTHING;

-- Coupons (in AED)
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_purchase_amount, starts_at, expires_at, usage_limit, is_active) VALUES
('b3e0e660-31e0-4966-9e1f-7b0028ed2ce5', 'WELCOME10', '10% off your first purchase', 'percentage', 10.00, 0.00, now(), now() + interval '1 year', 1000, true),
('b3e0e660-31e0-4966-9e1f-7b0028ed2ce6', 'DXB50', '50 AED off orders above 300 AED', 'fixed_amount', 50.00, 300.00, now(), now() + interval '6 months', 500, true)
ON CONFLICT (id) DO NOTHING;

-- Collections
INSERT INTO public.collections (id, name, slug, description, display_order, is_active) VALUES
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce7', 'Featured Gifts', 'featured-gifts', 'Highly requested and loved personalized gifts.', 0, true),
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce8', 'New Arrivals', 'new-arrivals', 'Explore our latest personalized additions.', 1, true),
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce9', 'Wedding Season', 'wedding-season', 'Monogrammed linens, bride robes, and customized bridal party keepsakes.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Core Categories (in AED context)
INSERT INTO public.categories (id, name, slug, description, is_active) VALUES
('b3a0e660-31e0-4966-9e1f-7b0028ed2cd0', 'Gifts For Him', 'gifts-for-him', 'Personalized gifts designed for him', true),
('c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Gifts For Her', 'gifts-for-her', 'Elegant personalized gifts for her', true),
('d3a0e660-31e0-4966-9e1f-7b0028ed2cd2', 'Kids & Babies', 'kids-babies', 'Adorable and safe gifts for little ones', true),
('e3a0e660-31e0-4966-9e1f-7b0028ed2cd3', 'Corporate Gifts', 'corporate-gifts', 'Premium corporate gifting options', true)
ON CONFLICT (id) DO NOTHING;

-- Core Products (priced in AED)
INSERT INTO public.products (id, category_id, name, slug, description, price, is_personalized, personalization_price, featured, sku, customization_enabled, production_time, is_active) VALUES
('f3a0e660-31e0-4966-9e1f-7b0028ed2cd4', 'd3a0e660-31e0-4966-9e1f-7b0028ed2cd2', 'Personalized Hooded Towel', 'personalized-hooded-towel', 'Ultra soft 100% cotton hooded towel for babies. Can be embroidered with name.', 89.00, true, 19.00, true, 'SKU-BABY-TOWEL-01', true, 2, true),
('a3a0e660-31e0-4966-9e1f-7b0028ed2cd5', 'c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Mama Heart Hoodie', 'mama-heart-hoodie', 'Cozy premium hoodie with Mama embroidery and a heart.', 149.00, true, 29.00, true, 'SKU-MAMA-HOOD-01', true, 2, true),
('13a0e660-31e0-4966-9e1f-7b0028ed2cd6', 'c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Bride Cosmetic Pouch', 'bride-cosmetic-pouch', 'Elegant canvas pouch perfect for bridal parties.', 69.00, true, 9.00, true, 'SKU-BRIDE-POUCH-01', true, 2, true),
('23a0e660-31e0-4966-9e1f-7b0028ed2cd7', 'b3a0e660-31e0-4966-9e1f-7b0028ed2cd0', 'Leather Wallet with Initials', 'leather-wallet-initials', 'Genuine leather wallet with custom embossed initials.', 129.00, true, 14.00, false, 'SKU-LTHR-WLT-01', true, 3, true)
ON CONFLICT (id) DO NOTHING;

-- Personalization Templates
INSERT INTO public.personalization_templates (product_id, allowed_fields, max_characters, allowed_fonts) VALUES
('f3a0e660-31e0-4966-9e1f-7b0028ed2cd4', '["name"]', 12, '["Elegant Script", "Modern Sans", "Kids Font"]'),
('a3a0e660-31e0-4966-9e1f-7b0028ed2cd5', '["name", "custom_text"]', 20, '["Elegant Script", "Modern Sans"]'),
('13a0e660-31e0-4966-9e1f-7b0028ed2cd6', '["name"]', 15, '["Luxury Serif", "Elegant Script"]'),
('23a0e660-31e0-4966-9e1f-7b0028ed2cd7', '["name"]', 5, '["Modern Sans", "Luxury Serif"]')
ON CONFLICT (id) DO NOTHING;

-- Homepage hero slides
INSERT INTO public.hero_slides (title, subtitle, image_desktop, image_mobile, button_text, button_link, display_order, is_active) VALUES
('Personalized Embroidery & Gifts', 'Handcrafted elegance embroidered with love, designed for your most precious moments.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'Shop Collection', '/products', 0, true),
('Custom Baby Hooded Towels', 'Keep your little ones warm and cozy with our ultra-soft name-embossed hooded towels.', 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=800&q=80', 'Explore Baby Gifts', '/kids-babies', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Homepage sections
INSERT INTO public.homepage_sections (section_key, title, subtitle, content, is_active) VALUES
('how-it-works', 'Crafted Just For You', 'The simple path to personalized gifting excellence', '{
  "steps": [
    {"number": "01", "title": "Select a Product", "description": "Choose from our premium towels, cozy hoodies, elegant cosmetics cases, or bespoke linen options."},
    {"number": "02", "title": "Personalize Details", "description": "Specify names, initials, select elegant scripts, thread colors, and customization placements."},
    {"number": "03", "title": "Meticulous Crafting", "description": "Our expert team hand-threads and embroiders each piece with detailed craftsmanship in our local Dubai studio."},
    {"number": "04", "title": "Gift-Wrapped Delivery", "description": "We carefully steam, luxury-wrap, and dispatch your custom item within 2-3 business days across the UAE."}
  ]
}', true),
('store-features', 'Why Choose Scarlet Thread', 'Our commitment to beautiful execution and customer delight', '{
  "features": [
    {"icon": "Sparkles", "title": "Premium Quality Fabrics", "description": "We source only 100% long-staple organic cotton towels and luxury canvas cases to ensure durability."},
    {"icon": "Scissors", "title": "Precision Local Embroidery", "description": "Each letter is tightly wound, verified, and secured in our custom studio to prevent unraveling."},
    {"icon": "Gift", "title": "Eco-Luxury Packaging", "description": "All gifts arrive standard in signature embossed boxes wrapped in acid-free tissue paper."},
    {"icon": "Truck", "title": "Rapid Delivery Across UAE", "description": "We provide reliable, tracked delivery to your doorstep within 48 hours for standard orders."}
  ]
}', true)
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, content = EXCLUDED.content;

-- Promotional banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, banner_type, is_active, display_order) VALUES
('Cozy Mama & Family Hoodies', 'Celebrate connection with custom family collections.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80', '/products/mama-heart-hoodie', 'featured_banner', true, 0),
('Eid & Special Occasion Collections', 'Traditional styles personalized with custom modern script.', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', '/collections/featured-gifts', 'promo', true, 1)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (name, role, rating, comment, avatar_url, is_active) VALUES
('Fatima Al-Mansoori', 'Verified Buyer', 5, 'The personalized baby hooded towel is incredibly soft! The embroidery is perfectly neat, and the packaging was absolutely beautiful. Will buy again.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', true),
('Sarah Jenkins', 'Gift Giver', 5, 'I ordered custom Bride Cosmetic Pouches for my bridal shower. The girls absolutely adored them! The modern calligraphy font was beautiful.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', true),
('Tarek Ghaoui', 'Corporate Client', 5, 'Ordered 50 custom embossed leather organizers for our corporate retreat. Seamless process, swift delivery in Dubai, and outstanding premium quality.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- FAQs
INSERT INTO public.faqs (category, question, answer, display_order, is_active) VALUES
('personalization', 'What personalization options do you offer?', 'We offer name embroidery, initial monograms, and custom embroidery designs on select fabrics. You can select fonts (Script, Serif, Kids), thread colors, and layouts directly on the product page.', 0, true),
('shipping', 'How long does production and shipping take?', 'Because our items are custom embroidered, processing takes 1-2 business days. Shipping across Dubai and Sharjah takes 1 day (next-day delivery) and other UAE Emirates take 2 days.', 1, true),
('personalization', 'Can I write a name in Arabic?', 'Yes! We support custom embroidery in both English and Arabic script. Simply type your custom text in the personalization box on the product page.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 6. Supabase Storage Buckets Setup & Policies
-- =========================================================================

-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('categories', 'categories', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('cms', 'cms', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- Note: Storage policies on storage.objects cannot be created directly via SQL in some Supabase projects 
-- due to table ownership rules. Please set up the policies (e.g., Allow admin upload/delete) 
-- directly via the Supabase Storage Dashboard GUI.

