-- Create sequence for product SKUs if not exists
CREATE SEQUENCE IF NOT EXISTS public.product_sku_seq START WITH 1;

-- Backfill existing products with SKUs from the sequence
UPDATE public.products
SET sku = 'SKU-' || lpad(nextval('public.product_sku_seq')::text, 6, '0')
WHERE sku IS NULL OR sku = '';

-- Set default value for sku to use the sequence
ALTER TABLE public.products 
  ALTER COLUMN sku SET DEFAULT ('SKU-' || lpad(nextval('public.product_sku_seq')::text, 6, '0'));

-- Make sku NOT NULL and ensure it has correct type (UNIQUE was added in previous migrations)
ALTER TABLE public.products 
  ALTER COLUMN sku SET DATA TYPE varchar(100),
  ALTER COLUMN sku SET NOT NULL;

-- Create RPC function to get the next SKU with collision check
CREATE OR REPLACE FUNCTION public.get_next_sku()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_val bigint;
  next_sku text;
  sku_exists boolean;
BEGIN
  LOOP
    -- Get next value from sequence
    next_val := nextval('public.product_sku_seq');
    next_sku := 'SKU-' || lpad(next_val::text, 6, '0');
    
    -- Check if this SKU already exists in products
    SELECT EXISTS(SELECT 1 FROM public.products WHERE sku = next_sku) INTO sku_exists;
    
    -- If it doesn't exist, we can use it
    IF NOT sku_exists THEN
      RETURN next_sku;
    END IF;
  END LOOP;
END;
$$;
