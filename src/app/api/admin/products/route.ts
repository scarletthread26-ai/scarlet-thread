import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch products joining images, categories and reviews
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories:categories!products_category_id_fkey(name, slug),
        product_images(url, is_primary),
        reviews(rating)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Map database image list back to standard frontend array, and aggregate reviews
    const mapped = data.map((prod: any) => {
      const prodReviews = prod.reviews || [];
      const reviewsCount = prodReviews.length;
      const averageRating = reviewsCount > 0
        ? Number((prodReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount).toFixed(1))
        : 0;

      return {
        ...prod,
        images: prod.product_images || [],
        rating: reviewsCount > 0 ? averageRating : 0,
        reviews: reviewsCount
      };
    });

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

    // Normalize empty UUID strings to null
    if (productData.sub_category_id === "") {
      productData.sub_category_id = null;
    }

    // 1. Validate SKU uniqueness if provided, or default to sequence
    if (productData.sku && productData.sku.trim() !== "") {
      const { data: existingSkuProduct, error: skuCheckError } = await supabase
        .from("products")
        .select("id")
        .eq("sku", productData.sku.trim())
        .maybeSingle();

      if (skuCheckError && skuCheckError.code !== "PGRST116") {
        throw skuCheckError;
      }

      if (existingSkuProduct) {
        return NextResponse.json(
          { error: `The SKU "${productData.sku}" is already assigned to another product.` },
          { status: 400 }
        );
      }
      productData.sku = productData.sku.trim();
    } else {
      // If SKU is empty/null, remove it so that PostgreSQL uses the default sequence
      delete productData.sku;
    }

    // 2. Resolve slug collisions
    const slugify = (text: string): string => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")          // Replace spaces with -
        .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
        .replace(/\-\-+/g, "-")         // Replace multiple - with single -
        .replace(/^-+/, "")             // Trim - from start
        .replace(/-+$/, "");            // Trim - from end
    };

    let baseSlug = productData.slug || slugify(productData.name || "product");
    if (!baseSlug || baseSlug.trim() === "") {
      baseSlug = "product";
    }
    baseSlug = slugify(baseSlug);

    let uniqueSlug = baseSlug;
    let counter = 1;
    let slugExists = true;

    while (slugExists) {
      const { data: existingProduct, error: slugCheckError } = await supabase
        .from("products")
        .select("id")
        .eq("slug", uniqueSlug)
        .maybeSingle();

      if (slugCheckError && slugCheckError.code !== "PGRST116") {
        throw slugCheckError;
      }

      if (existingProduct) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    productData.slug = uniqueSlug;

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
