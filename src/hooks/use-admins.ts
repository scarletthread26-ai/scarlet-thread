import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "manager" | string;
  is_active: boolean;
  permissions: string[];
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
  admin_name: string;
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "staff", "list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/admins");
      if (!res.ok) throw new Error("Failed to fetch administrators");
      return res.json();
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<AdminUser, "id" | "created_at" | "is_active"> & { password?: string }) => {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create administrator");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Administrator user created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<AdminUser> & { id: string }) => {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update administrator");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Administrator user updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/admins?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete administrator");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Administrator user deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useActivityLogs() {
  return useQuery<ActivityLog[]>({
    queryKey: ["admin", "activity-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/activity-logs");
      if (!res.ok) throw new Error("Failed to fetch activity logs");
      return res.json();
    },
  });
}
