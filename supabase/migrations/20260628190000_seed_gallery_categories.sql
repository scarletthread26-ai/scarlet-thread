-- Migration: Seed Gallery Categories
-- Seeds lookbook gallery categories to match the frontend filters.

INSERT INTO public.gallery_categories (name, slug, description, is_active) VALUES
('For Him', 'him', 'Embroidery creations and custom gifts crafted for him.', true),
('For Her', 'her', 'Elegant customized embroidery and monogrammed gifts for her.', true),
('Kids & Babies', 'kids', 'Bespoke baby hooded towels, onesies, and children keepsakes.', true),
('Special Occasions', 'occasions', 'Bespoke items for weddings, Eid, and special celebrations.', true),
('Hampers & Boxes', 'hampers', 'Curated gift boxes and custom wrapped hampers.', true),
('Home & Living', 'home', 'Personalized cushions, towels, and home accessories.', true)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  is_active = EXCLUDED.is_active;
