import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = await createClient();
    
    let query = supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Supabase admin faqs fetch failed:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("faqs")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Supabase faq insertion failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to create faq" },
      { status: 500 }
    );
  }
}
