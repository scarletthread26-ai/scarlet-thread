import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    const baseQuery = supabase
      .from("products")
      .select(`
        *,
        categories:categories!products_category_id_fkey(*),
        product_images(*),
        personalization_templates(*),
        reviews(rating)
      `);

    const { data: product, error } = await (isUUID ? baseQuery.eq("id", id) : baseQuery.eq("slug", id)).single();

    if (error) throw error;

    const prodReviews = product.reviews || [];
    const reviewsCount = prodReviews.length;
    const averageRating = reviewsCount > 0
      ? Number((prodReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount).toFixed(1))
      : 0;

    const mapped = {
      ...product,
      category: product.categories,
      images: product.product_images || [],
      templates: product.personalization_templates || [],
      rating: reviewsCount > 0 ? averageRating : 0,
      reviews: reviewsCount
    };

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error(`Supabase product GET failed for id: "${(await params).id}":`, error.message || error);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let body: any;
  try {
    const { id } = await params;
    const supabase = await createClient();
    body = await request.json();
    const { images, allowed_fields, allowed_fonts, ...productData } = body;

    // Normalize empty UUID strings to null
    if (productData.sub_category_id === "") {
      productData.sub_category_id = null;
    }

    // 1. Validate SKU uniqueness if provided in the update
    if ("sku" in productData) {
      if (productData.sku && productData.sku.trim() !== "") {
        const { data: existingSkuProduct, error: skuCheckError } = await supabase
          .from("products")
          .select("id")
          .eq("sku", productData.sku.trim())
          .neq("id", id)
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
        return NextResponse.json(
          { error: "SKU Code is required and cannot be empty." },
          { status: 400 }
        );
      }
    }

    // 2. Resolve slug collisions if slug is updated
    if (productData.slug && productData.slug.trim() !== "") {
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

      let baseSlug = slugify(productData.slug);
      if (!baseSlug || baseSlug.trim() === "") {
        baseSlug = "product";
      }

      let uniqueSlug = baseSlug;
      let counter = 1;
      let slugExists = true;

      while (slugExists) {
        const { data: existingProduct, error: slugCheckError } = await supabase
          .from("products")
          .select("id")
          .eq("slug", uniqueSlug)
          .neq("id", id)
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
    }

    // 1. Update product base data
    const { data: product, error: prodError } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select()
      .single();

    if (prodError) throw prodError;

    // 2. Refresh images if provided
    if (images !== undefined) {
      // Fetch old images to check which ones to delete from Cloudinary
      const { data: oldImages } = await supabase
        .from("product_images")
        .select("url")
        .eq("product_id", id);

      // Clear old images from database
      await supabase.from("product_images").delete().eq("product_id", id);

      // Delete old images from Cloudinary if they are not in the new images list
      if (oldImages && oldImages.length > 0) {
        const newImagesSet = new Set(images);
        for (const oldImg of oldImages) {
          if (oldImg.url && !newImagesSet.has(oldImg.url)) {
            try {
              await deleteFromCloudinary(oldImg.url);
            } catch (e) {
              console.error("Failed to delete product image from Cloudinary during update:", e);
            }
          }
        }
      }
      
      // Insert new images
      if (images.length > 0) {
        const imageRecords = images.map((url: string, index: number) => ({
          product_id: id,
          url,
          is_primary: index === 0,
          display_order: index
        }));
        
        const { error: imgError } = await supabase.from("product_images").insert(imageRecords);
        if (imgError) throw imgError;
      }
    }

    // 3. Update personalization template if provided
    if (allowed_fields !== undefined || allowed_fonts !== undefined) {
      await supabase.from("personalization_templates").delete().eq("product_id", id);
      if (body.is_personalized) {
        const { error: tempError } = await supabase
          .from("personalization_templates")
          .insert([{
            product_id: id,
            allowed_fields: allowed_fields || [],
            allowed_fonts: allowed_fonts || [],
            max_characters: 50
          }]);
        if (tempError) throw tempError;
      }
    }

    return NextResponse.json({ 
      ...product, 
      images,
      allowed_fields: allowed_fields || [],
      allowed_fonts: allowed_fonts || []
    });
  } catch (error: any) {
    console.error("Supabase product update failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to update product in database" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Check if the product has associated orders to prevent deletion errors
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("id")
      .eq("product_id", id)
      .limit(1);

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete this product because it has associated orders. Please 'Archive' it instead to preserve order history." },
        { status: 400 }
      );
    }

    // 2. Fetch product images first to delete from Cloudinary AFTER DB deletion
    const { data: dbImages } = await supabase
      .from("product_images")
      .select("url")
      .eq("product_id", id);

    // 3. Delete from database (Cascading deletes on product_images will handle image DB records automatically)
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // 4. Delete images from Cloudinary ONLY if DB deletion was successful
    if (dbImages && dbImages.length > 0) {
      for (const img of dbImages) {
        if (img.url) {
          try {
            await deleteFromCloudinary(img.url);
          } catch (e) {
            console.error("Failed to delete product image from Cloudinary:", e);
          }
        }
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Supabase product deletion failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
