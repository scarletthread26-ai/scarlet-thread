-- 1. Add new columns to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sub_category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS track_inventory boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS best_seller boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS trending boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS new_arrival boolean DEFAULT false;

-- 2. Drop collections and inventory-related tables (with cascade to clean junction tables)
DROP TABLE IF EXISTS public.product_collections CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.inventory_logs CASCADE;

-- 3. Update stock deduction trigger on orders
CREATE OR REPLACE FUNCTION public.update_stock_on_order()
RETURNS trigger AS $$
DECLARE
  v_track boolean;
BEGIN
  -- Check if tracking is enabled for this product
  SELECT track_inventory INTO v_track FROM public.products WHERE id = new.product_id;

  IF v_track = true THEN
    IF new.variant_id IS NOT NULL THEN
      UPDATE public.product_variants
      SET stock_quantity = stock_quantity - new.quantity
      WHERE id = new.variant_id;
    END IF;

    UPDATE public.products
    SET stock_quantity = stock_quantity - new.quantity
    WHERE id = new.product_id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger to restore stock on order cancellation
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancel()
RETURNS trigger AS $$
DECLARE
  item record;
  v_track boolean;
BEGIN
  -- Only restore stock if status changes to cancelled from a pending/processing state
  IF new.status = 'cancelled' AND old.status IN ('pending', 'processing') THEN
    FOR item IN 
      SELECT product_id, variant_id, quantity 
      FROM public.order_items 
      WHERE order_id = new.id
    Loop
      SELECT track_inventory INTO v_track FROM public.products WHERE id = item.product_id;
      
      IF v_track = true THEN
        IF item.variant_id IS NOT NULL THEN
          UPDATE public.product_variants
          SET stock_quantity = stock_quantity + item.quantity
          WHERE id = item.variant_id;
        END IF;

        UPDATE public.products
        SET stock_quantity = stock_quantity + item.quantity
        WHERE id = item.product_id;
      END IF;
    END LOOP;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_restore_stock_on_cancel ON public.orders;
CREATE TRIGGER trigger_restore_stock_on_cancel
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.restore_stock_on_cancel();

-- 5. Create trigger to restore stock on approved returns
CREATE OR REPLACE FUNCTION public.restore_stock_on_return_approve()
RETURNS trigger AS $$
DECLARE
  item record;
  v_track boolean;
BEGIN
  IF new.status = 'approved' AND old.status <> 'approved' THEN
    FOR item IN
      SELECT oi.product_id, oi.variant_id, ri.quantity
      FROM public.return_items ri
      JOIN public.order_items oi ON ri.order_item_id = oi.id
      WHERE ri.return_id = new.id
    LOOP
      SELECT track_inventory INTO v_track FROM public.products WHERE id = item.product_id;

      IF v_track = true THEN
        IF item.variant_id IS NOT NULL THEN
          UPDATE public.product_variants
          SET stock_quantity = stock_quantity + item.quantity
          WHERE id = item.variant_id;
        END IF;

        UPDATE public.products
        SET stock_quantity = stock_quantity + item.quantity
        WHERE id = item.product_id;
      END IF;
    END LOOP;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_restore_stock_on_return_approve ON public.returns;
CREATE TRIGGER trigger_restore_stock_on_return_approve
  AFTER UPDATE OF status ON public.returns
  FOR EACH ROW EXECUTE PROCEDURE public.restore_stock_on_return_approve();
