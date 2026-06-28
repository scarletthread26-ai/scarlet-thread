"use client";

import React, { useState } from "react";
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/use-cms";
import { MessageSquare, Plus, Edit, Trash2, Star, Check, X, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role description must be at least 2 characters"),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  avatar_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      name: "",
      role: "Verified Buyer",
      rating: 5,
      comment: "",
      avatar_url: "",
      is_active: true,
    },
  });

  const avatarUrl = watch("avatar_url");
  const currentRating = watch("rating");

  const onSubmit = async (values: TestimonialFormValues) => {
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: values });
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(values);
    }
    reset();
  };

  const handleEdit = (testi: any) => {
    setEditingId(testi.id);
    reset({
      name: testi.name,
      role: testi.role || "Verified Buyer",
      rating: testi.rating || 5,
      comment: testi.comment,
      avatar_url: testi.avatar_url || "",
      is_active: testi.is_active,
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
            Customer Testimonials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish and manage client reviews showing on the store front pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-855 pb-3">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g., Fatima Al-Mansoori"
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-205 text-sm shadow-sm"
              />
              {errors.name && (
                <span className="text-xs text-red-505 block mt-0.5">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Role / Tagline
              </label>
              <input
                {...register("role")}
                placeholder="e.g., Verified Buyer"
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-205 text-sm shadow-sm"
              />
              {errors.role && (
                <span className="text-xs text-red-505 block mt-0.5">{errors.role.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Rating Stars
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    className="text-amber-400 hover:scale-110 transition cursor-pointer outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= currentRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer Comment
              </label>
              <textarea
                {...register("comment")}
                placeholder="Write the comment/testimonial details..."
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2 px-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-205 text-sm shadow-sm resize-none"
              />
              {errors.comment && (
                <span className="text-xs text-red-505 block mt-0.5">{errors.comment.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer Avatar Image
              </label>
              <ImageUpload
                bucket="cms"
                value={avatarUrl ? [avatarUrl] : []}
                onChange={(urls) => setValue("avatar_url", urls[0] || "")}
                onRemove={() => setValue("avatar_url", "")}
                maxFiles={1}
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="w-4 h-4 rounded border-slate-305 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Visible on homepage testimonial section
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
                <span>{editingId ? "Update Review" : "Add Testimonial"}</span>
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

        {/* Right Categories Grid */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="space-y-4">
              {testimonials.map((testi: any) => (
                <motion.div
                  key={testi.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 relative group flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testi.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={testi.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-12 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {testi.name}
                        </h3>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                          {testi.role || "Verified Buyer"}
                        </p>
                      </div>
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: testi.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-405" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed italic">
                      &ldquo;{testi.comment}&rdquo;
                    </p>
                  </div>

                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(testi)}
                      className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-lg transition cursor-pointer"
                      title="Edit Testimonial"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(testi.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="font-semibold text-sm">No client testimonials added yet</p>
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
        title="Delete Testimonial"
        description="Are you sure you want to delete this customer review testimonial? This will remove it from the home page."
      />
    </div>
  );
}
