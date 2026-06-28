import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock coupons for validation
const mockCoupons = [
  {
    id: "cp-1",
    code: "SCARLET10",
    description: "10% off on all items",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase_amount: 0,
    is_active: true,
    starts_at: null,
    expires_at: null,
  },
  {
    id: "cp-2",
    code: "EID50",
    description: "50 AED off on purchases above 250 AED",
    discount_type: "fixed_amount",
    discount_value: 50,
    min_purchase_amount: 250,
    is_active: true,
    starts_at: null,
    expires_at: null,
  },
  {
    id: "cp-3",
    code: "FREESHIP",
    description: "Free shipping on orders",
    discount_type: "free_shipping",
    discount_value: 0,
    min_purchase_amount: 100,
    is_active: true,
    starts_at: null,
    expires_at: null,
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      throw new Error("Invalid coupon code");
    }

    // Validate dates
    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json({ valid: false, message: "Coupon is not active yet" }, { status: 400 });
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return NextResponse.json({ valid: false, message: "Coupon has expired" }, { status: 400 });
    }

    // Validate min purchase
    if (subtotal && subtotal < (coupon.min_purchase_amount || 0)) {
      return NextResponse.json({ 
        valid: false, 
        message: `Minimum purchase of ${coupon.min_purchase_amount} AED required for this coupon.` 
      }, { status: 400 });
    }

    // Validate usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, message: "Coupon usage limit has been reached" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, coupon });
  } catch (error: any) {
    console.warn("Supabase coupon validation failed. Checking local mock coupons:", error.message || error);
    const body = await request.json().catch(() => ({}));
    const { code, subtotal } = body;
    
    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Coupon code is invalid or expired" }, { status: 400 });
    }

    if (subtotal && subtotal < coupon.min_purchase_amount) {
      return NextResponse.json({ 
        valid: false, 
        message: `Minimum purchase of ${coupon.min_purchase_amount} AED required for this coupon.` 
      }, { status: 400 });
    }

    return NextResponse.json({ valid: true, coupon });
  }
}
