-- Migration to add dynamic options (colors, sizes) and specifications to products table

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '[]'::jsonb;

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add admin_reply column to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS admin_reply text;


