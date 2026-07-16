import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Supabase categories fetch failed:", error.message || error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("categories")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Supabase category insertion failed:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
