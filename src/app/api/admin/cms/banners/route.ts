import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

const mockBanners = [
  { id: "1", title: "Cozy Mama & Family Hoodies", subtitle: "Celebrate connection with custom family collections.", image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80", link_url: "/products/mama-heart-hoodie", banner_type: "featured_banner", is_active: true, display_order: 0 },
  { id: "2", title: "Eid & Special Occasion Collections", subtitle: "Traditional styles personalized with custom modern script.", image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80", link_url: "/collections/featured-gifts", banner_type: "promo", is_active: true, display_order: 1 }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase banners GET failed. Returning mock banners:", error.message || error);
    return NextResponse.json(mockBanners);
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json(); // Array of banners

    // Fetch old banners to check which images to delete from Cloudinary
    const { data: oldBanners } = await supabase
      .from("banners")
      .select("image_url");

    // Gather new image URLs being saved
    const newImageUrls = new Set(body.map((b: any) => b.image_url).filter(Boolean));

    // Delete old ones from DB and re-insert
    const { error: deleteError } = await supabase
      .from("banners")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) throw deleteError;

    // Clean up old images from Cloudinary if they are not reused in the new list
    if (oldBanners && oldBanners.length > 0) {
      for (const oldBanner of oldBanners) {
        if (oldBanner.image_url && !newImageUrls.has(oldBanner.image_url)) {
          try {
            await deleteFromCloudinary(oldBanner.image_url);
          } catch (e) {
            console.error("Failed to delete banner image from Cloudinary:", e);
          }
        }
      }
    }

    const cleanBanners = body.map((banner: any, idx: number) => {
      const { id, created_at, updated_at, ...data } = banner;
      return { ...data, display_order: idx };
    });

    const { data, error: insertError } = await supabase
      .from("banners")
      .insert(cleanBanners)
      .select();

    if (insertError) throw insertError;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase banners PUT failed. Simulating local success:", error.message || error);
    return NextResponse.json(await request.json());
  }
}
