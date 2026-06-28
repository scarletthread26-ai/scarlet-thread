import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create cart for user
    let { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError) throw cartError;

    if (!cart) {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single();
      
      if (createError) throw createError;
      cart = newCart;
    }

    // Get items in cart
    const { data: items, error: itemsError } = await supabase
      .from("cart_items")
      .select(`
        *,
        product:product_id(
          id,
          name,
          slug,
          price,
          compare_at_price,
          stock_status,
          product_images(url, is_primary)
        )
      `)
      .eq("cart_id", cart.id);

    if (itemsError) throw itemsError;

    // Map database items to frontend structure
    const mappedItems = items.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      name: item.product?.name || "Product",
      price: item.product?.price || 0,
      quantity: item.quantity,
      image: item.product?.product_images?.find((img: any) => img.is_primary)?.url || "",
      personalization: item.personalization_data
    }));

    return NextResponse.json(mappedItems);
  } catch (error: any) {
    console.warn("Supabase cart GET failed. Returning empty list:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body; // Array of frontend CartItem

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 });
    }

    // 1. Get or create user cart
    let { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError) throw cartError;

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select()
        .single();
      
      if (createError) throw createError;
      cart = newCart;
    }

    // 2. Clear existing cart items
    const { error: clearError } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id);

    if (clearError) throw clearError;

    // 3. Insert new cart items
    if (items.length > 0) {
      const dbItems = items.map(item => ({
        cart_id: cart.id,
        product_id: item.productId,
        quantity: item.quantity,
        personalization_data: item.personalization || null
      }));

      const { error: insertError } = await supabase
        .from("cart_items")
        .insert(dbItems);

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.warn("Supabase cart sync failed:", error.message || error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
