import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/brevo";
import { ORDER_STATUS_TRANSITIONS, OrderStatus } from "@/lib/constants";
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

    if (status) {
      const { data: currentOrder, error: currentOrderError } = await supabase
        .from("orders")
        .select("status")
        .eq("id", id)
        .single();

      if (currentOrderError || !currentOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (status !== currentOrder.status) {
        const allowedNextStatuses = ORDER_STATUS_TRANSITIONS[currentOrder.status as OrderStatus] || [];
        if (!allowedNextStatuses.includes(status as OrderStatus)) {
          return NextResponse.json(
            { error: `Invalid status transition from '${currentOrder.status}' to '${status}'.` },
            { status: 400 }
          );
        }
      }
    }

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
      .select(`
        *,
        shipping_address:addresses!orders_shipping_address_id_fkey(*),
        user:users(*)
      `)
      .single();

    if (error) throw error;

    if ((status === "delivered" || status === "shipped") && order) {
      const customerEmail = order.user?.email || order.guest_email;
      const customerName = order.shipping_address?.full_name || order.user?.full_name || "Customer";
      const orderNumber = order.order_number || order.id.substring(0, 8);

      if (customerEmail) {
        let emailHtml = "";
        let emailSubject = "";

        // Use a permanent, publicly hosted URL (Cloudinary) for the email image so it always resolves 
        // properly in email clients like Gmail/Outlook, even when testing locally.
        const logoUrl = "https://res.cloudinary.com/drfklf0je/image/upload/v1784273908/logo_zupjz4.png";
        const nameUrl = "https://res.cloudinary.com/drfklf0je/image/upload/v1784273926/name_rcxh3k.png";

        if (status === "delivered") {
          emailSubject = `Your Scarlet Thread Order #${orderNumber} has been delivered!`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; color: #333;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${logoUrl}" alt="Scarlet Thread Logo" style="height: 50px; width: auto; vertical-align: middle; margin-right: 15px;" />
                <img src="${nameUrl}" alt="The Scarlet Thread" style="height: 35px; width: auto; vertical-align: middle;" />
              </div>
              <h1 style="color: #22c55e;">Order Delivered!</h1>
              <p>Dear ${customerName},</p>
              <p>Great news! Your Scarlet Thread order <strong>${orderNumber}</strong> has been successfully delivered.</p>
              <p>We hope you love your new purchase! If you have any feedback or issues, please don't hesitate to reach out to us.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <p style="margin-bottom: 10px; font-size: 14px; color: #555;">Have any feedback?</p>
                <a href="https://wa.me/971501872337?text=Hello!%20I%20have%20feedback%20regarding%20my%20delivered%20order%20%23${orderNumber}" 
                   style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Contact us on WhatsApp
                </a>
              </div>

              <p>Warm regards,<br>The Scarlet Thread Team</p>
            </div>
          `;
        } else if (status === "shipped") {
          const estimatedDateStr = order.estimated_delivery_date 
            ? new Date(order.estimated_delivery_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : null;
            
          const estimatedDateHtml = estimatedDateStr 
            ? `<div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bfdbfe;">
                 <p style="margin: 0; color: #1e3a8a;"><strong>Estimated Delivery:</strong> ${estimatedDateStr}</p>
               </div>`
            : '';

          emailSubject = `Your Scarlet Thread Order #${orderNumber} has been shipped!`;
          emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; color: #333;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${logoUrl}" alt="Scarlet Thread Logo" style="height: 50px; width: auto; vertical-align: middle; margin-right: 15px;" />
                <img src="${nameUrl}" alt="The Scarlet Thread" style="height: 35px; width: auto; vertical-align: middle;" />
              </div>
              <h1 style="color: #3b82f6;">Order Shipped!</h1>
              <p>Dear ${customerName},</p>
              <p>Exciting news! Your Scarlet Thread order <strong>${orderNumber}</strong> has just been shipped and is on its way to you.</p>
              ${estimatedDateHtml}
              <p>Keep an eye out for your delivery soon.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <p style="margin-bottom: 10px; font-size: 14px; color: #555;">Need help tracking?</p>
                <a href="https://wa.me/971501872337?text=Hello!%20I%20need%20help%20tracking%20my%20shipped%20order%20%23${orderNumber}" 
                   style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Track via WhatsApp
                </a>
              </div>

              <p>Warm regards,<br>The Scarlet Thread Team</p>
            </div>
          `;
        }

        // We don't await this to avoid blocking the API response
        sendEmail({
          to: [{ email: customerEmail, name: customerName }],
          subject: emailSubject,
          htmlContent: emailHtml,
        }).catch(err => console.error("Failed to send status update email:", err));
      }
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("PATCH admin order failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
