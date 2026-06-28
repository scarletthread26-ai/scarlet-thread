"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Plus, AlertCircle, Sparkles } from "lucide-react";
import { useProductReviews, useSubmitReview } from "@/hooks/use-reviews";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProductDetailsReviewsSplitProps {
  product?: any;
}

export function ProductDetailsReviewsSplit({ product }: ProductDetailsReviewsSplitProps) {
  const productId = product?.id || "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4";
  
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const submitReviewMutation = useSubmitReview();
  
  const [user, setUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Review submission state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const specs = [
    { label: "Fabric", value: product?.material || "80% Cotton, 20% Polyester Premium Fleece" },
    { label: "Fit", value: product?.size ? `Unisex Regular Fit (Size ${product.size})` : "Unisex Regular Fit" },
    { label: "Embroidery Type", value: product?.is_personalized ? "Premium Personalization Handcrafted" : "Standard Embroidery" },
    { label: "Care Instructions", value: "Machine wash cold, inside out. Do not bleach. Tumble dry low." },
    { label: "Delivery Time", value: product?.production_time ? `${product.production_time + 3} - ${product.production_time + 5} Days Hand-delivery` : "5 - 7 Business Days" },
    { label: "Packaging", value: "Premium Scarlet Gift Box Wrapping" },
  ];

  useEffect(() => {
    const supabase = createClient();
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    loadUser();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please pick a star rating");
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        product_id: productId,
        rating,
        title: title || undefined,
        comment: comment || undefined
      });
      setTitle("");
      setComment("");
      setRating(5);
      setShowReviewForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    }
  };

  // Review calculations
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)) 
    : 5.0;

  // Star bars
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : stars === 5 ? 100 : 0;
    return { stars, percentage };
  });

  return (
    <section className="py-16 bg-slate-50/30 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Specs Panel */}
          <div className="flex-1 lg:w-1/3">
            <h3 className="font-heading font-extrabold text-xl mb-6 text-slate-800 dark:text-slate-100">Product Specifications</h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                    <div className="w-1/3 text-xs font-bold text-purple-600 shrink-0">{spec.label}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Reviews Panel */}
          <div className="flex-[1.5] lg:w-2/3 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5.5 h-5.5 text-purple-600" />
                Customer Reviews
              </h3>
              {user ? (
                <Button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-3 py-1.5 flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" /> Write a Review
                </Button>
              ) : (
                <span className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/30">
                  Log in to write a review
                </span>
              )}
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/50 rounded-2xl p-6 shadow-md transition-all">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Share your experience
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rating *</Label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          type="button"
                          key={stars}
                          onClick={() => setRating(stars)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              stars <= rating 
                                ? "fill-amber-400 text-amber-400 scale-105" 
                                : "text-slate-300 hover:text-amber-300"
                            } transition`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="revTitle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Headline / Summary</Label>
                    <Input
                      id="revTitle"
                      placeholder="e.g. Incredibly soft, custom embroidery is amazing!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="revComment" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Review Comments</Label>
                    <Textarea
                      id="revComment"
                      placeholder="Tell us what you liked or disliked about this personalized gift..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowReviewForm(false)} 
                      className="rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submitReviewMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-4"
                    >
                      Submit Review
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Ratings Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Score */}
                <div className="w-full md:w-1/3 flex flex-col justify-center items-center md:items-start md:border-r border-slate-100 dark:border-slate-800/80 md:pr-8">
                  <div className="text-6xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
                    {averageRating}
                  </div>
                  <div className="flex text-amber-500 my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating) ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Based on {totalReviewsCount || 5} feedback reviews
                  </span>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 space-y-2.5">
                  {distribution.map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="w-2.5">{bar.stars}</span>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${bar.percentage}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-slate-400">{bar.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-10 text-center shadow-sm">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No reviews yet</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Be the first to share your embroidery review for this item!
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 dark:border-slate-800/80 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center font-bold text-xs shrink-0">
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
                          <span className="text-[10px] text-slate-400">Verified Buyer</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {format(new Date(review.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
                        "{review.title}"
                      </h5>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
