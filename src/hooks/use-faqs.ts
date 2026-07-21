import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FAQ } from "@/types/database";
import { toast } from "sonner";

export function useFaqs(category?: string) {
  return useQuery<FAQ[]>({
    queryKey: ["faqs", category],
    queryFn: async () => {
      const url = category 
        ? `/api/admin/faqs?category=${encodeURIComponent(category)}`
        : "/api/admin/faqs";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch faqs");
      return res.json();
    },
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<FAQ>) => {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create faq");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create faq");
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FAQ> }) => {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update faq");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update faq");
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete faq");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete faq");
    },
  });
}
