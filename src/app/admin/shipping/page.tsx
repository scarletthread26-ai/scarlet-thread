"use client";

import React, { useState } from "react";
import { 
  useAdminShippingZones, 
  useCreateShippingZone, 
  useUpdateShippingZone, 
  useDeleteShippingZone, 
  ShippingZone 
} from "@/hooks/use-shipping";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Truck, 
  Plus, 
  Trash2, 
  Edit2, 
  AlertCircle,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminShippingPage() {
  const { data: zones = [], isLoading } = useAdminShippingZones();
  
  const createMutation = useCreateShippingZone();
  const updateMutation = useUpdateShippingZone();
  const deleteMutation = useDeleteShippingZone();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United Arab Emirates");
  const [rate, setRate] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setCountry("United Arab Emirates");
    setRate("");
    setFreeShippingThreshold("");
    setEstimatedDelivery("");
    setIsActive(true);
    setEditingZone(null);
  };

  const handleEditClick = (zone: ShippingZone) => {
    setEditingZone(zone);
    setName(zone.name);
    setCountry(zone.country);
    setRate(zone.rate.toString());
    setFreeShippingThreshold(zone.free_shipping_threshold ? zone.free_shipping_threshold.toString() : "");
    setEstimatedDelivery(zone.estimated_delivery);
    setIsActive(zone.is_active);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !country || rate === "") {
      toast.error("Name, Country, and Rate are required fields");
      return;
    }

    const payload: any = {
      name,
      country,
      rate: Number(rate),
      free_shipping_threshold: freeShippingThreshold ? Number(freeShippingThreshold) : null,
      estimated_delivery: estimatedDelivery || "3-5 Business Days",
      is_active: isActive
    };

    try {
      if (editingZone) {
        await updateMutation.mutateAsync({ id: editingZone.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save shipping zone");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = async (zone: ShippingZone) => {
    await updateMutation.mutateAsync({
      id: zone.id,
      is_active: !zone.is_active
    });
  };

  const columns: ColumnDef<ShippingZone>[] = [
    {
      accessorKey: "name",
      header: "Zone Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-650 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.original.country}
        </span>
      ),
    },
    {
      accessorKey: "rate",
      header: "Shipping Rate",
      cell: ({ row }) => (
        <span className="font-extrabold text-slate-800 dark:text-slate-105">
          {row.original.rate === 0 ? "Free" : `${row.original.rate} AED`}
        </span>
      ),
    },
    {
      accessorKey: "free_shipping_threshold",
      header: "Free Above",
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">
          {row.original.free_shipping_threshold 
            ? `${row.original.free_shipping_threshold} AED` 
            : "No Free Threshold"}
        </span>
      ),
    },
    {
      accessorKey: "estimated_delivery",
      header: "Est. Transit Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{row.original.estimated_delivery}</span>
        </div>
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
              className="w-8 h-8 text-slate-600 hover:text-purple-605 hover:bg-purple-50 dark:hover:bg-purple-950/20"
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
            <Truck className="w-7 h-7 text-purple-650" />
            Shipping Configurations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Set default shipping rates in AED, define free shipping limits, and estimate delivery dates per region.
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsFormOpen(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition-all hover:translate-y-[-1px]"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Shipping Zone
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-purple-100 dark:border-purple-950 shadow-md rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {editingZone ? `Edit Shipping Zone: ${editingZone.name}` : "Create New Shipping Zone"}
            </CardTitle>
            <CardDescription className="text-xs">
              Define target delivery areas and billing values in AED.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-bold text-slate-700 dark:text-slate-300">Zone Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Dubai & Abu Dhabi, GCC Express"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="font-bold text-slate-700 dark:text-slate-300">Country *</Label>
                  <Input
                    id="country"
                    placeholder="e.g. United Arab Emirates"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="delivery" className="font-bold text-slate-700 dark:text-slate-300">Transit Duration / Description</Label>
                  <Input
                    id="delivery"
                    placeholder="e.g. 1-2 Business Days"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="rate" className="font-bold text-slate-700 dark:text-slate-300">Default Shipping Rate (AED) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="e.g. 15"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="threshold" className="font-bold text-slate-700 dark:text-slate-300">Free Shipping Threshold (AED)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="e.g. 150"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-slate-350 text-purple-650 focus:ring-purple-500 w-4 h-4"
                />
                <Label htmlFor="isActive" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Activate this shipping route immediately
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
                  {editingZone ? "Save Changes" : "Create Zone"}
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
      ) : zones.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No shipping zones configured</h3>
          <p className="text-slate-400 text-xs mt-1">
            Click the "Add Shipping Zone" button above to configure your first rate logic.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={zones}
          searchKey="name"
          searchPlaceholder="Search shipping zones by name..."
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Shipping Zone"
        description="Are you sure you want to delete this shipping zone configuration? Regional delivery calculations at checkout will revert to standard defaults."
      />
    </div>
  );
}
