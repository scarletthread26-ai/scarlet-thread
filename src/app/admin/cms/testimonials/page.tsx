"use client";

import React, { useEffect, useState } from "react";
import { 
  useTestimonials, 
  useCreateTestimonial, 
  useUpdateTestimonial, 
  useDeleteTestimonial,
  useHomepageSection,
  useSaveHomepageSection
} from "@/hooks/use-cms";
import { MessageSquare, Plus, Edit, Trash2, Star, Check, X, Loader2, Save, Settings, Heart } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role description must be at least 2 characters"),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  avatar_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function TestimonialsPage({ isTabbed = false }: { isTabbed?: boolean }) {
  // 1. Google places integration settings
  const { data: gSection, isLoading: isLoadingGSettings } = useHomepageSection("google-reviews");
  const saveGSettingsMutation = useSaveHomepageSection();

  const [placeId, setPlaceId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (gSection) {
      setPlaceId(gSection.content?.place_id || "");
      setApiKey(gSection.content?.api_key || "");
      setIsActive(gSection.is_active !== false);
    }
  }, [gSection]);

  const handleSaveGSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveGSettingsMutation.mutateAsync({
      section_key: "google-reviews",
      title: "Google Business Reviews",
      subtitle: "Real stories from real customers",
      content: {
        place_id: placeId,
        api_key: apiKey
      },
      is_active: isActive
    });
  };

  // 2. Manual reviews management
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
      role: "Verified Google Review",
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
      role: testi.role || "Verified Google Review",
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
      {!isTabbed && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Google Customer Reviews Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure Place details and local fallback reviews to display on the storefront.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: API Settings & Create form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Google places config */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-650" />
              API Settings
            </h3>
            
            <form onSubmit={handleSaveGSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Google Place ID
                </label>
                <input
                  type="text"
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                  placeholder="e.g., ChIJu..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Google Maps API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="google-reviews-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="google-reviews-active" className="text-xs font-bold text-slate-550 dark:text-slate-350 cursor-pointer select-none">
                  Display reviews section on home page
                </label>
              </div>

              <button
                type="submit"
                disabled={saveGSettingsMutation.isPending}
                className="w-full bg-purple-650 hover:bg-purple-700 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl transition duration-155 text-xs shadow-md shadow-purple-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {saveGSettingsMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save API settings</span>
              </button>
            </form>
          </div>

          {/* Add/Edit form */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-650" />
              {editingId ? "Edit Google Review" : "Add Local Google Review"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Reviewer Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                  placeholder="e.g., Fatima Al-Mansoori"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Role / Tagline
                </label>
                <input
                  type="text"
                  {...register("role")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                  placeholder="Verified Google Review"
                />
                {errors.role && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.role.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Google Star Rating
                </label>
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="text-slate-350 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= currentRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-250 dark:text-slate-800"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Review Details (Comment)
                </label>
                <textarea
                  rows={4}
                  {...register("comment")}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 dark:text-slate-200 transition"
                  placeholder="Write the comment detail here..."
                />
                {errors.comment && (
                  <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.comment.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Avatar / Profile Photo
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

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="testimonial-active"
                  {...register("is_active")}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="testimonial-active" className="text-xs font-bold text-slate-550 dark:text-slate-350 cursor-pointer select-none">
                  Approve and publish this review
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-purple-650 hover:bg-purple-700 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl transition duration-155 text-xs shadow-md shadow-purple-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                      reset();
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

        {/* Right Column: List of reviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/85 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Manual Fallback Google Reviews
                </h2>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">
                  These reviews will display alongside live Google reviews or when live API data is not set.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-900/30">
                {testimonials.length} reviews
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-purple-650 animate-spin" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-805 rounded-xl space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-350 mx-auto" />
                <p className="text-xs text-slate-500 font-bold">No local fallback reviews created</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testimonials.map((testi: any) => (
                  <div
                    key={testi.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/20 dark:border-slate-850/60 flex gap-4 items-start group relative"
                  >
                    {/* Review profile */}
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-purple-50 flex items-center justify-center font-bold text-purple-650 shrink-0">
                      {testi.avatar_url ? (
                        <img src={testi.avatar_url} alt={testi.name} className="w-full h-full object-cover" />
                      ) : (
                        testi.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Review Details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            {testi.name}
                            {!testi.is_active && (
                              <span className="text-[9px] font-semibold text-rose-500 px-1.5 py-0.5 bg-rose-50 dark:bg-rose-955 rounded-full border border-rose-100">
                                Inactive
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-450">{testi.role || "Verified Google Review"}</span>
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (testi.rating || 5)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200 dark:text-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed italic pr-12">
                        &quot;{testi.comment}&quot;
                      </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute right-4 bottom-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => handleEdit(testi)}
                        className="p-1.5 text-slate-500 hover:text-purple-650 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-805 rounded-lg transition cursor-pointer"
                        title="Edit Review"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(testi.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-805 rounded-lg transition cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Google Review"
        description="Are you sure you want to permanently delete this Google review? This action cannot be undone."
      />
    </div>
  );
}
