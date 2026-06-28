-- Dummy data for The Scarlet Thread

-- Categories
INSERT INTO categories (id, name, slug, description) VALUES
('b3a0e660-31e0-4966-9e1f-7b0028ed2cd0', 'Gifts For Him', 'gifts-for-him', 'Personalized gifts designed for him'),
('c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Gifts For Her', 'gifts-for-her', 'Elegant personalized gifts for her'),
('d3a0e660-31e0-4966-9e1f-7b0028ed2cd2', 'Kids & Babies', 'kids-babies', 'Adorable and safe gifts for little ones'),
('e3a0e660-31e0-4966-9e1f-7b0028ed2cd3', 'Corporate Gifts', 'corporate-gifts', 'Premium corporate gifting options');

-- Products
INSERT INTO products (id, category_id, name, slug, description, price, is_personalized, personalization_price, featured) VALUES
('f3a0e660-31e0-4966-9e1f-7b0028ed2cd4', 'd3a0e660-31e0-4966-9e1f-7b0028ed2cd2', 'Personalized Hooded Towel', 'personalized-hooded-towel', 'Ultra soft 100% cotton hooded towel for babies. Can be embroidered with name.', 899.00, true, 199.00, true),
('a3a0e660-31e0-4966-9e1f-7b0028ed2cd5', 'c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Mama Heart Hoodie', 'mama-heart-hoodie', 'Cozy premium hoodie with Mama embroidery and a heart.', 1499.00, true, 299.00, true),
('13a0e660-31e0-4966-9e1f-7b0028ed2cd6', 'c3a0e660-31e0-4966-9e1f-7b0028ed2cd1', 'Bride Cosmetic Pouch', 'bride-cosmetic-pouch', 'Elegant canvas pouch perfect for bridal parties.', 699.00, true, 99.00, true),
('23a0e660-31e0-4966-9e1f-7b0028ed2cd7', 'b3a0e660-31e0-4966-9e1f-7b0028ed2cd0', 'Leather Wallet with Initials', 'leather-wallet-initials', 'Genuine leather wallet with custom embossed initials.', 1299.00, true, 149.00, false);

-- Personalization Templates
INSERT INTO personalization_templates (product_id, allowed_fields, max_characters, allowed_fonts) VALUES
('f3a0e660-31e0-4966-9e1f-7b0028ed2cd4', '["name"]', 12, '["Elegant Script", "Modern Sans", "Kids Font"]'),
('a3a0e660-31e0-4966-9e1f-7b0028ed2cd5', '["name", "custom_text"]', 20, '["Elegant Script", "Modern Sans"]'),
('13a0e660-31e0-4966-9e1f-7b0028ed2cd6', '["name"]', 15, '["Luxury Serif", "Elegant Script"]'),
('23a0e660-31e0-4966-9e1f-7b0028ed2cd7', '["name"]', 5, '["Modern Sans", "Luxury Serif"]');

-- Reviews
-- Assuming users will be created via Auth later, so skipping exact user references for now or use anon
