"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "@/lib/cloudinary-loader";

export default function BlogsDirectoryPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(""); // slug of selected category

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/blog-categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load blog categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.append("category", activeCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to load published blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory, searchQuery]);

  // Identify first featured blog for the hero spot, else default to latest blog
  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const listBlogs = featuredBlog ? blogs.filter((b) => b.id !== featuredBlog.id) : blogs;

  return (
    <div className="bg-slate-50/30 dark:bg-slate-950/20 min-h-screen">
      
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-purple-900 text-white py-16 sm:py-24 text-center">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent)] pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-550/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-purple-200 tracking-wider uppercase select-none">
            <BookOpen className="w-3.5 h-3.5" />
            Scarlet Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Gifting Guides & Embroidery Inspiration
          </h1>
          <p className="text-sm sm:text-base text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
            Discover helpful gifting tips, behind-the-scenes embroidery guides, and matching custom design ideas to make every celebration memorable.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        
        {/* 2. Filters & Searches Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setActiveCategory("")}
              className={cn(
                "px-4 h-9 rounded-full text-xs font-bold transition shrink-0 select-none cursor-pointer",
                activeCategory === ""
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400"
              )}
            >
              All Articles
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.slug)}
                className={cn(
                  "px-4 h-9 rounded-full text-xs font-bold transition shrink-0 select-none cursor-pointer",
                  activeCategory === c.slug
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-2xl py-2 px-4 pl-10 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition shadow-xs"
            />
          </div>
        </div>

        {isLoading ? (
          /* Skeletons Loading Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-4 animate-pulse">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 w-full" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          /* Empty Search/Filter State */
          <div className="flex flex-col items-center justify-center text-center py-20 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 border border-purple-100/55 dark:border-purple-900/40 rounded-full flex items-center justify-center text-purple-600">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Articles Found</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              We couldn't find any articles matching your search filters. Try selecting another category or typing another term.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 3. Featured Hero Blog Post */}
            {featuredBlog && !searchQuery && !activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="group relative border border-slate-200/60 dark:border-slate-850 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-md flex flex-col lg:flex-row hover:shadow-xl hover:border-slate-300/80 transition duration-300"
              >
                {/* Image panel */}
                <div className="lg:w-[55%] h-64 sm:h-96 lg:h-auto overflow-hidden relative shrink-0">
                  <img
                    src={
                      getOptimizedImageUrl(featuredBlog.featured_image) ||
                      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={featuredBlog.featured_image_alt || featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                </div>

                {/* Content info panel */}
                <div className="lg:w-[45%] p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 px-3 py-1 rounded-full">
                        {featuredBlog.category?.name || "Featured Gift Guide"}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• Featured</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-purple-600 transition">
                      <Link href={`/blogs/${featuredBlog.slug}`}>
                        {featuredBlog.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-medium">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6 gap-4">
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredBlog.published_at || featuredBlog.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredBlog.reading_time || 0} min read
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${featuredBlog.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition shadow-md shadow-purple-500/10 group-hover:translate-x-0.5"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Latest Articles Listing Grid */}
            <div className="space-y-6">
              {!searchQuery && !activeCategory && (
                <h3 className="text-lg font-heading font-extrabold text-slate-800 dark:text-slate-100">
                  Latest Articles
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listBlogs.map((blog, idx) => (
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
                          getOptimizedImageUrl(blog.featured_image) ||
                          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={blog.featured_image_alt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-550 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 px-2.5 py-0.5 rounded-full shadow-xs">
                          {blog.category?.name || "Gifts"}
                        </span>
                      </div>
                    </div>

                    {/* Content text metadata */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
