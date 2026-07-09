import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: blog, error } = await supabase
      .from("blogs")
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    // Fetch tags
    const { data: tagRelations } = await supabase
      .from("blog_tag_relations")
      .select(`
        tag:tag_id (
          id,
          name,
          slug
        )
      `)
      .eq("blog_id", id);

    const tags = (tagRelations || [])
      .map((r: any) => r.tag?.name)
      .filter(Boolean);

    return NextResponse.json({ ...blog, tags });
  } catch (error: any) {
    console.error("GET admin blog detail failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // 1. If featured_image changed, delete old image from Cloudinary
    if (featured_image !== undefined) {
      const { data: oldBlog } = await supabase
        .from("blogs")
        .select("featured_image")
        .eq("id", id)
        .single();

      if (oldBlog && oldBlog.featured_image && oldBlog.featured_image !== featured_image) {
        try {
          await deleteFromCloudinary(oldBlog.featured_image);
        } catch (e) {
          console.error("Failed to delete blog featured image from Cloudinary:", e);
        }
      }
    }

    // 2. Update Blog record
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (featured_image !== undefined) updateData.featured_image = featured_image;
    if (featured_image_alt !== undefined) updateData.featured_image_alt = featured_image_alt;
    if (author !== undefined) updateData.author = author;
    if (category_id !== undefined) updateData.category_id = category_id || null;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "published") {
        // Only set published_at if not set before
        const { data: currentBlog } = await supabase
          .from("blogs")
          .select("published_at")
          .eq("id", id)
          .single();
        if (currentBlog && !currentBlog.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }
    }
    if (featured !== undefined) updateData.featured = featured;
    if (reading_time !== undefined) updateData.reading_time = reading_time;
    if (seo_title !== undefined) updateData.seo_title = seo_title;
    if (seo_description !== undefined) updateData.seo_description = seo_description;
    if (seo_keywords !== undefined) updateData.seo_keywords = seo_keywords;

    const { data: updatedBlog, error: blogError } = await supabase
      .from("blogs")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (blogError) throw blogError;

    // 3. Update Tags if provided
    if (tags !== undefined && Array.isArray(tags)) {
      // Clear old tag relations
      await supabase.from("blog_tag_relations").delete().eq("blog_id", id);

      // Re-map tags
      for (const tagName of tags) {
        if (!tagName.trim()) continue;
        const tagSlug = tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

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
            .insert({ blog_id: id, tag_id: tag.id });
        }
      }
    }

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    console.error("PATCH admin blog failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch details to purge featured image from Cloudinary
    const { data: blog } = await supabase
      .from("blogs")
      .select("featured_image")
      .eq("id", id)
      .single();

    if (blog && blog.featured_image) {
      try {
        await deleteFromCloudinary(blog.featured_image);
      } catch (e) {
        console.error("Failed to delete blog featured image from Cloudinary during deletion:", e);
      }
    }

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE admin blog failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
