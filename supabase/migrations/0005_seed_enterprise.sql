-- Seed Enterprise Data for The Scarlet Thread
-- Includes roles, a seed admin, settings, shipping zones, collections, coupons, and CMS content.

-- Enable crypt extension for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Seed Roles
INSERT INTO public.roles (id, name, description) VALUES
('a3e0e660-31e0-4966-9e1f-7b0028ed2ce0', 'admin', 'Administrator role with full backend control'),
('c3e0e660-31e0-4966-9e1f-7b0028ed2ce1', 'customer', 'Customer role for standard website shoppers')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 2. Seed Default Admin User
-- ID: e3e0e660-31e0-4966-9e1f-7b0028ed2ce2
-- Email: admin@scarletthread.com
-- Password: AdminPassword123
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

-- Insert matching public.users profile
INSERT INTO public.users (id, role_id, full_name, phone) VALUES
('e3e0e660-31e0-4966-9e1f-7b0028ed2ce2', 'a3e0e660-31e0-4966-9e1f-7b0028ed2ce0', 'Scarlet Admin', '+971501234567')
ON CONFLICT (id) DO UPDATE SET role_id = EXCLUDED.role_id;

-- Insert admin_users credentials
INSERT INTO public.admin_users (id, is_active, permissions) VALUES
('e3e0e660-31e0-4966-9e1f-7b0028ed2ce2', true, '["*"]')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Global Settings
INSERT INTO public.settings (key, value, description) VALUES
('store_info', '{"name": "Scarlet Thread", "email": "contact@scarletthread.com", "phone": "+971 50 123 4567", "address": "Dubai Marina, Dubai, UAE", "currency": "AED"}', 'Basic store metadata'),
('smtp_settings', '{"host": "smtp.gmail.com", "port": 587, "user": "placeholder@gmail.com", "pass": "placeholder"}', 'Nodemailer configuration settings'),
('whatsapp_settings', '{"number": "+971501234567", "default_message": "Hello, I would like to inquire about my order.", "enabled": true}', 'WhatsApp click-to-chat settings'),
('stripe_settings', '{"publishable_key": "pk_test_dummy", "secret_key": "sk_test_dummy", "enabled": true}', 'Stripe payment configuration')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Seed Shipping Zones (UAE regions, in AED)
INSERT INTO public.shipping_zones (id, name, country, rate, free_shipping_threshold, estimated_delivery, is_active) VALUES
('f3e0e660-31e0-4966-9e1f-7b0028ed2ce3', 'Dubai & Sharjah', 'United Arab Emirates', 15.00, 150.00, '1-2 business days', true),
('f3e0e660-31e0-4966-9e1f-7b0028ed2ce4', 'Abu Dhabi & Rest of UAE', 'United Arab Emirates', 25.00, 200.00, '2-3 business days', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Coupons
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_purchase_amount, starts_at, expires_at, usage_limit, is_active) VALUES
('b3e0e660-31e0-4966-9e1f-7b0028ed2ce5', 'WELCOME10', '10% off your first purchase', 'percentage', 10.00, 0.00, now(), now() + interval '1 year', 1000, true),
('b3e0e660-31e0-4966-9e1f-7b0028ed2ce6', 'DXB50', '50 AED off orders above 300 AED', 'fixed_amount', 50.00, 300.00, now(), now() + interval '6 months', 500, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Collections
INSERT INTO public.collections (id, name, slug, description, display_order, is_active) VALUES
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce7', 'Featured Gifts', 'featured-gifts', 'Highly requested and loved personalized gifts.', 0, true),
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce8', 'New Arrivals', 'new-arrivals', 'Explore our latest personalized additions.', 1, true),
('d3e0e660-31e0-4966-9e1f-7b0028ed2ce9', 'Wedding Season', 'wedding-season', 'Monogrammed linens, bride robes, and customized bridal party keepsakes.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed CMS: Hero Slides
INSERT INTO public.hero_slides (title, subtitle, image_desktop, image_mobile, button_text, button_link, display_order, is_active) VALUES
('Personalized Embroidery & Gifts', 'Handcrafted elegance embroidered with love, designed for your most precious moments.', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', 'Shop Collection', '/products', 0, true),
('Custom Baby Hooded Towels', 'Keep your little ones warm and cozy with our ultra-soft name-embossed hooded towels.', 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=800&q=80', 'Explore Baby Gifts', '/kids-babies', 1, true);

-- 8. Seed CMS: Homepage Sections
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

-- 9. Seed CMS: Banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, banner_type, is_active, display_order) VALUES
('Cozy Mama & Family Hoodies', 'Celebrate connection with custom family collections.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80', '/products/mama-heart-hoodie', 'featured_banner', true, 0),
('Eid & Special Occasion Collections', 'Traditional styles personalized with custom modern script.', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', '/collections/featured-gifts', 'promo', true, 1);

-- 10. Seed CMS: Testimonials
INSERT INTO public.testimonials (name, role, rating, comment, avatar_url, is_active) VALUES
('Fatima Al-Mansoori', 'Verified Buyer', 5, 'The personalized baby hooded towel is incredibly soft! The embroidery is perfectly neat, and the packaging was absolutely beautiful. Will buy again.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', true),
('Sarah Jenkins', 'Gift Giver', 5, 'I ordered custom Bride Cosmetic Pouches for my bridal shower. The girls absolutely adored them! The modern calligraphy font was beautiful.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', true),
('Tarek Ghaoui', 'Corporate Client', 5, 'Ordered 50 custom embossed leather organizers for our corporate retreat. Seamless process, swift delivery in Dubai, and outstanding premium quality.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', true);

-- 11. Seed CMS: FAQs
INSERT INTO public.faqs (category, question, answer, display_order, is_active) VALUES
('personalization', 'What personalization options do you offer?', 'We offer name embroidery, initial monograms, and custom embroidery designs on select fabrics. You can select fonts (Script, Serif, Kids), thread colors, and layouts directly on the product page.', 0, true),
('shipping', 'How long does production and shipping take?', 'Because our items are custom embroidered, processing takes 1-2 business days. Shipping across Dubai and Sharjah takes 1 day (next-day delivery) and other UAE Emirates take 2 days.', 1, true),
('personalization', 'Can I write a name in Arabic?', 'Yes! We support custom embroidery in both English and Arabic script. Simply type your custom text in the personalization box on the product page.', 2, true);
