import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";
    const tagSlug = searchParams.get("tag") || "";
    const featured = searchParams.get("featured") || "";

    // 1. Resolve Category ID if slug is provided
    let categoryId = "";
    if (categorySlug) {
      const { data: cat } = await supabase
        .from("blog_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (cat) {
        categoryId = cat.id;
      } else {
        // If category is provided but not found, return empty
        return NextResponse.json({ blogs: [], total: 0 });
      }
    }

    // 2. Resolve Tag ID if slug is provided
    let tagId = "";
    if (tagSlug) {
      const { data: tag } = await supabase
        .from("blog_tags")
        .select("id")
        .eq("slug", tagSlug)
        .maybeSingle();
      if (tag) {
        tagId = tag.id;
      } else {
        return NextResponse.json({ blogs: [], total: 0 });
      }
    }

    // 3. Build Query
    let query = supabase
      .from("blogs")
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        )
      `, { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (featured === "true") {
      query = query.eq("featured", true);
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search) {
      // Search by title, excerpt, content, or seo keywords
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%,seo_keywords.ilike.%${search}%`);
    }

    // If tag filtering is required, we filter by tagId
    if (tagId) {
      const { data: relations } = await supabase
        .from("blog_tag_relations")
        .select("blog_id")
        .eq("tag_id", tagId);
      
      const blogIds = (relations || []).map((r: any) => r.blog_id);
      if (blogIds.length > 0) {
        query = query.in("id", blogIds);
      } else {
        return NextResponse.json({ blogs: [], total: 0 });
      }
    }

    const { data: blogs, count, error } = await query;
    if (error) throw error;

    // Fetch tags for each blog
    const blogsWithTags = await Promise.all(
      (blogs || []).map(async (blog: any) => {
        const { data: tagRelations } = await supabase
          .from("blog_tag_relations")
          .select(`
            tag:tag_id (
              id,
              name,
              slug
            )
          `)
          .eq("blog_id", blog.id);

        const tags = (tagRelations || [])
          .map((r: any) => r.tag?.name)
          .filter(Boolean);

        return { ...blog, tags };
      })
    );

    return NextResponse.json({ blogs: blogsWithTags, total: count || 0 });
  } catch (error: any) {
    console.warn("GET public blogs failed. Returning empty list:", error.message || error);
    return NextResponse.json({ blogs: [], total: 0 });
  }
}
