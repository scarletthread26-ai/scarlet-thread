"use client";

import React, { useState } from "react";
import { 
  useAdminReturns, 
  useUpdateReturnStatus, 
  ReturnRequest 
} from "@/hooks/use-returns";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  RefreshCcw, 
  Check, 
  X, 
  AlertCircle,
  HelpCircle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReturnsPage() {
  const { data: returns = [], isLoading } = useAdminReturns();
  const updateStatusMutation = useUpdateReturnStatus();

  const [processingReturn, setProcessingReturn] = useState<ReturnRequest | null>(null);

  // Form states
  const [refundAmount, setRefundAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleUpdateStatus = async (status: "approved" | "rejected" | "completed") => {
    if (!processingReturn) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: processingReturn.id,
        status,
        refund_amount: refundAmount ? Number(refundAmount) : undefined,
        notes: notes || undefined
      });
      setProcessingReturn(null);
      setRefundAmount("");
      setNotes("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update return request");
    }
  };

  const handleQuickApprove = async (id: string, refund: number) => {
    await updateStatusMutation.mutateAsync({
      id,
      status: "approved",
      refund_amount: refund
    });
  };

  const handleQuickReject = async (id: string) => {
    await updateStatusMutation.mutateAsync({
      id,
      status: "rejected"
    });
  };

  const columns: ColumnDef<ReturnRequest>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {row.original.order_number}
        </span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <span className="font-medium text-slate-700 dark:text-slate-350">
          {row.original.customer_name}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Return Reason",
      cell: ({ row }) => (
        <p className="text-xs text-slate-650 dark:text-slate-400 max-w-sm line-clamp-2">
          {row.original.reason}
        </p>
      ),
    },
    {
      accessorKey: "refund_amount",
      header: "Refund Value",
      cell: ({ row }) => (
        <span className="font-extrabold text-slate-800 dark:text-slate-105">
          {row.original.refund_amount} AED
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Requested At",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {format(new Date(row.original.created_at), "dd MMM yyyy")}
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
        
        if (status === "completed") {
          variant = "default";
          customClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50";
        } else if (status === "approved") {
          variant = "default";
          customClass = "bg-purple-50 text-purple-700 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50";
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
        
        if (item.status === "completed" || item.status === "rejected") {
          return <span className="text-xs text-slate-400 font-medium">Archived</span>;
        }

        return (
          <div className="flex items-center gap-1">
            {item.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuickApprove(item.id, item.refund_amount)}
                  className="w-8 h-8 text-purple-650 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                  title="Quick Approve"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuickReject(item.id)}
                  className="w-8 h-8 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  title="Quick Reject"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setProcessingReturn(item);
                setRefundAmount(item.refund_amount.toString());
                setNotes(item.notes || "");
              }}
              className="border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-lg text-[10px] px-2 py-1 ml-1"
            >
              Update
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
            <RefreshCcw className="w-7 h-7 text-purple-650 animate-spin-slow" />
            Return Moderations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Process product refund requests, inspect customer remarks, and override refund details.
          </p>
        </div>
      </div>

      {processingReturn && (
        <Card className="border-purple-100 dark:border-purple-950 shadow-md rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Audit Return request: <span className="text-purple-600">{processingReturn.order_number}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Review refund details and execute status transitions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-xl text-xs space-y-2 max-w-2xl">
                <div><span className="font-bold text-slate-400 mr-2 uppercase">Reason:</span> <span className="text-slate-700 dark:text-slate-350">{processingReturn.reason}</span></div>
                <div><span className="font-bold text-slate-400 mr-2 uppercase">Current Refund Value:</span> <span className="font-bold text-purple-655">{processingReturn.refund_amount} AED</span></div>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="refundAmt" className="font-bold text-slate-700 dark:text-slate-300">Refund Amount Override (AED)</Label>
                    <Input
                      id="refundAmt"
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="retNotes" className="font-bold text-slate-700 dark:text-slate-300">Internal Audit Notes</Label>
                    <Input
                      id="retNotes"
                      placeholder="e.g. Approved: wrong size replacement shipped"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setProcessingReturn(null)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleUpdateStatus("rejected")}
                      disabled={updateStatusMutation.isPending}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold px-4 shadow-sm"
                    >
                      Reject Return
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleUpdateStatus("approved")}
                      disabled={updateStatusMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold px-4 shadow-sm"
                    >
                      Approve Return
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleUpdateStatus("completed")}
                      disabled={updateStatusMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-4 shadow-sm"
                    >
                      Complete & Refund
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : returns.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No return requests found</h3>
          <p className="text-slate-400 text-xs mt-1">
            Customers have not submitted any return/refund requests yet.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={returns}
          searchKey="order_number"
          searchPlaceholder="Search return requests by order number..."
        />
      )}
    </div>
  );
}
