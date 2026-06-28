-- Functions and Triggers for The Scarlet Thread E-Commerce Platform

-- 1. Helper function to check if the current user is an admin
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

-- 2. General trigger function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to existing tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Apply updated_at trigger to new tables
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 3. Automatic sequential order numbers (ST-10001, ST-10002...)
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

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.generate_order_number();

-- 4. Automatic inventory updating when order items are placed
CREATE OR REPLACE FUNCTION public.update_stock_on_order()
RETURNS trigger AS $$
BEGIN
  -- If order has a variant, decrement variant stock
  IF new.variant_id IS NOT NULL THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - new.quantity
    WHERE id = new.variant_id;
    
    -- Log to inventory audit trail
    INSERT INTO public.inventory_logs (product_id, variant_id, quantity_changed, change_type, note)
    VALUES (new.product_id, new.variant_id, -new.quantity, 'order_deduction', 'Order item created. Order ID: ' || new.order_id);
  ELSE
    -- Decrement base product stock
    UPDATE public.products
    SET stock_quantity = stock_quantity - new.quantity
    WHERE id = new.product_id;
    
    -- Log to inventory audit trail
    INSERT INTO public.inventory_logs (product_id, quantity_changed, change_type, note)
    VALUES (new.product_id, -new.quantity, 'order_deduction', 'Order item created. Order ID: ' || new.order_id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_on_order
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_stock_on_order();

-- 5. Order timeline logs on creation and update
CREATE OR REPLACE FUNCTION public.log_order_creation()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.order_status_history (order_id, status, notes, created_by)
  VALUES (new.id, new.status, 'Order created with status: ' || new.status, auth.uid());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.log_order_status_change();
