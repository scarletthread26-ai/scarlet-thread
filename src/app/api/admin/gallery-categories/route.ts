import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createDirectClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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
  { name: "Kids & Babies", slug: "kids", description: "Bespoke baby hooded towels, onesies, and children keepsakes." }
];

async function ensureCategoriesSeeded() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("gallery_categories")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    if (count === 0) {
      console.log("Seeding gallery categories table from admin route...");
      const adminSupabase = getServiceRoleClient();
      const { error: seedError } = await adminSupabase
        .from("gallery_categories")
        .insert(DEFAULT_CATEGORIES);
      if (seedError) console.error("Error seeding gallery categories:", seedError);
    }
  } catch (err: any) {
    console.warn("Could not check/seed gallery categories in admin route:", err.message || err);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const adminSupabase = getServiceRoleClient();

    // 1. Fetch main categories (top-level)
    const { data: mainCats } = await supabase.from("categories").select("*").is("parent_id", null);

    // 2. Fetch existing gallery categories
    const { data: galCats } = await supabase.from("gallery_categories").select("*");

    // 3. Sync main categories into gallery categories
    if (mainCats) {
      // a. Insert missing categories
      for (const mc of mainCats) {
        const exists = galCats?.find((gc: any) => gc.slug === mc.slug);
        if (!exists) {
          await adminSupabase.from("gallery_categories").insert({
            name: mc.name,
            slug: mc.slug,
            description: mc.description || "",
            is_active: true
          });
        }
      }

      // b. Delete categories that are no longer in main categories
      if (galCats) {
        for (const gc of galCats) {
          const existsInMain = mainCats.find((mc: any) => mc.slug === gc.slug);
          if (!existsInMain) {
            await adminSupabase.from("gallery_categories").delete().eq("id", gc.id);
          }
        }
      }
    }

    // 4. Fetch the synced gallery categories to return (so we use correct foreign keys)
    const { data: finalCats, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json(finalCats || []);
  } catch (error: any) {
    console.error("Failed to fetch gallery categories for admin:", error.message || error);
    return NextResponse.json({ error: "Failed to fetch gallery categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const adminSupabase = getServiceRoleClient();

    const { data, error } = await adminSupabase
      .from("gallery_categories")
      .insert([{ name: name.trim(), slug, description: "", is_active: true }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to create gallery category:", error.message || error);
    return NextResponse.json({ error: "Failed to create gallery category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    const adminSupabase = getServiceRoleClient();
    const { error } = await adminSupabase
      .from("gallery_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete gallery category:", error.message || error);
    return NextResponse.json({ error: "Failed to delete gallery category" }, { status: 500 });
  }
}
