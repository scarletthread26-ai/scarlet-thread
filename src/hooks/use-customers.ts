import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, Order, Address } from "@/types";
import { toast } from "sonner";

export interface CustomerStats extends UserProfile {
  orders_count: number;
  total_spent: number;
  is_blocked?: boolean; // added for administration toggle
}

export interface CustomerDetails extends UserProfile {
  is_blocked: boolean;
  orders: Order[];
  addresses: Address[];
}

// Fetch all customers for admin
export function useAdminCustomers() {
  return useQuery<CustomerStats[]>({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to load customer list");
      return res.json();
    },
  });
}

// Fetch specific customer details
export function useCustomerDetails(customerId: string) {
  return useQuery<CustomerDetails>({
    queryKey: ["admin", "customers", customerId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      if (!res.ok) throw new Error("Failed to load customer details");
      return res.json();
    },
    enabled: !!customerId,
  });
}

// Toggle block customer
export function useToggleCustomerBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_blocked: isBlocked }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update customer status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "customers", data.id] });
      toast.success("Customer status updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to toggle status");
    },
  });
}
