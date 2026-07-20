import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        *,
        products(
          id,
          name,
          slug,
          price,
          compare_at_price,
          stock_status,
          product_images(url, is_primary)
        )
      `)
      .eq("user_id", user.id);

    if (error) throw error;

    // Map product images
    const mapped = data.map((item: any) => ({
      ...item,
      products: {
        ...item.products,
        images: item.products?.product_images || []
      }
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Supabase wishlist GET failed:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  let productId: string | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    productId = body.productId;
  } catch (err) {
    // Ignore body parse error, validation will catch it
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product is already wishlisted
    const { data: existing } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      // If it exists, remove it (toggle behavior)
      const { error: delError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", existing.id);

      if (delError) throw delError;
      return NextResponse.json({ toggled: false, message: "Removed from wishlist" });
    } else {
      // If not, add it
      const { data, error: insError } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: productId
        })
        .select()
        .single();

      if (insError) throw insError;
      return NextResponse.json({ toggled: true, data, message: "Added to wishlist" });
    }
  } catch (error: any) {
    console.error("Supabase wishlist toggle failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

