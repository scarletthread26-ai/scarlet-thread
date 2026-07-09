"use client";

import React, { useState } from "react";
import { 
  useTestimonials, 
  useCreateTestimonial, 
  useUpdateTestimonial, 
  useDeleteTestimonial
} from "@/hooks/use-cms";
import { MessageSquare, Plus, Edit, Trash2, Star, Check, X, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  avatar_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AdminReviewsPage() {
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
      role: "",
      rating: 5,
      comment: "",
      avatar_url: "",
      is_active: true,
    },
  });

  const avatarUrl = watch("avatar_url");
  const currentRating = watch("rating");

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: values });
        setEditingId(null);
      } else {
        await createMutation.mutateAsync(values);
      }
      reset({
        name: "",
        role: "",
        rating: 5,
        comment: "",
        avatar_url: "",
        is_active: true,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save review");
    }
  };

  const handleEdit = (testi: any) => {
    setEditingId(testi.id);
    reset({
      name: testi.name,
      role: testi.role || "",
      rating: testi.rating || 5,
      comment: testi.comment,
      avatar_url: testi.avatar_url || "",
      is_active: testi.is_active,
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMutation.mutateAsync(deleteId);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete review");
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Homepage Customer Reviews
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage customer feedback and WhatsApp experiences to display on the storefront Testimonials slider.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-805 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Plus className="w-4 h-4 text-purple-600" />
              {editingId ? "Edit Review" : "Add Customer Review"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-650 focus:border-purple-650 dark:text-slate-200 transition"
                  placeholder="e.g., Fatima Al-Mansoori"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Star Rating
                </label>
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="text-slate-300 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= currentRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-200 dark:text-slate-800"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Review Text
                </label>
                <textarea
                  rows={4}
                  {...register("comment")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-purple-650 focus:border-purple-650 dark:text-slate-200 transition"
                  placeholder="Share the customer's shopping experience..."
                />
                {errors.comment && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.comment.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Customer Image (Optional)
                </label>
                <div className="mt-1">
                  <ImageUpload
                    bucket="avatars"
                    value={avatarUrl ? [avatarUrl] : []}
                    onChange={(urls) => setValue("avatar_url", urls[0] || "")}
                    onRemove={() => setValue("avatar_url", "")}
                    maxFiles={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="review-active"
                  {...register("is_active")}
                  className="w-4 h-4 rounded border-slate-350 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="review-active" className="text-xs font-bold text-slate-500 dark:text-slate-450 cursor-pointer select-none">
                  Display review on homepage slider
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl transition duration-155 text-xs shadow-md shadow-purple-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingId ? "Update Review" : "Publish Review"}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      reset({
                        name: "",
                        role: "Verified Buyer",
                        rating: 5,
                        comment: "",
                        avatar_url: "",
                        is_active: true,
                      });
                    }}
                    className="p-2.5 border border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition cursor-pointer"
                    title="Cancel edit"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Active Reviews List */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-805 dark:text-slate-200 uppercase tracking-wider">
                  Active Reviews List
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reviews added manually that will show on the storefront.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-full border border-purple-100/50 dark:border-purple-900/30">
                {testimonials.length} reviews
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-250 dark:border-slate-805 rounded-2xl space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 font-bold">No manual reviews created yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {testimonials.map((testi: any) => (
                    <motion.div
                      key={testi.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/20 dark:border-slate-850/60 flex gap-4 items-start group relative"
                    >
                      {/* Reviewer Profile Avatar or Fallback Letter Initials */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-purple-50 flex items-center justify-center font-bold text-purple-650 shrink-0">
                        {testi.avatar_url ? (
                          <img src={testi.avatar_url} alt={testi.name} className="w-full h-full object-cover" />
                        ) : (
                          testi.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Review details */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                              {testi.name}
                              {!testi.is_active && (
                                <span className="text-[9px] font-semibold text-rose-500 px-1.5 py-0.5 bg-rose-50 dark:bg-rose-955 rounded-full border border-rose-100">
                                  Inactive
                                </span>
                              )}
                            </h4>
                            {testi.role && (
                              <span className="text-[10px] font-bold text-slate-400">{testi.role}</span>
                            )}
                          </div>

                          {/* Star rating rendering */}
                          <div className="flex gap-0.5 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (testi.rating || 5)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-200 dark:text-slate-800"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed italic pr-16 select-text">
                          &quot;{testi.comment}&quot;
                        </p>
                      </div>

                      {/* Actions: Edit / Delete on Hover */}
                      <div className="absolute right-4 bottom-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          type="button"
                          onClick={() => handleEdit(testi)}
                          className="p-1.5 text-slate-500 hover:text-purple-650 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-805 rounded-lg transition cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(testi.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-805 rounded-lg transition cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDestructive={true}
        title="Delete Customer Review"
        description="Are you absolutely sure you want to permanently delete this customer review? This action cannot be undone."
      />
    </div>
  );
}
