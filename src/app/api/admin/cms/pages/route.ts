import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const mockPages = [
  { id: "1", title: "About Us", slug: "about-us", content: "<p>We are Scarlet Thread. We build custom embroidered gifts...</p>", is_active: true },
  { id: "2", title: "Privacy Policy", slug: "privacy-policy", content: "<p>Your privacy is important to us. We handle client data securely...</p>", is_active: true },
  { id: "3", title: "Terms of Service", slug: "terms-of-service", content: "<p>By purchasing from Scarlet Thread, you agree to our custom design guidelines...</p>", is_active: true },
  { id: "4", title: "Shipping & Returns Policy", slug: "shipping-returns", content: "<p>We deliver across the UAE in 1-2 business days. Customized embroidery items cannot be returned unless defective...</p>", is_active: true }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase cms_pages GET failed. Returning mock pages:", error.message || error);
    return NextResponse.json(mockPages);
  }
}
