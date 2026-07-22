"use client";

import React, { useEffect, useState } from "react";
import { FolderTree, Edit, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blog-categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load blog categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading(editingId ? "Updating category..." : "Creating category...");

    try {
      const url = editingId ? `/api/admin/blog-categories/${editingId}` : "/api/admin/blog-categories";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(editingId ? "Category updated!" : "Category created!", { id: toastId });
      setName("");
      setSlug("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to save category.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting category...");
    try {
      const res = await fetch(`/api/admin/blog-categories/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted!", { id: toastId });
        setCategories(categories.filter((c) => c.id !== deleteId));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Failed to delete category.", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blogs"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
            <FolderTree className="w-6 h-6 text-purple-650" />
            Blog Category Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, and organize categories to structure your articles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Editor Form Box */}
        <div className="md:col-span-1">
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Name</label>
                <input
                  required
                  placeholder="e.g., Gift Ideas"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-800 dark:text-slate-100 outline-none text-xs shadow-inner transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 font-mono">Slug (URL)</label>
                <input
                  required
                  placeholder="e.g., gift-ideas"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3 text-slate-850 dark:text-slate-300 font-mono text-xs outline-none shadow-inner transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 cursor-pointer flex items-center justify-center transition active:scale-[0.98] disabled:opacity-50 shadow-xs border border-transparent"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs h-9 cursor-pointer flex items-center justify-center transition active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories Grid List */}
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-xs flex flex-col items-center justify-center min-h-[200px] space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs text-slate-550 font-medium">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-xs text-center py-12 text-slate-400">
              No categories created yet. Add one on the left.
            </div>
          ) : (
            <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4 font-mono">Slug</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr
                        key={c.id}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/30 dark:hover:bg-slate-950/5 transition",
                          editingId === c.id && "bg-purple-50/20 dark:bg-purple-950/10"
                        )}
                      >
                        <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-205">
                          {c.name}
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500">
                          {c.slug}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-1.5 rounded-lg border border-slate-250/50 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(c.id)}
                              className="p-1.5 rounded-lg border border-slate-250/50 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/20 text-slate-400 transition cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? Any blog articles associated with it will remain, but will be marked as 'Uncategorized'."
      />
    </div>
  );
}
