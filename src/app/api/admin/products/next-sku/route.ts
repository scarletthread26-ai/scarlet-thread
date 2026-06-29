import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_next_sku");

    if (error) {
      console.error("Supabase RPC error:", error);
      throw error;
    }

    return NextResponse.json({ sku: data });
  } catch (error: any) {
    console.error("Failed to generate next SKU:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to generate next SKU" },
      { status: 500 }
    );
  }
}
