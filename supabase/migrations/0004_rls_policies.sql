-- Row Level Security (RLS) Policies for The Scarlet Thread Enterprise Platform

-- Enable RLS on New Tables
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ADMIN FULL ACCESS POLICIES
-- =========================================================================
-- Allows admins to perform all CRUD operations on all tables

-- Helper function to generate admin policies dynamically (conceptually represented below)
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


-- =========================================================================
-- PUBLIC / ANONYMOUS SELECT POLICIES
-- =========================================================================

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


-- =========================================================================
-- CUSTOMER SHOPPING POLICIES
-- =========================================================================

-- Wishlist Policies
CREATE POLICY "Customers can view their own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can add items to their own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers can delete items from their own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Carts Policies (Supporting Guests with session_id)
CREATE POLICY "Anyone can view their own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can create their own cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can update their own cart" ON carts FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can delete their own cart" ON carts FOR DELETE USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Cart Items Policies (Checked against cart ownership)
CREATE POLICY "Anyone can view their own cart items" ON cart_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
  )
);
CREATE POLICY "Anyone can add items to their own cart" ON cart_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
  )
);
CREATE POLICY "Anyone can update their own cart items" ON cart_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
  )
);
CREATE POLICY "Anyone can remove items from their own cart" ON cart_items FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
  )
);

-- Returns Policies
CREATE POLICY "Customers can view their own return requests" ON returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can request a return for their orders" ON returns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers can update their own pending returns" ON returns FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Return Items Policies
CREATE POLICY "Customers can view their own return items" ON return_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid()
  )
);
CREATE POLICY "Customers can add items to their return requests" ON return_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM returns WHERE returns.id = return_items.return_id AND returns.user_id = auth.uid()
  )
);

-- Order Status History / Timeline (Public tracking support)
CREATE POLICY "Customers can view status history of their own orders" ON order_status_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND (orders.user_id = auth.uid() OR orders.is_guest_checkout = true)
  )
);

-- Guest Checkout Address Access: Guests need to be able to create addresses
CREATE POLICY "Guests can create guest checkout addresses" ON addresses FOR INSERT WITH CHECK (user_id IS NULL);
CREATE POLICY "Guests can view their checkout addresses" ON addresses FOR SELECT USING (user_id IS NULL);

-- Guest checkout order creation
CREATE POLICY "Guests can place orders" ON orders FOR INSERT WITH CHECK (is_guest_checkout = true OR auth.uid() = user_id);
CREATE POLICY "Guests can view their placed orders by ID" ON orders FOR SELECT USING (is_guest_checkout = true OR auth.uid() = user_id);
CREATE POLICY "Guests can view their placed order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.is_guest_checkout = true)
  )
);
