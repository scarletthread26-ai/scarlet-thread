"use client";

import React, { useState } from "react";
import { 
  useAdminCoupons, 
  useCreateCoupon, 
  useUpdateCoupon, 
  useDeleteCoupon, 
  Coupon 
} from "@/hooks/use-coupons";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  AlertCircle, 
  Check, 
  X,
  RefreshCw 
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

export default function AdminCouponsPage() {
  const { data: coupons = [], isLoading } = useAdminCoupons();
  
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed_amount" | "free_shipping">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinPurchaseAmount("");
    setStartsAt("");
    setExpiresAt("");
    setUsageLimit("");
    setIsActive(true);
    setEditingCoupon(null);
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || "");
    setDiscountType(coupon.discount_type);
    setDiscountValue(coupon.discount_value.toString());
    setMinPurchaseAmount(coupon.min_purchase_amount.toString());
    setStartsAt(coupon.starts_at ? new Date(coupon.starts_at).toISOString().split("T")[0] : "");
    setExpiresAt(coupon.expires_at ? new Date(coupon.expires_at).toISOString().split("T")[0] : "");
    setUsageLimit(coupon.usage_limit ? coupon.usage_limit.toString() : "");
    setIsActive(coupon.is_active);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }

    const payload: any = {
      code,
      description: description || null,
      discount_type: discountType,
      discount_value: discountType === "free_shipping" ? 0 : Number(discountValue) || 0,
      min_purchase_amount: Number(minPurchaseAmount) || 0,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      usage_limit: usageLimit ? Number(usageLimit) : null,
      is_active: isActive
    };

    try {
      if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save coupon");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    await updateMutation.mutateAsync({
      id: coupon.id,
      is_active: !coupon.is_active
    });
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "code",
      header: "Coupon Code",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100 bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded text-sm tracking-wider uppercase border border-purple-100 dark:border-purple-900/50">
            {row.original.code}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "discount_value",
      header: "Discount",
      cell: ({ row }) => {
        const item = row.original;
        if (item.discount_type === "percentage") {
          return <span className="font-bold text-slate-800 dark:text-slate-200">{item.discount_value}% Off</span>;
        } else if (item.discount_type === "fixed_amount") {
          return <span className="font-bold text-slate-800 dark:text-slate-200">{item.discount_value} AED Off</span>;
        }
        return <span className="font-bold text-emerald-600">Free Shipping</span>;
      },
    },
    {
      accessorKey: "min_purchase_amount",
      header: "Min Spend",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {row.original.min_purchase_amount} AED
        </span>
      ),
    },
    {
      accessorKey: "usage_count",
      header: "Redemptions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{item.usage_count}</span>
            {item.usage_limit && (
              <span className="text-slate-400"> / {item.usage_limit} limit</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "expires_at",
      header: "Validity",
      cell: ({ row }) => {
        const item = row.original;
        if (!item.expires_at) return <span className="text-xs text-slate-400">Lifetime</span>;
        
        const isExpired = new Date(item.expires_at) < new Date();
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className={isExpired ? "text-rose-500 font-bold" : ""}>
              {format(new Date(item.expires_at), "dd MMM yyyy")}
              {isExpired && " (Expired)"}
            </span>
          </div>
        );
      },
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
                "rounded-full cursor-pointer hover:opacity-80 transition px-2.5 py-0.5 font-bold",
                item.is_active 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100" 
                  : "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {item.is_active ? "Active" : "Inactive"}
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
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick(item)}
              className="w-8 h-8 text-slate-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(item.id)}
              className="w-8 h-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-7 h-7 text-purple-600" />
            Coupon Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create discount coupon codes, configure limits, and track usage rates.
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition-all hover:translate-y-[-1px]"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Coupon
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-purple-100 dark:border-purple-950 shadow-md rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
            </CardTitle>
            <CardDescription className="text-xs">
              Configure parameters to deploy promotional codes. All values default to AED currency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="code" className="font-bold text-slate-700 dark:text-slate-300">Promo Code *</Label>
                  <Input
                    id="code"
                    placeholder="e.g. SUMMER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="rounded-xl border-slate-200 dark:border-slate-800 uppercase font-mono tracking-wider"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="description" className="font-bold text-slate-700 dark:text-slate-300">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g. 10% discount on orders above 150 AED"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="discountType" className="font-bold text-slate-700 dark:text-slate-300">Discount Type</Label>
                  <select
                    id="discountType"
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed_amount">Fixed Amount (AED)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                {discountType !== "free_shipping" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="discountValue" className="font-bold text-slate-700 dark:text-slate-300">
                      Discount Value ({discountType === "percentage" ? "%" : "AED"}) *
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="e.g. 10"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="minPurchase" className="font-bold text-slate-700 dark:text-slate-300">Min Purchase Requirement (AED)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    placeholder="e.g. 100"
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="startsAt" className="font-bold text-slate-700 dark:text-slate-300">Starts At</Label>
                  <Input
                    id="startsAt"
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="expiresAt" className="font-bold text-slate-700 dark:text-slate-300">Expires At</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="usageLimit" className="font-bold text-slate-700 dark:text-slate-300">Usage Limit (Redemptions)</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="e.g. 50"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <Label htmlFor="isActive" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Activate this coupon immediately
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold px-6 shadow-md"
                >
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
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
      ) : coupons.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No coupons active</h3>
          <p className="text-slate-400 text-xs mt-1">
            Click the "Add Coupon" button above to deploy your first promo code.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={coupons}
          searchKey="code"
          searchPlaceholder="Search coupons by code..."
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        description="Are you sure you want to delete this promotional coupon code? It will no longer be valid for customers during checkout."
      />
    </div>
  );
}
