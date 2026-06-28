import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch user profile
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // 2. Fetch addresses
    const { data: addresses } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", id);

    // 3. Fetch order history
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      ...user,
      is_blocked: false, // simulated block status since column is not in DB schema
      addresses: addresses || [],
      orders: orders || [],
    });
  } catch (error: any) {
    console.error("GET admin customer details failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to load customer details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const { full_name, phone } = body;

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    updateData.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("PATCH admin customer details failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to update customer details" }, { status: 500 });
  }
}
