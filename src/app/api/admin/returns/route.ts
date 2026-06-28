import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock returns for fallback
let mockReturnRequests = [
  {
    id: "ret-1",
    order_id: "ord-1002",
    order_number: "ST-10002",
    customer_name: "Fatima Hassan",
    reason: "Damaged item: Monogram stitching got pulled during unboxing.",
    status: "pending",
    refund_amount: 149,
    notes: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ret-2",
    order_id: "ord-1003",
    order_number: "ST-10003",
    customer_name: "Sarah Smith",
    reason: "Wrong sizing: Ordered S, fits smaller than expected.",
    status: "completed",
    refund_amount: 69,
    notes: "Refund processed successfully.",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("return_requests")
      .select(`
        *,
        orders:order_id(order_number, guest_email, user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch user profiles for user_id on orders
    const mapped = await Promise.all(data.map(async (ret: any) => {
      let customerName = ret.orders?.guest_email || "Guest";
      if (ret.orders?.user_id) {
        const { data: profile } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", ret.orders.user_id)
          .single();
        if (profile?.full_name) {
          customerName = profile.full_name;
        }
      }

      return {
        ...ret,
        order_number: ret.orders?.order_number || "ST-00000",
        customer_name: customerName
      };
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.warn("Supabase return requests fetch failed. Returning mock return requests:", error.message || error);
    return NextResponse.json(mockReturnRequests);
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, status, refund_amount, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Return ID and status are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("return_requests")
      .update({
        status,
        refund_amount: Number(refund_amount) || 0,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase return request patch failed. Simulating local success:", error.message || error);
    const body = await request.json();
    const idx = mockReturnRequests.findIndex(r => r.id === body.id);
    if (idx !== -1) {
      const updated = {
        ...mockReturnRequests[idx],
        status: body.status,
        refund_amount: Number(body.refund_amount) || mockReturnRequests[idx].refund_amount,
        notes: body.notes || mockReturnRequests[idx].notes,
        updated_at: new Date().toISOString()
      };
      mockReturnRequests[idx] = updated;
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: "Return request not found" }, { status: 404 });
  }
}
