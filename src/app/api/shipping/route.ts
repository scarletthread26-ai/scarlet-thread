import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    const country = searchParams.get("country") || "United Arab Emirates";
    const state = searchParams.get("state") || "";

    const supabase = await createClient();
    
    // Fetch active shipping zones
    const { data: zones, error } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("is_active", true);

    if (error || !zones || zones.length === 0) {
      throw new Error("No active shipping zones found");
    }

    // Attempt matching by country or state
    let matchedZone = zones.find(z => 
      z.country.toLowerCase() === country.toLowerCase() && 
      state && z.name.toLowerCase().includes(state.toLowerCase())
    );

    if (!matchedZone) {
      // Fallback matching by country only
      matchedZone = zones.find(z => z.country.toLowerCase() === country.toLowerCase());
    }

    if (!matchedZone) {
      // General fallback to the first active zone
      matchedZone = zones[0];
    }

    // Calculate rate based on threshold
    let rate = matchedZone.rate;
    if (matchedZone.free_shipping_threshold && subtotal >= matchedZone.free_shipping_threshold) {
      rate = 0;
    }

    return NextResponse.json({
      rate,
      estimated_delivery: matchedZone.estimated_delivery,
      free_shipping_threshold: matchedZone.free_shipping_threshold,
      zone_name: matchedZone.name
    });
  } catch (error: any) {
    console.warn("Shipping zones calculation failed. Returning standard defaults:", error.message || error);
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    
    // Standard UAE defaults
    let rate = 15;
    if (subtotal >= 150) {
      rate = 0;
    }
    
    return NextResponse.json({
      rate,
      estimated_delivery: "1-2 Business Days",
      free_shipping_threshold: 150,
      zone_name: "Standard UAE Shipping"
    });
  }
}
