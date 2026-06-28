"use client";

import React, { useState } from "react";
import { 
  useAdminReviews, 
  useUpdateReviewStatus, 
  useDeleteReview, 
  ReviewWithUser 
} from "@/hooks/use-reviews";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Star, Check, X, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { data: reviews = [], isLoading } = useAdminReviews(activeTab);
  
  const updateStatusMutation = useUpdateReviewStatus();
  const deleteMutation = useDeleteReview();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    await updateStatusMutation.mutateAsync({ id, status: "approved" });
  };

  const handleReject = async (id: string) => {
    await updateStatusMutation.mutateAsync({ id, status: "rejected" });
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<ReviewWithUser>[] = [
    {
      accessorKey: "products.name",
      header: "Product",
      cell: ({ row }) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {row.original.products?.name || "Unknown Product"}
        </div>
      ),
    },
    {
      accessorKey: "users.full_name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-700 dark:text-slate-300">
            {row.original.users?.full_name || "Guest / Customer"}
          </div>
          <div className="text-xs text-slate-400">
            ID: {row.original.user_id.substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < row.original.rating ? "fill-amber-500" : "text-slate-300 dark:text-slate-700"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: "Review Details",
      cell: ({ row }) => (
        <div className="max-w-md space-y-1 py-1">
          {row.original.title && (
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              "{row.original.title}"
            </div>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {row.original.comment || "No comment content provided."}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Submitted At",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {format(new Date(row.original.created_at), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" = "secondary";
        let customClass = "";
        
        if (status === "approved") {
          variant = "default";
          customClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-105";
        } else if (status === "rejected") {
          variant = "destructive";
        } else {
          // pending
          variant = "secondary";
          customClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50";
        }
        
        return (
          <Badge 
            variant={variant} 
            className={cn(
              "capitalize rounded-full font-bold px-2.5 py-0.5 text-[11px] tracking-wide",
              customClass
            )}
          >
            {status}
          </Badge>
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
            {item.status !== "approved" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleApprove(item.id)}
                disabled={updateStatusMutation.isPending}
                className="w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            {item.status !== "rejected" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleReject(item.id)}
                disabled={updateStatusMutation.isPending}
                className="w-8 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(item.id)}
              disabled={deleteMutation.isPending}
              className="w-8 h-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-purple-600" />
            Review Moderation
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage customer feedback and moderate store product reviews.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition duration-200 relative ${
              activeTab === tab
                ? "text-purple-600 dark:text-purple-400"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No reviews found</h3>
          <p className="text-slate-400 text-xs mt-1">
            There are no product reviews fitting this status category right now.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={reviews}
          searchKey="products.name"
          searchPlaceholder="Search reviews by product name..."
        />
      )}

      {/* Deletion confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        description="Are you sure you want to delete this product review? This action cannot be undone."
      />
    </div>
  );
}
