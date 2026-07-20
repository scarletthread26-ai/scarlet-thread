import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, category:gallery_categories(id, name, slug)")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase gallery items GET failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Admin inserts require bypassing RLS
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const body = await request.json();

    // Ensure the category exists in gallery_categories to prevent foreign key errors
    if (body.category_id) {
      const { data: existingCat } = await supabaseAdmin
        .from("gallery_categories")
        .select("id")
        .eq("id", body.category_id)
        .maybeSingle();

      if (!existingCat) {
        // Fetch from main categories
        const { data: mainCat } = await supabaseAdmin
          .from("categories")
          .select("*")
          .eq("id", body.category_id)
          .single();

        if (mainCat) {
          await supabaseAdmin.from("gallery_categories").insert({
            id: mainCat.id,
            name: mainCat.name,
            slug: mainCat.slug,
            description: mainCat.description || "",
            is_active: true,
          });
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from("gallery_items")
      .insert([body])
      .select("*, category:gallery_categories(id, name, slug)")
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase gallery item POST failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to create gallery item" }, { status: 500 });
  }
}
