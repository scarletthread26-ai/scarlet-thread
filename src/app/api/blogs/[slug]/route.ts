import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // 1. Get current blog
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
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // 2. Fetch tags for this blog
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

    const tags = (tagRelations || []).map((r: any) => r.tag);
    const tagNames = tags.map((t: any) => t?.name).filter(Boolean);
    const tagIds = tags.map((t: any) => t?.id).filter(Boolean);

    // 3. Fetch related blogs (limit 3)
    // Filter: same category or sharing any tags, status = published, excluding current blog
    let relatedQuery = supabase
      .from("blogs")
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        )
      `)
      .eq("status", "published")
      .neq("id", blog.id)
      .limit(3);

    // If tagIds exist, check sharing tags or same category
    if (tagIds.length > 0) {
      // Find blogs with same category or matching tag relations
      const { data: siblingTagRelations } = await supabase
        .from("blog_tag_relations")
        .select("blog_id")
        .in("tag_id", tagIds)
        .limit(30);

      const siblingBlogIds = (siblingTagRelations || [])
        .map((r: any) => r.blog_id)
        .filter((id: string) => id !== blog.id);

      if (siblingBlogIds.length > 0) {
        relatedQuery = relatedQuery.or(`category_id.eq.${blog.category_id},id.in.(${siblingBlogIds.join(",")})`);
      } else {
        relatedQuery = relatedQuery.eq("category_id", blog.category_id);
      }
    } else {
      relatedQuery = relatedQuery.eq("category_id", blog.category_id);
    }

    const { data: relatedBlogs } = await relatedQuery;

    // Attach tags to related blogs
    const relatedBlogsWithTags = await Promise.all(
      (relatedBlogs || []).map(async (b: any) => {
        const { data: rels } = await supabase
          .from("blog_tag_relations")
          .select("tag:tag_id(name)")
          .eq("blog_id", b.id);
        const tNames = (rels || []).map((r: any) => r.tag?.name).filter(Boolean);
        return { ...b, tags: tNames };
      })
    );

    // 4. Fetch Previous and Next published blogs
    const { data: prevBlogs } = await supabase
      .from("blogs")
      .select("title, slug")
      .eq("status", "published")
      .lt("published_at", blog.published_at || blog.created_at)
      .order("published_at", { ascending: false })
      .limit(1);

    const { data: nextBlogs } = await supabase
      .from("blogs")
      .select("title, slug")
      .eq("status", "published")
      .gt("published_at", blog.published_at || blog.created_at)
      .order("published_at", { ascending: true })
      .limit(1);

    const prevPost = prevBlogs?.[0] || null;
    const nextPost = nextBlogs?.[0] || null;

    return NextResponse.json({
      blog: { ...blog, tags: tagNames },
      relatedBlogs: relatedBlogsWithTags,
      prevPost,
      nextPost,
    });
  } catch (error: any) {
    console.error("GET public blog details failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog details" },
      { status: 500 }
    );
  }
}
