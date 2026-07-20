"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Plus, Edit, Trash2, Loader2, Tag, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

const gallerySchema = z.object({
  media_url: z.string().min(1, "Please upload an image"),
  category_id: z.string().min(1, "Please select a category"),
  sub_category_id: z.string().optional(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────
  const { data: items = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery items");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: subcategories = [] } = useQuery<any[]>({
    queryKey: ["admin", "subcategories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/subcategories");
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
  });

  // ── Mutations ─────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Gallery item added successfully!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Gallery item updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Gallery item removed successfully!");
    },
  });

  // ── Form ──────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema) as any,
    defaultValues: { media_url: "", category_id: "" },
  });

  const mediaUrl = watch("media_url");
  const currentCategoryId = watch("category_id");
  const filteredSubcategories = subcategories.filter((sc: any) => sc.parent_id === currentCategoryId);

  const onSubmit = async (values: GalleryFormValues) => {
    const finalCategoryId = values.sub_category_id || values.category_id;
    const payload = {
      media_url: values.media_url,
      category_id: finalCategoryId,
      title: "Gallery Image",
      description: "",
      media_type: "image",
      is_active: true,
      display_order: 0,
    };
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(payload);
    }
    reset();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    const isSub = subcategories.find((s: any) => s.id === item.category_id);
    if (isSub) {
      reset({ media_url: item.media_url, category_id: isSub.parent_id, sub_category_id: item.category_id });
    } else {
      reset({ media_url: item.media_url, category_id: item.category_id || "", sub_category_id: "" });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Showcase Gallery Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage lookbook embroidery showcase files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="space-y-4">

          {/* Add / Edit Gallery Item */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="font-bold text-slate-800 dark:text-slate-200">
                {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </label>
                  <select
                    {...register("category_id")}
                    onChange={(e) => {
                      setValue("category_id", e.target.value);
                      setValue("sub_category_id", ""); // Reset subcategory when category changes
                    }}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 outline-none transition text-sm shadow-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <span className="text-xs text-red-500 block mt-0.5">{errors.category_id.message}</span>
                  )}
                </div>

                {/* Subcategory select */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subcategory
                  </label>
                  <select
                    {...register("sub_category_id")}
                    disabled={!currentCategoryId}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 outline-none transition text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{currentCategoryId ? "None" : "Select Category First"}</option>
                    {filteredSubcategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Gallery Image File
                </label>
                <ImageUpload
                  bucket="cms"
                  value={mediaUrl ? [mediaUrl] : []}
                  onChange={(urls) => setValue("media_url", urls[0] || "")}
                  onRemove={() => setValue("media_url", "")}
                  maxFiles={1}
                />
                {errors.media_url && (
                  <span className="text-xs text-red-500 block mt-0.5">{errors.media_url.message}</span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2 rounded-xl transition text-sm shadow-md shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{editingId ? "Update Gallery" : "Add Gallery Item"}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); reset(); }}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl transition text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* ── Right Column: Image Grid ── */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group relative"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.media_url}
                      alt="Gallery image"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3 flex justify-center">
                    {item.category && (
                      <span className="text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/70 p-1 rounded-xl">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-slate-200 hover:text-white rounded-lg transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-slate-200 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[200px]">
              <p className="font-semibold text-sm">No items in lookbook gallery yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm: delete gallery item */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Remove Gallery Item"
        description="Are you sure you want to remove this gallery item from the storefront showcase?"
      />
    </div>
  );
}
