"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/use-products";
import { useProductReviews, useDeleteReview, useUpdateReviewReply } from "@/hooks/use-reviews";
import { ProductForm, ProductFormValues } from "../product-form";
import { Loader2, MessageSquare, Star, Trash2, Reply } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: product, isLoading: isProductLoading } = useProduct(id);
  const updateMutation = useUpdateProduct();

  // Reviews hook integration
  const { data: reviews = [], isLoading: isReviewsLoading } = useProductReviews(id);
  const deleteReviewMutation = useDeleteReview();
  const replyReviewMutation = useUpdateReviewReply();

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, data: values });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyTexts[reviewId];
    if (!text || !text.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      await replyReviewMutation.mutateAsync({ id: reviewId, admin_reply: text.trim() });
      setActiveReplyId(null);
      setReplyTexts(prev => ({ ...prev, [reviewId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
    } catch (err) {
      console.error(err);
    }
  };

  if (isProductLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading product parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <ProductForm
        title="Edit Product details"
        initialValues={product}
        onSubmit={onSubmit}
        isLoading={updateMutation.isPending}
      />

      {/* Reviews Management Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Product Reviews & Feedback ({reviews.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage customer feedback, reply to comments, or remove reviews for this product.
          </p>
        </div>

        {isReviewsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No reviews found for this product.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="pt-6 first:pt-0 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {(review.users?.full_name || "Customer").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                        {review.users?.full_name || "Anonymous Customer"}
                        <div className="flex text-amber-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Submitted on {format(new Date(review.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pl-11 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 p-3 rounded-xl">
                    {review.comment}
                  </p>

                  {/* Existing Reply */}
                  {review.admin_reply ? (
                    <div className="bg-purple-50/50 dark:bg-purple-950/10 border-l-2 border-purple-500 rounded-r-xl p-3.5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          Your Response
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyId(review.id);
                            setReplyTexts(prev => ({ ...prev, [review.id]: review.admin_reply }));
                          }}
                          className="text-[10px] text-purple-650 hover:underline cursor-pointer font-bold"
                        >
                          Edit Reply
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {review.admin_reply}
                      </p>
                    </div>
                  ) : (
                    activeReplyId !== review.id && (
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(review.id)}
                        className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0"
                      >
                        <Reply className="w-3.5 h-3.5" /> Reply to this review
                      </button>
                    )
                  )}

                  {/* Add/Edit Reply Input Form */}
                  {activeReplyId === review.id && (
                    <div className="space-y-2 max-w-xl">
                      <textarea
                        rows={3}
                        placeholder="Write your professional response to this customer review..."
                        value={replyTexts[review.id] || ""}
                        onChange={(e) => setReplyTexts(prev => ({ ...prev, [review.id]: e.target.value }))}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none text-slate-850 dark:text-slate-150 focus:border-purple-550"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(review.id)}
                          disabled={replyReviewMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-3 rounded-lg text-[11px] cursor-pointer disabled:opacity-50"
                        >
                          Submit Response
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="border border-slate-250 dark:border-slate-850 text-slate-600 dark:text-slate-400 font-semibold py-1.5 px-3 rounded-lg text-[11px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 bg-transparent"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
