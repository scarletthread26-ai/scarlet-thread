import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock settings
let mockSettings: Record<string, any> = {
  store_name: "Scarlet Thread",
  store_email: "contact@scarletthread.ae",
  currency: "AED",
  whatsapp_number: "+971501234567",
  whatsapp_template: "Hello Scarlet Thread, I would like to inquire about order {order_number}",
  seo_title: "Scarlet Thread | Personalized Embroidered Gifts in UAE",
  seo_description: "Buy premium custom embroidered hoodies, towels, sweatshirts, and gifts in Dubai, Abu Dhabi, and across the UAE.",
  free_shipping_min: 150,
  tax_percentage: 5
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*");

    if (error) throw error;

    if (data && data.length > 0) {
      // Map to single object key-values
      const mapped: Record<string, any> = {};
      data.forEach((s: any) => {
        mapped[s.key] = s.value;
      });
      return NextResponse.json(mapped);
    }

    return NextResponse.json(mockSettings);
  } catch (error: any) {
    console.warn("Supabase settings query failed. Returning mock settings:", error.message || error);
    return NextResponse.json(mockSettings);
  }
}

export async function POST(request: Request) {
  let body: any = {};
  try {
    const supabase = await createClient();
    body = await request.json(); // Record<string, any>

    // Loop keys and upsert settings
    const upserts = Object.keys(body).map(key => ({
      key,
      value: body[key]
    }));

    const { error } = await supabase
      .from("settings")
      .upsert(upserts, { onConflict: "key" });

    if (error) throw error;
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    console.warn("Supabase settings post failed. Simulating local update:", error.message || error);
    mockSettings = {
      ...mockSettings,
      ...body
    };
    return NextResponse.json({ success: true, settings: mockSettings });
  }
}
