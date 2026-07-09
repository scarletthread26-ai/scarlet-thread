import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { BlogShareButtons } from "@/components/blog/blog-share-buttons";
import React from "react";
import { getOptimizedImageUrl } from "@/lib/cloudinary-loader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogData(slug: string) {
  try {
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
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    if (!blog) return null;

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
      .eq("blog_id", blog.id);

    const tags = (tagRelations || []).map((r: any) => r.tag);
    const tagNames = tags.map((t: any) => t?.name).filter(Boolean);
    const tagIds = tags.map((t: any) => t?.id).filter(Boolean);

    // Fetch related blogs (limit 3)
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

    if (tagIds.length > 0) {
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

    // Fetch Prev and Next
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

    return {
      blog: { ...blog, tags: tagNames },
      relatedBlogs: relatedBlogsWithTags,
      prevPost: prevBlogs?.[0] || null,
      nextPost: nextBlogs?.[0] || null,
    };
  } catch (err) {
    console.warn("DB blog query failed, returning fallback mock post:", err);
    return {
      blog: {
        id: "mock-id",
        title: "Personalized Gifting in the UAE: Stitched with Love",
        slug: slug,
        excerpt: "Discover why personalized embroidered gifts make every occasion special.",
        content: `
          <h1>Why Personalized Gifts Matter</h1>
          <p>Personalized gifts carry a unique charm that off-the-shelf presents simply cannot replicate. They show that the giver has put thought, effort, and care into selecting a present tailored specifically for the recipient.</p>
          <h2>The Rise of Embroidered Custom Gifts</h2>
          <p>Among customization methods, embroidery stands out due to its longevity, premium look, and elegant textures. Unlike print-on-demand items that might crack or peel, embroidery remains vibrant and tactile for years to come.</p>
          <blockquote>"A custom gift isn't just an object; it is a shared memory stitched into reality."</blockquote>
          <p>At Scarlet Thread, we custom embroider hoodies, sweatshirts, and baby blankets to ensure that your memories last forever.</p>
        `,
        featured_image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
        featured_image_alt: "Personalized embroidery thread",
        author: "Scarlet Editor",
        reading_time: 3,
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        category: { name: "Personalized Gifts", slug: "personalized-gifts" },
        tags: ["Embroidery", "Personalized", "UAE"],
      },
      relatedBlogs: [],
      prevPost: null,
      nextPost: null,
    };
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBlogData(slug);
  if (!data || !data.blog) {
    return {
      title: "Article Not Found",
      description: "This blog article could not be located.",
    };
  }

  const { blog } = data;
  const canonicalUrl = `https://scarletthread.ae/blogs/${blog.slug}`;
  const imageUrl = blog.featured_image || "https://scarletthread.ae/images/logo/logo.png";

  return {
    title: blog.seo_title || `${blog.title} | Scarlet Thread`,
    description: blog.seo_description || blog.excerpt,
    keywords: blog.seo_keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: blog.featured_image_alt || blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBlogData(slug);

  if (!data || !data.blog) {
    notFound();
  }

  const { blog, relatedBlogs, prevPost, nextPost } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt || blog.seo_description,
    "image": blog.featured_image || "https://scarletthread.ae/images/logo/logo.png",
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Scarlet Thread",
      "logo": {
        "@type": "ImageObject",
        "url": "https://scarletthread.ae/images/logo/logo.png"
      }
    },
    "datePublished": blog.published_at || blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://scarletthread.ae/blogs/${blog.slug}`
    }
  };

  return (
    <article className="bg-slate-50/20 dark:bg-slate-950/10 min-h-screen py-12">
      {/* 1. SEO JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-650 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        {/* 2. Blog Header Metadata */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 px-3 py-1 rounded-full">
              {blog.category?.name || "Gift Ideas"}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-slate-400 font-bold font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {blog.reading_time || 0} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
            {blog.title}
          </h1>

          <p className="text-slate-500 text-sm leading-relaxed max-w-3xl font-medium border-l-2 border-purple-200 dark:border-purple-900/50 pl-4 py-1 italic">
            {blog.excerpt}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-slate-200/50 dark:border-slate-800/80 py-4 gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Written by <span className="font-bold text-slate-700 dark:text-slate-300">{blog.author}</span>
            </span>
            <BlogShareButtons title={blog.title} slug={blog.slug} />
          </div>
        </header>

        {/* 3. Featured Image */}
        {blog.featured_image && (
          <div className="w-full h-64 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm relative">
            <img
              src={getOptimizedImageUrl(blog.featured_image)}
              alt={blog.featured_image_alt || blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 4. Article Content rendering TipTap HTML output cleanly */}
        <div 
          className="prose dark:prose-invert prose-purple max-w-none text-slate-800 dark:text-slate-200 leading-relaxed py-4 text-sm sm:text-base prose-headings:font-heading prose-headings:font-extrabold prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50/20 dark:prose-blockquote:bg-purple-950/10 prose-blockquote:p-4 prose-blockquote:rounded-xl prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags badges */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/50 dark:border-slate-800/80 pt-6">
            <span className="text-xs font-bold text-slate-450 uppercase mr-1 tracking-wider">Tags:</span>
            {blog.tags.map((t: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-bold text-slate-650 bg-slate-100 dark:text-slate-350 dark:bg-slate-850 px-2.5 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* 5. Previous / Next Navigations */}
        {(prevPost || nextPost) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-200/50 dark:border-slate-800/80 py-8 select-none">
            {prevPost ? (
              <Link
                href={`/blogs/${prevPost.slug}`}
                className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900/50 text-left hover:border-purple-300 dark:hover:border-purple-900/30 transition flex items-center gap-3 group"
              >
                <ChevronLeft className="w-5 h-5 text-purple-600 shrink-0 group-hover:-translate-x-0.5 transition" />
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">Previous Post</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 group-hover:text-purple-650 transition mt-0.5">{prevPost.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/blogs/${nextPost.slug}`}
                className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900/50 text-right hover:border-purple-300 dark:hover:border-purple-900/30 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">Next Post</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 group-hover:text-purple-650 transition mt-0.5">{nextPost.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-600 shrink-0 group-hover:translate-x-0.5 transition" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* 6. Related Blogs */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className="space-y-6 pt-4">
            <h3 className="text-xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 select-none">
              <Sparkles className="w-5 h-5 text-purple-600" />
              You Might Also Like
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b: any) => (
                <article
                  key={b.id}
                  className="group border border-slate-200/40 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="h-32 overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={getOptimizedImageUrl(b.featured_image) || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"}
                      alt={b.featured_image_alt || b.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500 ease-out"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-purple-650 transition">
                      <Link href={`/blogs/${b.slug}`}>{b.title}</Link>
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block">
                      {new Date(b.published_at || b.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
