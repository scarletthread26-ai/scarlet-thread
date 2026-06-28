"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  media_url: z.string().min(1, "Please upload an image"),
  media_type: z.enum(["image", "video"]).default("image"),
  is_active: z.boolean().default(true),
  display_order: z.number().default(0),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function GalleryPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: items = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery items");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: GalleryFormValues) => {
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
    mutationFn: async ({ id, data }: { id: string; data: GalleryFormValues }) => {
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
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Gallery item removed successfully!");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      media_url: "",
      media_type: "image",
      is_active: true,
      display_order: 0,
    },
  });

  const mediaUrl = watch("media_url");

  const onSubmit = async (values: GalleryFormValues) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(values);
    }
    reset();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    reset({
      title: item.title,
      description: item.description || "",
      media_url: item.media_url,
      media_type: item.media_type || "image",
      is_active: item.is_active,
      display_order: item.display_order || 0,
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Showcase Gallery Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage lookbook embroidery showcase files.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-855 pb-3">
            <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Item Title
              </label>
              <input
                {...register("title")}
                placeholder="e.g., Baby Towel Embroidery Showcase"
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-205 text-sm shadow-sm"
              />
              {errors.title && (
                <span className="text-xs text-red-505 block mt-0.5">{errors.title.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Short detail of custom embroidery work..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-205 text-sm shadow-sm resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Display order
              </label>
              <input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-250 text-sm shadow-sm"
              />
            </div>

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
                <span className="text-xs text-red-505 block mt-0.5">{errors.media_url.message}</span>
              )}
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="w-4 h-4 rounded border-slate-305 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Visible in storefront gallery
              </label>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition duration-250 text-sm shadow-md shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                disabled={createMutation.isPending || updateMutation.isPending}
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

        {/* Right Side Directory Grid */}
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
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                          {item.title}
                        </h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.is_active ? "bg-emerald-500" : "bg-slate-350 dark:bg-slate-650"
                          }`}
                          title={item.is_active ? "Active" : "Inactive"}
                        />
                      </div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
                        Order: {item.display_order}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-normal">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="absolute right-3.5 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/70 p-1 rounded-xl border border-slate-850">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-slate-200 hover:text-white rounded-lg transition cursor-pointer"
                      title="Edit Gallery"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-slate-200 hover:text-rose-455 rounded-lg transition cursor-pointer"
                      title="Delete Gallery"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="font-semibold text-sm">No items in lookbook gallery yet</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        isDestructive={true}
        title="Remove Gallery Item"
        description="Are you sure you want to remove this lookbook gallery item from the storefront showcase?"
      />
    </div>
  );
}
