import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("number");
    const contact = searchParams.get("contact");

    if (!orderNumber || !contact) {
      return NextResponse.json({ error: "Missing number or contact parameter" }, { status: 400 });
    }

    // Find the order by order_number
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        shipping_address:addresses!orders_shipping_address_id_fkey(*),
        billing_address:addresses!orders_billing_address_id_fkey(*)
      `)
      .eq("order_number", orderNumber.trim())
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify contact details
    const cleanContact = contact.trim().toLowerCase();
    const matchesGuestEmail = order.guest_email?.toLowerCase() === cleanContact;
    const matchesGuestPhone = order.guest_phone === cleanContact;
    
    let authorized = matchesGuestEmail || matchesGuestPhone;

    // Check registered user's profile info if the order has user_id
    if (!authorized && order.user_id) {
      // Fetch user profile from public.users to see if phone matches
      const { data: userProfile } = await supabase
        .from("users")
        .select("phone")
        .eq("id", order.user_id)
        .single();
      
      if (userProfile && userProfile.phone === contact.trim()) {
        authorized = true;
      }

      // Check current user session email
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        if (currentUser.id === order.user_id) {
          authorized = true;
        }
        if (currentUser.email?.toLowerCase() === cleanContact) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: "Access denied. Order number or contact info is incorrect." }, { status: 401 });
    }

    // Fetch order items with product details
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        *,
        product:products(*)
      `)
      .eq("order_id", order.id);

    if (itemsError) throw itemsError;

    // Fetch order status history (timeline)
    const { data: timeline } = await supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      ...order,
      items: items || [],
      timeline: timeline || [],
    });
  } catch (error: any) {
    console.error("Track order failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to retrieve tracking details" }, { status: 500 });
  }
}
