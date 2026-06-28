import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ShippingZone {
  id: string;
  name: string;
  country: string;
  rate: number;
  free_shipping_threshold: number | null;
  estimated_delivery: string;
  is_active: boolean;
  created_at: string;
}

export interface ShippingCalculation {
  rate: number;
  estimated_delivery: string;
  free_shipping_threshold: number | null;
  zone_name: string;
}

// Fetch shipping zones for Admin
export function useAdminShippingZones() {
  return useQuery<ShippingZone[]>({
    queryKey: ["admin", "shipping", "zones"],
    queryFn: async () => {
      const res = await fetch("/api/admin/shipping");
      if (!res.ok) throw new Error("Failed to fetch shipping zones");
      return res.json();
    },
  });
}

// Create new zone
export function useCreateShippingZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneData: Omit<ShippingZone, "id" | "created_at">) => {
      const res = await fetch("/api/admin/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create shipping zone");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Shipping zone created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "shipping"] });
    },
  });
}

// Update zone
export function useUpdateShippingZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (zoneData: Partial<ShippingZone> & { id: string }) => {
      const res = await fetch("/api/admin/shipping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update shipping zone");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Shipping zone updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "shipping"] });
    },
  });
}

// Delete zone
export function useDeleteShippingZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/shipping?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete shipping zone");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Shipping zone deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "shipping"] });
    },
  });
}

// Public: Calculate shipping based on subtotal & locations
export function useCalculateShipping(subtotal: number, state?: string, country?: string) {
  return useQuery<ShippingCalculation>({
    queryKey: ["shipping", "calculate", subtotal, state, country],
    queryFn: async () => {
      const params = new URLSearchParams({
        subtotal: subtotal.toString(),
        country: country || "United Arab Emirates",
        state: state || "",
      });
      const res = await fetch(`/api/shipping?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to calculate shipping rates");
      return res.json();
    },
    enabled: subtotal >= 0,
  });
}
