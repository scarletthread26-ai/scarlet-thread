import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    const country = searchParams.get("country") || "United Arab Emirates";
    const state = searchParams.get("state") || "";

    const supabase = await createClient();
    
    // Fetch store settings
    const { data: settingsData, error } = await supabase
      .from("settings")
      .select("*");

    if (error) {
      throw error;
    }

    const settings: Record<string, any> = {};
    if (settingsData) {
      settingsData.forEach(s => {
        settings[s.key] = s.value;
      });
    }

    const threshold = Number(settings.free_shipping_min ?? 200);
    const flatRate = Number(settings.shipping_rate ?? 18);

    let rate = flatRate;
    if (subtotal >= threshold) {
      rate = 0;
    }

    return NextResponse.json({
      rate,
      estimated_delivery: "1-2 Business Days",
      free_shipping_threshold: threshold,
      zone_name: "UAE Shipping"
    });
  } catch (error: any) {
    console.warn("Shipping zones calculation failed. Returning standard defaults:", error.message || error);
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    
    // Standard UAE defaults
    let rate = 18;
    if (subtotal >= 200) {
      rate = 0;
    }
    
    return NextResponse.json({
      rate: subtotal >= 200 ? 0 : 18,
      estimated_delivery: "1-2 Business Days",
      free_shipping_threshold: 200,
      zone_name: "Standard UAE Shipping"
    });
  }
}
