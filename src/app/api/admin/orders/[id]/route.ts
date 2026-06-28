import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        shipping_address:addresses!orders_shipping_address_id_fkey(*),
        billing_address:addresses!orders_billing_address_id_fkey(*),
        user:users(*)
      `)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        product:products(*)
      `)
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    const { data: timeline, error: timelineError } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true });

    if (timelineError) throw timelineError;

    return NextResponse.json({
      ...order,
      items: items || [],
      timeline: timeline || [],
    });
  } catch (error: any) {
    console.error("GET admin order detail failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to load order details" }, { status: 500 });
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

    const { status, tracking_number, carrier, estimated_delivery_date, notes } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (estimated_delivery_date !== undefined) updateData.estimated_delivery_date = estimated_delivery_date;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date().toISOString();

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("PATCH admin order failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
