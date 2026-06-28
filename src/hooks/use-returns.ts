import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ReturnRequest {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  refund_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all return requests
export function useAdminReturns() {
  return useQuery<ReturnRequest[]>({
    queryKey: ["admin", "returns", "list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/returns");
      if (!res.ok) throw new Error("Failed to fetch returns");
      return res.json();
    },
  });
}

// Update return request status
export function useUpdateReturnStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      status: "pending" | "approved" | "rejected" | "completed";
      refund_amount?: number;
      notes?: string;
    }) => {
      const res = await fetch("/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update return request");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Return request status updated to ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "returns"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}
