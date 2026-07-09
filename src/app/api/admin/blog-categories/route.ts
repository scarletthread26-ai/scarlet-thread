import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: categories, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json(categories);
  } catch (error: any) {
    console.warn("GET blog categories failed. Returning empty list:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const categorySlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const { data: category, error } = await supabase
      .from("blog_categories")
      .insert({ name: name.trim(), slug: categorySlug })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("POST blog category failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
