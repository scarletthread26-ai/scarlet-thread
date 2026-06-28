import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ReviewWithUser {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  products?: { name: string };
  users?: { full_name: string | null };
}

// Fetch approved reviews for a product
export function useProductReviews(productId: string) {
  return useQuery<ReviewWithUser[]>({
    queryKey: ["reviews", "product", productId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product reviews");
      return res.json();
    },
    enabled: !!productId,
  });
}

// Submit a new review
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: {
      product_id: string;
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Review submitted! It will appear once approved by an administrator.");
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", data.product_id] });
    },
  });
}

// Admin query: list all reviews for moderation
export function useAdminReviews(status?: string) {
  return useQuery<ReviewWithUser[]>({
    queryKey: ["admin", "reviews", status],
    queryFn: async () => {
      const url = status && status !== "all" 
        ? `/api/admin/reviews?status=${status}` 
        : "/api/admin/reviews";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch admin reviews");
      return res.json();
    },
  });
}

// Admin mutation: update status (approve/reject)
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) => {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update review status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Review status updated to ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// Admin mutation: delete a review
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete review");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
