import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET orders failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const {
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      shipping_fee,
      discount_amount,
      total_amount,
      coupon_code,
      payment_method,
      notes,
      guest_email,
      guest_phone,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Insert Shipping Address
    const { data: shipData, error: shipError } = await supabase
      .from("addresses")
      .insert([{
        user_id: user?.id || null,
        title: "Shipping Address",
        full_name: shippingAddress.full_name,
        phone: shippingAddress.phone || guest_phone,
        address_line1: shippingAddress.address_line1,
        address_line2: shippingAddress.address_line2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state || "Dubai",
        postal_code: shippingAddress.postal_code || "00000",
        country: shippingAddress.country || "United Arab Emirates",
      }])
      .select()
      .single();

    if (shipError) throw shipError;

    // 2. Insert Billing Address (default to shipping if not specified)
    let billData = shipData;
    if (billingAddress && Object.keys(billingAddress).length > 0) {
      const { data: bData, error: billError } = await supabase
        .from("addresses")
        .insert([{
          user_id: user?.id || null,
          title: "Billing Address",
          full_name: billingAddress.full_name || shippingAddress.full_name,
          phone: billingAddress.phone || shippingAddress.phone || guest_phone,
          address_line1: billingAddress.address_line1 || shippingAddress.address_line1,
          address_line2: billingAddress.address_line2 || shippingAddress.address_line2 || null,
          city: billingAddress.city || shippingAddress.city,
          state: billingAddress.state || shippingAddress.state || "Dubai",
          postal_code: billingAddress.postal_code || shippingAddress.postal_code || "00000",
          country: billingAddress.country || shippingAddress.country || "United Arab Emirates",
        }])
        .select()
        .single();
      
      if (billError) throw billError;
      billData = bData;
    }

    // 3. Create Order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: user?.id || null,
        shipping_address_id: shipData.id,
        billing_address_id: billData.id,
        subtotal: subtotal,
        shipping_fee: shipping_fee || 0,
        shipping_cost: shipping_fee || 0, // handles both db columns
        discount_amount: discount_amount || 0,
        total_amount: total_amount,
        coupon_code: coupon_code || null,
        payment_method: payment_method || "Card",
        payment_status: payment_method === "COD" ? "pending" : "paid", // simulate instant success for card
        status: "pending",
        notes: notes || null,
        is_guest_checkout: !user,
        guest_email: user ? null : (guest_email || null),
        guest_phone: user ? null : (guest_phone || null),
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId || item.product_id || item.id, // handles both structures
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      unit_price: item.price,
      personalization_data: item.personalization || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    // 5. Audit log or trigger handles order number logic, so we reload the order to get the order_number
    const { data: finalOrder, error: reloadError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderData.id)
      .single();

    if (reloadError) throw reloadError;

    return NextResponse.json(finalOrder);
  } catch (error: any) {
    console.error("POST orders failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
