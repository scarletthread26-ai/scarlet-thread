"use client";

import React, { useState } from "react";
import { 
  useAdminUsers, 
  useCreateAdmin, 
  useUpdateAdmin, 
  useDeleteAdmin, 
  AdminUser 
} from "@/hooks/use-admins";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Users, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  AlertCircle,
  ShieldCheck,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { data: admins = [], isLoading } = useAdminUsers();
  
  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin();
  const deleteMutation = useDeleteAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAdminRole, setIsAdminRole] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setIsAdminRole(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        email,
        password,
        full_name: fullName,
        role: isAdminRole ? "admin" : "manager",
        permissions: isAdminRole ? ["all"] : ["cms", "catalog"]
      });
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to create administrator");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (admin: AdminUser) => {
    await updateMutation.mutateAsync({
      id: admin.id,
      is_active: !admin.is_active
    });
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "full_name",
      header: "Administrator Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center font-bold text-xs shrink-0">
            {row.original.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {row.original.full_name}
            </div>
            <div className="text-xs text-slate-400">
              {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "System Role",
      cell: ({ row }) => {
        const isAdmin = row.original.role === "admin" || row.original.permissions.includes("all");
        return (
          <div className="flex items-center gap-1.5 text-xs">
            {isAdmin ? (
              <ShieldAlert className="w-4 h-4 text-purple-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-bold text-slate-700 dark:text-slate-350 capitalize">
              {isAdmin ? "Super Admin" : "Content Manager"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Access Granted",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {format(new Date(row.original.created_at), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <button 
            onClick={() => toggleStatus(item)}
            className="focus:outline-none"
            title="Click to toggle status"
          >
            <Badge 
              variant={item.is_active ? "default" : "secondary"}
              className={cn(
                "rounded-full cursor-pointer hover:opacity-85 transition px-2.5 py-0.5 font-bold",
                item.is_active 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100" 
                  : "bg-slate-100 text-slate-650 dark:bg-slate-850 dark:text-slate-400"
              )}
            >
              {item.is_active ? "Active" : "Blocked"}
            </Badge>
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        // Don't let users delete their own account or default mock super-admin locally
        if (item.email === "admin@scarletthread.com") {
          return <span className="text-xs text-slate-400 italic">Protected</span>;
        }

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(item.id)}
            className="w-8 h-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            title="Revoke Access"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-655" />
            Admin Administrators
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Grant dashboard permissions and revoke staff privileges.
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition-all hover:translate-y-[-1px]"
        >
          <Plus className="w-4.5 h-4.5" />
          Add administrator
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-purple-100 dark:border-purple-950 shadow-md rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Create Admin Account
            </CardTitle>
            <CardDescription className="text-xs">
              Credentials will receive authentication invites. Permissions map to selected roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="admName" className="font-bold text-slate-700 dark:text-slate-300">Staff Full Name *</Label>
                  <Input
                    id="admName"
                    placeholder="e.g. Fatima Ali"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admEmail" className="font-bold text-slate-700 dark:text-slate-300">Email Address *</Label>
                  <Input
                    id="admEmail"
                    type="email"
                    placeholder="e.g. fatima@scarletthread.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admPass" className="font-bold text-slate-700 dark:text-slate-300">Password *</Label>
                  <Input
                    id="admPass"
                    type="password"
                    placeholder="Secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={isAdminRole}
                  onChange={(e) => setIsAdminRole(e.target.checked)}
                  className="rounded border-slate-350 text-purple-650 focus:ring-purple-500 w-4 h-4"
                />
                <Label htmlFor="isAdmin" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Grant Full Super Administrator privileges (`all` permissions)
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsFormOpen(false); resetForm(); }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold px-6 shadow-md"
                >
                  Create administrator
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No staff members found</h3>
          <p className="text-slate-400 text-xs mt-1">There are no administrators registered in database.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          searchKey="full_name"
          searchPlaceholder="Search administrators by name..."
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Administrator Access"
        description="Are you sure you want to delete this administrator account? They will lose all dashboard privileges immediately."
      />
    </div>
  );
}
