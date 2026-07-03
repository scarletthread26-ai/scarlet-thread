import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Initialize Supabase admin client to bypass RLS
        const supabaseAdmin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Update order status to paid
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid" })
          .eq("id", orderId);

        if (error) {
          console.error("Failed to update order payment status in DB:", error);
          return NextResponse.json(
            { error: "Payment verified but database update failed." },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, status: "paid" });
      }
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
      message: "Payment not completed yet.",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
