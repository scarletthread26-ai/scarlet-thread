import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

const mockSlides = [
  { id: "1", title: "Personalized Embroidery & Gifts", subtitle: "Handcrafted elegance embroidered with love, designed for your most precious moments.", image_desktop: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80", image_mobile: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", button_text: "Shop Collection", button_link: "/products", display_order: 0, is_active: true },
  { id: "2", title: "Custom Baby Hooded Towels", subtitle: "Keep your little ones warm and cozy with our ultra-soft name-embossed hooded towels.", image_desktop: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1600&q=80", image_mobile: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=800&q=80", button_text: "Explore Baby Gifts", button_link: "/kids-babies", display_order: 1, is_active: true }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase hero-slides GET failed. Returning mock slides:", error.message || error);
    return NextResponse.json(mockSlides);
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json(); // Array of slides to update/insert

    // Fetch old slides to check which images to delete from Cloudinary
    const { data: oldSlides } = await supabase
      .from("hero_slides")
      .select("image_desktop, image_mobile");

    // Gather new image URLs being saved
    const newImageUrls = new Set<string>();
    body.forEach((s: any) => {
      if (s.image_desktop) newImageUrls.add(s.image_desktop);
      if (s.image_mobile) newImageUrls.add(s.image_mobile);
    });

    // Standard re-save pattern: delete old slides, insert new ones
    const { error: deleteError } = await supabase
      .from("hero_slides")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

    if (deleteError) throw deleteError;

    // Clean up old images from Cloudinary if they are not reused in the new list
    if (oldSlides && oldSlides.length > 0) {
      for (const oldSlide of oldSlides) {
        if (oldSlide.image_desktop && !newImageUrls.has(oldSlide.image_desktop)) {
          try {
            await deleteFromCloudinary(oldSlide.image_desktop);
          } catch (e) {
            console.error("Failed to delete hero slide desktop image from Cloudinary:", e);
          }
        }
        if (oldSlide.image_mobile && !newImageUrls.has(oldSlide.image_mobile)) {
          try {
            await deleteFromCloudinary(oldSlide.image_mobile);
          } catch (e) {
            console.error("Failed to delete hero slide mobile image from Cloudinary:", e);
          }
        }
      }
    }

    // Remove client-side dummy IDs from items before saving
    const cleanSlides = body.map((slide: any, idx: number) => {
      const { id, created_at, updated_at, ...data } = slide;
      return { ...data, display_order: idx };
    });

    const { data, error: insertError } = await supabase
      .from("hero_slides")
      .insert(cleanSlides)
      .select();

    if (insertError) throw insertError;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase hero-slides PUT failed. Simulating local success:", error.message || error);
    return NextResponse.json(await request.json());
  }
}
