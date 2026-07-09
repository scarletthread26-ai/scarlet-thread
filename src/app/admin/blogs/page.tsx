"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import {
  Plus,
  Edit,
  Trash2,
  Newspaper,
  Copy,
  FolderTree,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BlogsAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedStatus) params.append("status", selectedStatus);

      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to load blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/blog-categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting blog post...");
    try {
      const res = await fetch(`/api/admin/blogs/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Blog post deleted successfully!", { id: toastId });
        setBlogs(blogs.filter((b) => b.id !== deleteId));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to delete blog post.", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

  const handleDuplicate = async (blog: any) => {
    const toastId = toast.loading("Duplicating blog post...");
    try {
      const duplicatedData = {
        ...blog,
        title: `${blog.title} (Copy)`,
        slug: `${blog.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        status: "draft",
        published_at: null,
        featured: false,
        tags: blog.tags || [],
      };
      delete duplicatedData.id;
      delete duplicatedData.created_at;
      delete duplicatedData.updated_at;
      delete duplicatedData.category;

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedData),
      });

      if (res.ok) {
        toast.success("Blog duplicated successfully as Draft!", { id: toastId });
        fetchBlogs();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to duplicate blog.", { id: toastId });
    }
  };

  const handleToggleStatus = async (blog: any) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    const toastId = toast.loading(
      newStatus === "published" ? "Publishing blog..." : "Unpublishing blog..."
    );

    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(
          newStatus === "published" ? "Blog published!" : "Blog saved to drafts!",
          { id: toastId }
        );
        fetchBlogs();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to update blog status.", { id: toastId });
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "featured_image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl =
          row.original.featured_image ||
          "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80";

        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 shrink-0">
            <img src={imageUrl} alt={row.original.title} className="w-full h-full object-cover" />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Blog Title",
      cell: ({ row }) => (
        <div className="max-w-[280px]">
          <span className="font-bold text-slate-850 dark:text-slate-200 block text-sm leading-snug">
            {row.original.title}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block truncate mt-0.5">
            /blogs/{row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded-full border border-purple-100/50 dark:border-purple-900/30">
          {row.original.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {row.original.author}
        </span>
      ),
    },
    {
      accessorKey: "published_at",
      header: "Publish Date",
      cell: ({ row }) => {
        const dateStr = row.original.published_at || row.original.created_at;
        return (
          <span className="text-xs text-slate-500 font-medium">
            {dateStr ? new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.original.status === "published";
        return (
          <span
            onClick={() => handleToggleStatus(row.original)}
            className={cn(
              "text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border cursor-pointer select-none transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1",
              isPublished
                ? "bg-green-50 text-green-700 border-green-150 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
                : "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
            )}
          >
            {isPublished ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Published
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                Draft
              </>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md border",
            row.original.featured
              ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40"
              : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800"
          )}
        >
          {row.original.featured ? "Yes" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "reading_time",
      header: "Read Time",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-slate-500 font-bold">
          {row.original.reading_time || 0} min
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5 min-w-[130px]">
            <Link
              href={`/blogs/${row.original.slug}`}
              target="_blank"
              className="p-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              title="Preview Blog"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/admin/blogs/${row.original.id}`}
              className="p-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              title="Edit Blog"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDuplicate(row.original)}
              className="p-1.5 rounded-lg border border-slate-200/50 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
              title="Duplicate Blog"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteId(row.original.id)}
              className="p-1.5 rounded-lg border border-slate-200/50 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/20 text-slate-400 transition cursor-pointer"
              title="Delete Blog"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const filterContent = (
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none text-xs shadow-sm cursor-pointer min-w-[130px]"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none text-xs shadow-sm cursor-pointer min-w-[110px]"
      >
        <option value="">All Statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
            <Newspaper className="w-6 h-6 text-purple-650" />
            Blog Article Management
          </h1>
          <p className="text-xs text-slate-450 mt-1.5">
            Create, publish, edit, and organize SEO articles for Scarlet Thread.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/blogs/categories"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 h-10 text-xs font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 rounded-xl transition shadow-xs"
          >
            <FolderTree className="w-4 h-4" />
            Categories
          </Link>
          <Link
            href="/admin/blogs/new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 h-10 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-slate-500 font-medium">Loading blogs...</span>
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No Blog Posts Found"
          description="Write educational guides, customer success stories, and announcements to boost your Google rankings."
          actionLabel="Create First Blog Post"
          onAction={() => router.push("/admin/blogs/new")}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <DataTable
            columns={columns}
            data={blogs}
            globalSearch
            searchPlaceholder="Search blogs..."
            filterContent={filterContent}
          />
        </motion.div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description="Are you absolutely sure you want to delete this blog post? This action is permanent and will delete the associated featured image from Cloudinary."
      />
    </div>
  );
}
