-- Create Supabase Storage Buckets and policies for products, categories, and CMS assets

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('categories', 'categories', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('cms', 'cms', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies for Storage Objects
-- Allow public read access to all public buckets
CREATE POLICY "Public Read Access for Products Bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Public Read Access for Categories Bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'categories');

CREATE POLICY "Public Read Access for CMS Bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms');

-- Allow admins full write/delete control
CREATE POLICY "Admin Upload Access for Products"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin Update Access for Products"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin Delete Access for Products"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin Upload Access for Categories"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'categories' AND public.is_admin());

CREATE POLICY "Admin Update Access for Categories"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'categories' AND public.is_admin());

CREATE POLICY "Admin Delete Access for Categories"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'categories' AND public.is_admin());

CREATE POLICY "Admin Upload Access for CMS"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms' AND public.is_admin());

CREATE POLICY "Admin Update Access for CMS"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms' AND public.is_admin());

CREATE POLICY "Admin Delete Access for CMS"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cms' AND public.is_admin());
