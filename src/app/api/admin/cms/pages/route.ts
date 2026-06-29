import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const mockPages = [
  { id: "1", title: "About Us", slug: "about", content: "<p>We are The Scarlet Thread. We design and craft premium personalized embroidered items with care and attention to detail. Every product we embroider is made to order, ensuring high quality and uniqueness.</p>", is_active: true },
  { id: "2", title: "Privacy Policy", slug: "privacy", content: "<p>Your privacy is important to us. We handle client data securely. We only collect the information necessary to process your customized orders and provide customer support. Your personalization text, contact information, and delivery details are never shared with unauthorized third parties.</p>", is_active: true },
  { id: "3", title: "Terms & Conditions", slug: "terms", content: "<p>By purchasing from The Scarlet Thread, you agree to our custom design guidelines. Since our products are custom embroidered to order, designs are configured based on your inputs. Please double-check spellings and choices before placing an order. Payment is processed securely, and order placement constitutes agreement to these terms.</p>", is_active: true },
  { id: "4", title: "Shipping Policy", slug: "shipping", content: "<p>We deliver across Dubai, Abu Dhabi, Sharjah, and other UAE Emirates. Because each item is customized, production takes 1-2 business days. Delivery across Dubai and Sharjah is next-day, and other Emirates take 2 business days. Express shipping options are available at checkout.</p>", is_active: true },
  { id: "5", title: "Return Policy", slug: "returns", content: "<p>We strive for perfect quality. Customized embroidery items cannot be returned or refunded unless there is a physical defect or spelling mistake that was our fault. In such cases, please contact us within 48 hours of delivery at support@thescarletthread.in with photos of the issue, and we will issue a replacement.</p>", is_active: true }
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
