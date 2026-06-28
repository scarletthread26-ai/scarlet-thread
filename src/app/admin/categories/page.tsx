"use client";

import React, { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { FolderTree, Plus, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { SubcategoryManager } from "./subcategory-manager";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
    },
  });

  const imageUrl = watch("image_url");

  const onSubmit = async (values: CategoryFormValues) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(values);
    }
    reset();
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active,
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    // Auto-generate slug
    if (!editingId) {
      setValue(
        "slug",
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your store product departments and classification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Add / Edit Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <FolderTree className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category Name
              </label>
              <input
                {...register("name")}
                onChange={handleNameChange}
                placeholder="e.g., Gifts For Her"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
              />
              {errors.name && (
                <span className="text-xs text-red-500 block mt-0.5">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Slug (URL Identifier)
              </label>
              <input
                {...register("slug")}
                placeholder="e.g., gifts-for-her"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm"
              />
              {errors.slug && (
                <span className="text-xs text-red-500 block mt-0.5">{errors.slug.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Category details..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm shadow-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Banner / Thumbnail Image
              </label>
              <ImageUpload
                bucket="categories"
                value={imageUrl ? [imageUrl] : []}
                onChange={(urls) => setValue("image_url", urls[0] || "")}
                onRemove={() => setValue("image_url", "")}
                maxFiles={1}
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Visible in storefront catalog
              </label>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition duration-200 text-sm shadow-md shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{editingId ? "Update Category" : "Add Category"}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    reset();
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Right side: Categories Grid / Table */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category: any) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col relative group"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                          {category.name}
                        </h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            category.is_active ? "bg-emerald-500" : "bg-slate-350 dark:bg-slate-650"
                          }`}
                          title={category.is_active ? "Active" : "Inactive"}
                        />
                      </div>
                      <p className="text-slate-450 dark:text-slate-500 text-[10px] font-mono mt-0.5">
                        /{category.slug}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-450 truncate mt-1">
                        {category.description || "No description set"}
                      </p>
                    </div>
                  </div>

                  {/* Absolute positioning of control buttons on hover */}
                  <div className="absolute right-3.5 top-6 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(category.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
                  
                  {/* Subcategories Inline Manager */}
                  <div className="mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <SubcategoryManager categoryId={category.id} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <p className="font-medium">No departments or categories yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action will permanently remove it from the database."
      />
    </div>
  );
}
