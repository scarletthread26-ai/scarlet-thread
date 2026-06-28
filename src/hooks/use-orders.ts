import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderWithItems } from "@/types";
import { toast } from "sonner";

// Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }
      return res.json(); // returns created order
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

// Track guest order query
export function useTrackOrder(orderNumber: string, contactInfo: string) {
  return useQuery<OrderWithItems>({
    queryKey: ["orders", "track", orderNumber, contactInfo],
    queryFn: async () => {
      const params = new URLSearchParams({
        number: orderNumber,
        contact: contactInfo,
      });
      const res = await fetch(`/api/orders/track?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order not found");
      }
      return res.json();
    },
    enabled: !!orderNumber && !!contactInfo,
    retry: false,
  });
}

// Retrieve single order details (for customer/admin)
export function useOrderDetails(orderId: string) {
  return useQuery<OrderWithItems>({
    queryKey: ["orders", "detail", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order details");
      return res.json();
    },
    enabled: !!orderId,
  });
}

// List customer's own orders
export function useCustomerOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders", "customer-list"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load your orders");
      return res.json();
    },
  });
}

// List admin orders with filter capability
export function useAdminOrders(filters: { status?: string } = {}) {
  return useQuery<Order[]>({
    queryKey: ["admin", "orders", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.status && filters.status !== "all") {
        searchParams.append("status", filters.status);
      }
      const res = await fetch(`/api/admin/orders?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch admin orders");
      return res.json();
    },
  });
}

// Update order status/tracking mutation (for admins)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, tracking_number, carrier, estimated_delivery_date, notes }: {
      id: string;
      status?: string;
      tracking_number?: string;
      carrier?: string;
      estimated_delivery_date?: string;
      notes?: string;
    }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, tracking_number, carrier, estimated_delivery_date, notes }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update order status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail", data.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Order updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update order");
    },
  });
}
