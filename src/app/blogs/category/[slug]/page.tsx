"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function BlogCategoryDirectoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndBlogs = async () => {
      setIsLoading(true);
      try {
        // Resolve categories to match slug name
        const catRes = await fetch("/api/admin/blog-categories");
        if (catRes.ok) {
          const categories = await catRes.json();
          const activeCat = categories.find((c: any) => c.slug === slug);
          if (activeCat) {
            setCategory(activeCat);
          } else {
            toast.error("Category directory not found.");
            router.push("/blogs");
            return;
          }
        }

        // Fetch blogs under this category
        const blogsRes = await fetch(`/api/blogs?category=${slug}`);
        if (blogsRes.ok) {
          const data = await blogsRes.json();
          setBlogs(data.blogs || []);
        }
      } catch (err) {
        console.error("Failed to load category directory:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndBlogs();
    }
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="text-sm text-slate-550 font-medium">Loading category articles...</span>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="bg-slate-50/30 dark:bg-slate-950/20 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Breadcrumbs & Title */}
        <div className="space-y-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Blogs
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100">
              Category: <span className="text-purple-650">{category.name}</span>
            </h1>
            <p className="text-xs text-slate-450 mt-1.5 font-medium">
              Showing all articles published under the {category.name} directory.
            </p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 border border-purple-100/55 dark:border-purple-900/40 rounded-full flex items-center justify-center text-purple-600">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Articles Yet</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              We haven't published any articles in {category.name} yet. Check back soon for guides and tips!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group border border-slate-200/50 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-800 transition duration-300"
              >
                {/* Thumbnail Image */}
                <div className="h-48 overflow-hidden relative shrink-0">
                  <img
                    src={
                      blog.featured_image ||
                      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={blog.featured_image_alt || blog.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-550 ease-out"
                  />
                </div>

                {/* Content text */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-purple-650 transition line-clamp-2">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-450 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850/50 pt-4 text-[10px] text-slate-400 font-bold font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.reading_time || 0} min read
                    </span>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="font-sans font-bold text-purple-650 hover:text-purple-700 hover:underline flex items-center gap-0.5 text-xs transition"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
