import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DEFAULT_FAQS = [
  {
    id: "f1",
    category: "personalization",
    question: "What personalization options do you offer?",
    answer: "We offer name embroidery, initial monograms, and custom embroidery designs on select fabrics. You can select fonts (Script, Serif, Modern Calligraphy), thread colors, and layouts directly on each product's customization panel.",
    display_order: 0,
    is_active: true
  },
  {
    id: "f2",
    category: "personalization",
    question: "Can I write a name in Arabic?",
    answer: "Yes! We fully support custom embroidery in both English and Arabic script. Simply type your custom text in the personalization box on the product page. If you have a specific spelling preference in Arabic, you can leave a note at checkout or WhatsApp us immediately after ordering.",
    display_order: 1,
    is_active: true
  },
  {
    id: "f3",
    category: "personalization",
    question: "Can you embroider custom logos or artwork?",
    answer: "Yes, we can! For corporate orders, custom branding, or special vector artwork, please contact us directly via email at support@thescarletthread.in or WhatsApp us. We will digitize your logo for our embroidery machines. Note that custom logo setup might incur a one-time digitization fee.",
    display_order: 2,
    is_active: true
  },
  {
    id: "f4",
    category: "shipping",
    question: "How long does production and shipping take?",
    answer: "Because our items are custom embroidered to order, embroidery setup and stitching takes 1-2 business days. Delivery across Dubai, Sharjah, and Ajman takes 1 business day (next-day delivery once shipped). Deliveries to other UAE Emirates (Abu Dhabi, Al Ain, Fujairah, Ras Al Khaimah, Umm Al Quwain) take 2 business days.",
    display_order: 3,
    is_active: true
  },
  {
    id: "f5",
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Currently, we ship to all GCC countries (Saudi Arabia, Oman, Qatar, Bahrain, Kuwait) and selected international destinations. Shipping rates and delivery times for international orders are calculated at checkout. Standard GCC delivery takes 3-5 business days.",
    display_order: 4,
    is_active: true
  },
  {
    id: "f6",
    category: "shipping",
    question: "Can I collect my order directly from your studio?",
    answer: "Yes! If you are based in Dubai and would like to collect your order, select the 'Self-Pickup' option during checkout. Once your personalized item is ready (usually within 24-48 hours), we will send you a pickup notification with location details and studio hours.",
    display_order: 5,
    is_active: true
  },
  {
    id: "f7",
    category: "payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express) securely through our payment gateway. We also support Cash on Delivery (COD) for deliveries within the UAE, as well as digital wallets like Apple Pay.",
    display_order: 6,
    is_active: true
  },
  {
    id: "f8",
    category: "payments",
    question: "Can I change my personalization details after placing an order?",
    answer: "Please contact us immediately via WhatsApp or phone within 2 hours of placing your order if you need to make changes. Once an item has entered the digitizing or embroidery stage, we are unable to modify the customization details.",
    display_order: 7,
    is_active: true
  },
  {
    id: "f9",
    category: "returns",
    question: "What is your refund and return policy?",
    answer: "Since our products are custom embroidered and personalized specifically for you, we cannot accept returns or exchanges unless the item is defective or there was an error in personalization on our part. Please inspect your order upon receipt and contact us within 48 hours if you receive a damaged or incorrect item.",
    display_order: 8,
    is_active: true
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(DEFAULT_FAQS);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.warn("Supabase faqs GET failed. Returning mock FAQs:", error.message || error);
    return NextResponse.json(DEFAULT_FAQS);
  }
}
