-- Seed categories for Seasonal Gifts and Faith Based
INSERT INTO public.categories (id, name, slug, description, is_active)
VALUES 
  ('f3a0e660-31e0-4966-9e1f-7b0028ed2cd8', 'Seasonal Gifts', 'seasonal-gifts', 'Celebrate every season with thoughtful, personalized gifts', true),
  ('f3a0e660-31e0-4966-9e1f-7b0028ed2cd9', 'Faith Based', 'faith-based', 'Personalized faith and spiritual gifts designed to inspire', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed homepage_sections for Seasonal Gifts and Faith Based
INSERT INTO public.homepage_sections (section_key, title, subtitle, content, is_active)
VALUES (
  'seasonal-gifts',
  'Celebrate Every Season',
  'Personalized embroidered gifts for holidays, festivals, and special seasonal celebrations.',
  '{
    "image_desktop": "/images/seasonal-banner.png",
    "image_mobile": "/images/seasonal-banner-mobile.png"
  }'::jsonb,
  true
), (
  'faith-based',
  'Gifts of Faith & Love',
  'Beautifully embroidered spiritual and faith-based gifts that carry deep meaning.',
  '{
    "image_desktop": "/images/faith-banner.png",
    "image_mobile": "/images/faith-banner-mobile.png"
  }'::jsonb,
  true
)
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, content = EXCLUDED.content;
