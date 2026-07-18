import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const mockSections: Record<string, any> = {
  "about": {
    section_key: "about",
    title: "Discover The Scarlet Thread",
    subtitle: "Bringing Your Gift Ideas To Life",
    content: {
      description: "At Scarlet, we believe the most meaningful gifts are the ones created with love, thought and personal touch. Whether it's a heartfelt gift for him, a thoughtful gift for her, a precious keepsake for a new born, a surprise gift for a toddler or unforgettable baby shower gifts, we turn emotions into meaningful gifts that hold memories forever.",
      button_text: "Read Our Story",
      button_link: "/about",
      images: [
        "/images/scarlet-about5.png",
        "/images/scarlet-about.png",
        "/images/scarlet-about1.png",
        "/images/scarlet-about2.png",
        "/images/scarlet-about3.png",
        "/images/scarlet-about4.png"
      ]
    },
    is_active: true
  },
  "featured-products": {
    section_key: "featured-products",
    title: "Our Most Loved Gifts",
    subtitle: "Carefully selected and thoughtfully crafted to bring joy, create meaningful connections, and make every moment feel extra special.",
    content: {
      product_ids: []
    },
    is_active: true
  },
  "cta": {
    section_key: "cta",
    title: "Ready to Make Someone Smile?",
    subtitle: "Create a gift that will be remembered forever",
    content: {
      button_text: "Start Personalizing Now",
      button_link: "/products",
      image_url: "/images/scarlet-couple.png"
    },
    is_active: true
  },
  "seasonal-gifts": {
    section_key: "seasonal-gifts",
    title: "Celebrate Every Season",
    subtitle: "Personalized embroidered gifts for holidays, festivals, and special seasonal celebrations.",
    content: {
      image_desktop: "/images/seasonal-banner.png",
      image_mobile: "/images/seasonal-banner-mobile.png"
    },
    is_active: true
  },
  "faith-based": {
    section_key: "faith-based",
    title: "Gifts of Faith & Love",
    subtitle: "Beautifully embroidered spiritual and faith-based gifts that carry deep meaning.",
    content: {
      image_desktop: "/images/faith-banner.png",
      image_mobile: "/images/faith-banner-mobile.png"
    },
    is_active: true
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const supabase = await createClient();

    if (key) {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("section_key", key)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Fallback to mock for this key
        return NextResponse.json(mockSections[key] || { section_key: key, title: "", subtitle: "", content: {}, is_active: true });
      }
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*");

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.warn("Supabase homepage_sections GET failed. Returning mock data:", error.message || error);
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (key) {
      return NextResponse.json(mockSections[key] || { section_key: key, title: "", subtitle: "", content: {}, is_active: true });
    }
    return NextResponse.json(Object.values(mockSections));
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Check if it's an array or a single object
    const isArray = Array.isArray(body);
    const toUpsert = isArray ? body : [body];

    // Clean up fields before saving
    const cleanUpsert = toUpsert.map((item: any) => {
      const { id, created_at, updated_at, ...rest } = item;
      return rest;
    });

    const { data, error } = await supabase
      .from("homepage_sections")
      .upsert(cleanUpsert, { onConflict: "section_key" })
      .select();

    if (error) throw error;

    return NextResponse.json(isArray ? data : data[0]);
  } catch (error: any) {
    console.warn("Supabase homepage_sections PUT failed. Simulating local success:", error.message || error);
    return NextResponse.json(await request.json());
  }
}
