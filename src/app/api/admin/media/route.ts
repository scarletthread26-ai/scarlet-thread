import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Fallback if Cloudinary is not configured or in template mode
    if (!cloudName || !apiKey || !apiSecret || cloudName === "your-cloud-name") {
      const mockResources = [
        {
          public_id: "scarlet_thread_products/embroidery_threads",
          secure_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          bytes: 154302,
          format: "jpg",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          public_id: "scarlet_thread_products/gifts_blanket",
          secure_url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&q=80",
          bytes: 843210,
          format: "jpg",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        },
        {
          public_id: "scarlet_thread_products/custom_sweatshirt",
          secure_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
          bytes: 2043912,
          format: "jpg",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        },
      ];
      return NextResponse.json({ resources: mockResources });
    }

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "scarlet_thread_products/",
      max_results: 100,
    });

    return NextResponse.json({ resources: result.resources || [] });
  } catch (error: any) {
    console.error("GET API admin media failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch media library resources" },
      { status: 500 }
    );
  }
}
