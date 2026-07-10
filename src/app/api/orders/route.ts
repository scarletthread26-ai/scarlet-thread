import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/brevo";

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
    
    // Use admin client for inserts to bypass RLS and trigger errors (like order_status_history)
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
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
    const { data: shipData, error: shipError } = await supabaseAdmin
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
      const { data: bData, error: billError } = await supabaseAdmin
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

    // 2.5 Save to user_addresses if logged in and they don't have any addresses yet
    if (user?.id) {
      const { data: existingUserAddresses } = await supabaseAdmin
        .from("user_addresses")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (!existingUserAddresses || existingUserAddresses.length === 0) {
        await supabaseAdmin.from("user_addresses").insert([{
          user_id: user.id,
          label: "Home",
          full_name: shippingAddress.full_name,
          phone: shippingAddress.phone || guest_phone,
          address_line1: shippingAddress.address_line1,
          address_line2: shippingAddress.address_line2 || null,
          city: shippingAddress.city,
          emirate: shippingAddress.state || "Dubai",
          postal_code: shippingAddress.postal_code || "00000",
          country: shippingAddress.country || "United Arab Emirates",
          is_default: true,
        }]);
      }
    }

    // 3. Create Order
    const { data: orderData, error: orderError } = await supabaseAdmin
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

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    // 5. Audit log or trigger handles order number logic, so we reload the order to get the order_number
    const { data: finalOrder, error: reloadError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderData.id)
      .single();

    if (reloadError) throw reloadError;

    // 6. Send order confirmation email
    const customerEmail = user?.email || guest_email;
    const customerName = shippingAddress.full_name || "Customer";

    if (customerEmail) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h1 style="color: #c026d3;">Order Confirmation</h1>
          <p>Dear ${customerName},</p>
          <p>Thank you for shopping with Scarlet Thread! Your order <strong>#${finalOrder.order_number || finalOrder.id.substring(0, 8)}</strong> has been successfully placed.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Total Amount:</strong> AED ${total_amount}</p>
            <p><strong>Payment Method:</strong> ${payment_method}</p>
          </div>
          <p>We'll notify you once it's on the way.</p>
          
          <div>
            <p style="margin-bottom: 10px; font-size: 14px; color: #555;">Have a question about your order?</p>
            <a href="https://wa.me/971501872337?text=Hello!%20I%20would%20like%20to%20make%20an%20inquiry%20regarding%20my%20order%20%23${finalOrder.order_number || finalOrder.id.substring(0, 8)}" 
               style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Chat with us on WhatsApp
            </a>
          </div>

          <p>Warm regards,<br>The Scarlet Thread Team</p>
        </div>
      `;

      // We don't await this so it doesn't block the API response
      sendEmail({
        to: [{ email: customerEmail, name: customerName }],
        subject: `Order Confirmation - Scarlet Thread (Order #${finalOrder.order_number || 'New'})`,
        htmlContent: emailHtml,
      });
    }

    return NextResponse.json(finalOrder);
  } catch (error: any) {
    console.error("POST orders failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
