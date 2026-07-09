import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MOCK_GOOGLE_REVIEWS = [
  {
    id: "gmock-1",
    name: "Fatima Al-Mansoori",
    role: "Local Guide",
    rating: 5,
    comment: "The personalized baby hooded towel is incredibly soft! The embroidery is perfectly neat, and the packaging was absolutely beautiful. Will buy again.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "google"
  },
  {
    id: "gmock-2",
    name: "Sarah Jenkins",
    role: "Verified Google Review",
    rating: 5,
    comment: "I ordered custom Bride Cosmetic Pouches for my bridal shower. The girls absolutely adored them! The modern calligraphy font was beautiful.",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: "google"
  },
  {
    id: "gmock-3",
    name: "Tarek Ghaoui",
    role: "Google Reviewer",
    rating: 5,
    comment: "Ordered 50 custom embossed leather organizers for our corporate retreat. Seamless process, swift delivery in Dubai, and outstanding premium quality.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    source: "google"
  },
  {
    id: "gmock-4",
    name: "Emily Watson",
    role: "Local Guide",
    rating: 5,
    comment: "Perfect custom embroidery on hoodies. The customer support helped me choose the exact thread shade. 10/10 service!",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    source: "google"
  }
];

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Fetch Google Reviews settings
    const { data: settings } = await supabase
      .from("homepage_sections")
      .select("content, is_active")
      .eq("section_key", "google-reviews")
      .maybeSingle();

    let googleReviews: any[] = [];

    if (settings?.is_active && settings.content?.place_id && settings.content?.api_key) {
      const { place_id, api_key } = settings.content;

      // Fetch from Google Places API
      const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=reviews,name,rating&key=${api_key}`;

      try {
        const res = await fetch(googleUrl);
        if (res.ok) {
          const json = await res.json();
          if (json.result?.reviews) {
            googleReviews = json.result.reviews.map((r: any) => ({
              id: `google-${r.time}`,
              name: r.author_name,
              role: r.author_url ? "Local Guide" : "Verified Google Review",
              rating: r.rating,
              comment: r.text,
              avatar_url: r.profile_photo_url || null,
              created_at: new Date(r.time * 1000).toISOString(),
              source: "google"
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch from Google Places API:", err);
      }
    }

    // 2. Fetch manual reviews from database
    const { data: dbReviews } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true);

    const manualReviews = (dbReviews || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      role: r.role || "Verified Google Review",
      rating: r.rating,
      comment: r.comment,
      avatar_url: r.avatar_url || null,
      created_at: r.created_at,
      source: "manual"
    }));

    // Combine them
    let allReviews = [...googleReviews, ...manualReviews];

    // Sort by rating desc, then date desc
    allReviews.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const hasConfig = !!(settings?.is_active && settings.content?.place_id);
    const hasDbData = manualReviews.length > 0;

    if (!hasConfig && !hasDbData) {
      allReviews = MOCK_GOOGLE_REVIEWS;
    }

    return NextResponse.json({
      reviews: allReviews,
      totalCount: allReviews.length,
      is_active: settings?.is_active !== false,
      settings: settings?.content || {}
    });
  } catch (error: any) {
    console.error("Google reviews API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
