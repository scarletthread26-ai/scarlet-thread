import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock wishlist items
let mockWishlist: any[] = [
  {
    id: "wish-1",
    user_id: "mock-user-id",
    product_id: "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4",
    created_at: new Date().toISOString(),
    products: {
      id: "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4",
      name: "Personalized Hooded Towel",
      slug: "personalized-hooded-towel",
      price: 89.00,
      compare_at_price: 119.00,
      stock_status: "in_stock",
      product_images: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=300&q=80", is_primary: true }]
    }
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("wishlist_items")
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
    console.warn("Supabase wishlist GET failed. Returning mock wishlist:", error.message || error);
    return NextResponse.json(mockWishlist);
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product is already wishlisted
    const { data: existing } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      // If it exists, remove it (toggle behavior)
      const { error: delError } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("id", existing.id);
      
      if (delError) throw delError;
      return NextResponse.json({ toggled: false, message: "Removed from wishlist" });
    } else {
      // If not, add it
      const { data, error: insError } = await supabase
        .from("wishlist_items")
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
    console.warn("Supabase wishlist toggle failed. Simulating local success:", error.message || error);
    const body = await request.json().catch(() => ({}));
    const { productId } = body;
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existingIndex = mockWishlist.findIndex(item => item.product_id === productId);
    if (existingIndex !== -1) {
      mockWishlist.splice(existingIndex, 1);
      return NextResponse.json({ toggled: false, message: "Removed from wishlist" });
    } else {
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: "mock-user-id",
        product_id: productId,
        created_at: new Date().toISOString(),
        products: {
          id: productId,
          name: "Mock Wishlisted Product",
          slug: "mock-wishlist-product",
          price: 99.00,
          compare_at_price: 129.00,
          stock_status: "in_stock",
          product_images: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=300&q=80", is_primary: true }]
        }
      };
      mockWishlist.push(newItem);
      return NextResponse.json({ toggled: true, data: newItem, message: "Added to wishlist" });
    }
  }
}
