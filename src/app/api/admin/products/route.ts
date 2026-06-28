import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const mockProducts = [
  {
    id: "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4",
    name: "Personalized Hooded Towel",
    slug: "personalized-hooded-towel",
    price: 89.00,
    compare_at_price: 119.00,
    stock_status: "in_stock",
    stock_quantity: 45,
    is_active: true,
    featured: true,
    is_personalized: true,
    customization_enabled: true,
    personalization_price: 15.00,
    category_id: "d3a0e660-31e0-4966-9e1f-7b0028ed2cd2",
    categories: { name: "Kids & Babies" },
    images: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=300&q=80", is_primary: true }]
  },
  {
    id: "a3a0e660-31e0-4966-9e1f-7b0028ed2cd5",
    name: "Mama Heart Hoodie",
    slug: "mama-heart-hoodie",
    price: 149.00,
    compare_at_price: 199.00,
    stock_status: "in_stock",
    stock_quantity: 20,
    is_active: true,
    featured: true,
    is_personalized: true,
    customization_enabled: true,
    personalization_price: 25.00,
    category_id: "c3a0e660-31e0-4966-9e1f-7b0028ed2cd1",
    categories: { name: "Gifts For Her" },
    images: [{ url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80", is_primary: true }]
  },
  {
    id: "13a0e660-31e0-4966-9e1f-7b0028ed2cd6",
    name: "Bride Cosmetic Pouch",
    slug: "bride-cosmetic-pouch",
    price: 69.00,
    compare_at_price: 99.00,
    stock_status: "in_stock",
    stock_quantity: 12,
    is_active: true,
    featured: true,
    is_personalized: true,
    customization_enabled: true,
    personalization_price: 10.00,
    category_id: "c3a0e660-31e0-4966-9e1f-7b0028ed2cd1",
    categories: { name: "Gifts For Her" },
    images: [{ url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80", is_primary: true }]
  },
  {
    id: "23a0e660-31e0-4966-9e1f-7b0028ed2cd7",
    name: "Leather Wallet with Initials",
    slug: "leather-wallet-initials",
    price: 129.00,
    compare_at_price: 159.00,
    stock_status: "in_stock",
    stock_quantity: 8,
    is_active: true,
    featured: false,
    is_personalized: true,
    customization_enabled: true,
    personalization_price: 15.00,
    category_id: "b3a0e660-31e0-4966-9e1f-7b0028ed2cd0",
    categories: { name: "Gifts For Him" },
    images: [{ url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=300&q=80", is_primary: true }]
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch products joining images and categories
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_images(url, is_primary)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Map database image list back to standard frontend array
    const mapped = data.map((prod: any) => ({
      ...prod,
      images: prod.product_images || []
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Supabase products fetch failed:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  let body: any;
  try {
    const supabase = await createClient();
    body = await request.json();
    const { images, allowed_fields, allowed_fonts, ...productData } = body;

    // 1. Insert product details (only product columns)
    const { data: product, error: prodError } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();

    if (prodError) throw prodError;

    // 2. Insert product images if any exist
    if (images && images.length > 0) {
      const imageRecords = images.map((url: string, index: number) => ({
        product_id: product.id,
        url,
        is_primary: index === 0,
        display_order: index
      }));

      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imageRecords);

      if (imgError) throw imgError;
    }

    // 3. Insert personalization template if is_personalized is enabled
    if (productData.is_personalized) {
      const { error: tempError } = await supabase
        .from("personalization_templates")
        .insert([{
          product_id: product.id,
          allowed_fields: allowed_fields || [],
          allowed_fonts: allowed_fonts || [],
          max_characters: 50
        }]);

      if (tempError) throw tempError;
    }

    return NextResponse.json({ 
      ...product, 
      images, 
      allowed_fields: allowed_fields || [], 
      allowed_fonts: allowed_fonts || [] 
    });
  } catch (error: any) {
    console.error("Supabase product insertion failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to create product in database" },
      { status: 500 }
    );
  }
}
