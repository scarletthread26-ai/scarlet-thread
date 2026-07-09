"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Sparkles, CheckCircle, AlertCircle, X, Tag, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlogFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState<string>(initialData?.featured_image || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featured_image_alt || "");
  const [author, setAuthor] = useState(initialData?.author || "Scarlet Editor");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [readingTime, setReadingTime] = useState<number>(initialData?.reading_time || 0);

  // SEO Fields State
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || "");
  
  // Tags Input States
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Keywords Input States
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.seo_keywords ? initialData.seo_keywords.split(",").map((k: string) => k.trim()).filter(Boolean) : []
  );
  const [keywordInput, setKeywordInput] = useState("");

  // Auto-generate slug and prefill SEO title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    // Auto-slug
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(autoSlug);

    // Auto-SEO Title (Prefill if empty or matching old title)
    if (!seoTitle || seoTitle === `${title} | Scarlet Thread` || seoTitle === title) {
      setSeoTitle(val ? `${val} | Scarlet Thread` : "");
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, ""));
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/blog-categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Tag Add/Remove Helpers
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Keyword Add/Remove Helpers
  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, idx) => idx !== indexToRemove));
  };

  // Calculate Reading Time dynamically based on words
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
    const wordsCount = text.split(/\s+/).filter(Boolean).length;
    const computedTime = Math.ceil(wordsCount / 200); // 200 wpm average
    setReadingTime(computedTime || 1);
  }, [content]);

  // SEO Validation Alerts
  const seoTitleValid = seoTitle.length >= 30 && seoTitle.length <= 60;
  const seoDescValid = seoDescription.length >= 140 && seoDescription.length <= 160;
  const hasKeywords = keywords.length > 0;
  const hasAlt = !!featuredImageAlt.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Blog content is required.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isEdit ? "Saving blog post..." : "Creating blog post...");

    try {
      const blogData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        featured_image: featuredImage || null,
        featured_image_alt: featuredImageAlt.trim(),
        author: author.trim(),
        category_id: categoryId || null,
        status,
        featured,
        reading_time: readingTime,
        seo_title: seoTitle.trim(),
        seo_description: seoDescription.trim(),
        seo_keywords: keywords.join(", "),
        tags,
      };

      const url = isEdit ? `/api/admin/blogs/${initialData.id}` : "/api/admin/blogs";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      toast.success(isEdit ? "Blog updated successfully!" : "Blog created successfully!", { id: toastId });
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save blog post.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-slate-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {isEdit ? "Edit Blog Article" : "Create New Blog Article"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in contents, structure tags, and check SEO validators before publishing.
            </p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white h-10 px-5 gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isEdit ? "Save Changes" : "Create Post"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Article Info Section */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-850 dark:text-slate-200">Article Details</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Blog Title</label>
              <input
                required
                placeholder="e.g., Best Personalized Gifts UAE"
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 outline-none text-sm shadow-inner transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Blog URL (Slug)</label>
              <input
                required
                placeholder="auto-generated-from-title"
                value={slug}
                onChange={handleSlugChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 px-4 text-slate-850 dark:text-slate-300 font-mono text-xs outline-none shadow-inner transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Short Description (Excerpt)</label>
              <textarea
                rows={3}
                placeholder="A brief snippet summarizing this article for listing grids..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 px-4 text-slate-800 dark:text-slate-100 outline-none text-sm shadow-inner resize-none transition"
              />
            </div>
          </div>

          {/* Editor Section */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-850 dark:text-slate-200">Article Content</h2>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* SEO Validation Guides */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-purple-600" />
              SEO Quality Check
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-2.5 transition",
                  seoTitleValid
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450"
                    : "bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800 text-slate-450 dark:text-slate-500"
                )}
              >
                {seoTitleValid ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-650" /> : <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />}
                <div>
                  <div className="font-bold">SEO Title Length</div>
                  <div className="mt-0.5 font-medium leading-normal">Title is {seoTitle.length} chars (Target: 30-60).</div>
                </div>
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-2.5 transition",
                  seoDescValid
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450"
                    : "bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800 text-slate-450 dark:text-slate-500"
                )}
              >
                {seoDescValid ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-650" /> : <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />}
                <div>
                  <div className="font-bold">SEO Meta Description</div>
                  <div className="mt-0.5 font-medium leading-normal">Description is {seoDescription.length} chars (Target: 140-160).</div>
                </div>
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-2.5 transition",
                  hasKeywords
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450"
                    : "bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800 text-slate-450 dark:text-slate-500"
                )}
              >
                {hasKeywords ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-650" /> : <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />}
                <div>
                  <div className="font-bold">SEO Focus Keywords</div>
                  <div className="mt-0.5 font-medium leading-normal">At least 1 focus keyword is specified.</div>
                </div>
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-2.5 transition",
                  hasAlt
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450"
                    : "bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-800 text-slate-450 dark:text-slate-500"
                )}
              >
                {hasAlt ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-650" /> : <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />}
                <div>
                  <div className="font-bold">Featured Image Alt Text</div>
                  <div className="mt-0.5 font-medium leading-normal">Alt text is defined for descriptive images.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings columns */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status & Options settings panel */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">Publishing</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-slate-700 dark:text-slate-350 outline-none text-xs shadow-inner cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4">
              <span className="text-xs font-bold text-slate-500">Featured Article</span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-purple-650 focus:ring-purple-500 rounded border-slate-300 dark:border-slate-850 cursor-pointer"
              />
            </div>

            <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
              <span className="font-bold text-slate-500">Author Name</span>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-2/3 border-b border-dashed border-slate-300 dark:border-slate-800 text-right bg-transparent outline-none focus:border-purple-600 pb-0.5 text-slate-700 dark:text-slate-300 text-xs"
              />
            </div>

            <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
              <span className="font-bold text-slate-500">Reading Time</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{readingTime} mins</span>
            </div>
          </div>

          {/* Categorization & tags panel */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">Categories & Tags</h3>

            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-slate-500 block">Blog Category (Where does this belong?)</label>
              
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full flex items-center justify-between bg-slate-55/60 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3.5 text-slate-850 dark:text-slate-350 outline-none transition duration-200 text-xs shadow-sm cursor-pointer select-none text-left"
              >
                <span>
                  {selectedCategory ? selectedCategory.name : "Select category..."}
                </span>
                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isCategoryDropdownOpen ? "rotate-90" : "")} />
              </button>

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryId("");
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition font-semibold text-slate-400 cursor-pointer"
                      >
                        Select category...
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCategoryId(c.id);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition font-bold cursor-pointer",
                            categoryId === c.id 
                              ? "text-purple-650 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20" 
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {c.name}
                        </button>
                      ))}
                      {categories.length === 0 && (
                        <div className="px-4 py-2 text-xs text-slate-400 italic">
                          No categories created yet.
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Tags Inputs */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <label className="text-xs font-bold text-slate-500">Article Tags (e.g., Hoodie, Birthday, Baby)</label>
              <div className="relative">
                <input
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner transition"
                />
                <Tag className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-455" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-650 bg-slate-100 dark:text-slate-350 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800 px-2 py-0.5 rounded-lg select-none"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Media upload featured image panel */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">Featured Image</h3>
            <ImageUpload
              value={featuredImage ? [featuredImage] : []}
              onChange={([url]) => setFeaturedImage(url || "")}
              onRemove={() => setFeaturedImage("")}
              maxFiles={1}
            />
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Image Description (For Google Search)</label>
              <input
                placeholder="Describe this image for search engines..."
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner transition"
              />
            </div>
          </div>

          {/* SEO Metadata Config panel */}
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">Google Search SEO</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Google Search Title (Displayed in search results)</label>
              <input
                placeholder="Title shown on Google search..."
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Google Search Description (Short summary displayed on Google)</label>
              <textarea
                rows={3}
                placeholder="Summary shown on Google search..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner resize-none transition"
              />
            </div>

            {/* SEO Keywords tags input */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-500">Google Search Keywords (e.g., Custom Gifts Dubai)</label>
              <div className="relative">
                <input
                  placeholder="Type a keyword and press Enter"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={addKeyword}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner transition"
                />
                <Sparkles className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-455" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywords.map((k, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30 px-2 py-0.5 rounded-lg select-none"
                  >
                    {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(idx)}
                      className="text-purple-450 hover:text-rose-500 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
