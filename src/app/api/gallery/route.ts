import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createDirectClient } from "@supabase/supabase-js";

// Helper to get service role client for seeding if needed
function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createDirectClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Default seed categories to insert if empty
const DEFAULT_CATEGORIES = [
  { name: "For Him", slug: "him", description: "Embroidery creations and custom gifts crafted for him." },
  { name: "For Her", slug: "her", description: "Elegant customized embroidery and monogrammed gifts for her." },
  { name: "Kids & Babies", slug: "kids", description: "Bespoke baby hooded towels, onesies, and children keepsakes." },
  { name: "Special Occasions", slug: "occasions", description: "Bespoke items for weddings, Eid, and special celebrations." },
  { name: "Hampers & Boxes", slug: "hampers", description: "Curated gift boxes and custom wrapped hampers." },
  { name: "Home & Living", slug: "home", description: "Personalized cushions, towels, and home accessories." }
];

async function ensureCategoriesSeeded() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("gallery_categories")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    if (count === 0) {
      console.log("Seeding gallery categories table...");
      const adminSupabase = getServiceRoleClient();
      const { error: seedError } = await adminSupabase
        .from("gallery_categories")
        .insert(DEFAULT_CATEGORIES);
      if (seedError) console.error("Error seeding gallery categories:", seedError);
    }
  } catch (err: any) {
    console.warn("Could not check/seed gallery categories:", err.message || err);
  }
}

export async function GET(request: Request) {
  try {
    await ensureCategoriesSeeded();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const supabase = await createClient();

    let query = supabase
      .from("gallery_items")
      .select("*, category:gallery_categories(name, slug)")
      .eq("is_active", true);

    if (categorySlug && categorySlug !== "all") {
      // In Supabase, filtering on nested relation:
      // We join category and then filter
      const { data: cat } = await supabase
        .from("gallery_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      
      if (cat) {
        query = query.eq("category_id", cat.id);
      } else {
        // Category slug doesn't exist, return empty
        return NextResponse.json([]);
      }
    }

    const { data: items, error } = await query.order("display_order", { ascending: true });
    if (error) throw error;

    return NextResponse.json(items || []);
  } catch (error: any) {
    console.error("Failed to fetch gallery items:", error.message || error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}
