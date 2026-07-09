import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    let query = supabase
      .from("blogs")
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (category) {
      query = query.eq("category_id", category);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data: blogs, error } = await query;
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

    return NextResponse.json(blogsWithTags);
  } catch (error: any) {
    console.warn("GET admin blogs failed. Returning mock data:", error.message || error);
    // Return empty list mock data
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      featured_image_alt,
      author,
      category_id,
      status,
      featured,
      reading_time,
      seo_title,
      seo_description,
      seo_keywords,
      tags,
    } = body;

    // 1. Insert Blog
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .insert({
        title,
        slug,
        excerpt,
        content,
        featured_image,
        featured_image_alt,
        author: author || "Scarlet Editor",
        category_id: category_id || null,
        status: status || "draft",
        featured: featured || false,
        reading_time: reading_time || 0,
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt || "",
        seo_keywords: seo_keywords || "",
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (blogError) throw blogError;

    // 2. Handle Tags mapping
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName.trim()) continue;
        const tagSlug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        
        // Find or create tag
        let { data: tag } = await supabase
          .from("blog_tags")
          .select("id")
          .eq("slug", tagSlug)
          .maybeSingle();

        if (!tag) {
          const { data: newTag, error: newTagError } = await supabase
            .from("blog_tags")
            .insert({ name: tagName.trim(), slug: tagSlug })
            .select("id")
            .single();
          if (!newTagError) {
            tag = newTag;
          }
        }

        if (tag) {
          await supabase
            .from("blog_tag_relations")
            .insert({ blog_id: blog.id, tag_id: tag.id });
        }
      }
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error("POST admin blog failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}
