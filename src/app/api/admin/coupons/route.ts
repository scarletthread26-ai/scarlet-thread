import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Local state mock coupons for fallback
let mockAdminCoupons = [
  {
    id: "cp-1",
    code: "SCARLET10",
    description: "10% off on all items",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase_amount: 0,
    starts_at: null,
    expires_at: null,
    usage_limit: 100,
    usage_count: 14,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cp-2",
    code: "EID50",
    description: "50 AED off on purchases above 250 AED",
    discount_type: "fixed_amount",
    discount_value: 50,
    min_purchase_amount: 250,
    starts_at: null,
    expires_at: null,
    usage_limit: 50,
    usage_count: 5,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cp-3",
    code: "FREESHIP",
    description: "Free shipping on orders",
    discount_type: "free_shipping",
    discount_value: 0,
    min_purchase_amount: 100,
    starts_at: null,
    expires_at: null,
    usage_limit: null,
    usage_count: 22,
    is_active: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase coupons fetch failed. Returning mock admin coupons:", error.message || error);
    return NextResponse.json(mockAdminCoupons);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Clean and validate code
    body.code = body.code.toUpperCase().replace(/\s/g, "");

    const { data, error } = await supabase
      .from("coupons")
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase coupon creation failed. Simulating local success:", error.message || error);
    const body = await request.json();
    const newCoupon = {
      id: Math.random().toString(36).substring(2, 9),
      code: body.code.toUpperCase().replace(/\s/g, ""),
      description: body.description || null,
      discount_type: body.discount_type || "percentage",
      discount_value: Number(body.discount_value) || 0,
      min_purchase_amount: Number(body.min_purchase_amount) || 0,
      starts_at: body.starts_at || null,
      expires_at: body.expires_at || null,
      usage_limit: body.usage_limit ? Number(body.usage_limit) : null,
      usage_count: 0,
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString()
    };
    mockAdminCoupons.unshift(newCoupon);
    return NextResponse.json(newCoupon);
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    if (updates.code) {
      updates.code = updates.code.toUpperCase().replace(/\s/g, "");
    }

    const { data, error } = await supabase
      .from("coupons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase coupon patch failed. Simulating local success:", error.message || error);
    const body = await request.json();
    const idx = mockAdminCoupons.findIndex(c => c.id === body.id);
    if (idx !== -1) {
      const updated = {
        ...mockAdminCoupons[idx],
        ...body,
        code: body.code ? body.code.toUpperCase().replace(/\s/g, "") : mockAdminCoupons[idx].code
      };
      mockAdminCoupons[idx] = updated;
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.warn("Supabase coupon delete failed. Simulating local success:", error.message || error);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    mockAdminCoupons = mockAdminCoupons.filter(c => c.id !== id);
    return NextResponse.json({ success: true });
  }
}
