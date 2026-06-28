import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("orders")
      .select(`
        *,
        shipping_address:addresses!orders_shipping_address_id_fkey(*),
        user:users(*)
      `)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET admin orders failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to load orders" }, { status: 500 });
  }
}
