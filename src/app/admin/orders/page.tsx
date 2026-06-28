"use client";

import React, { useState } from "react";
import { useAdminOrders } from "@/hooks/use-orders";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: orders, isLoading, refetch, isFetching } = useAdminOrders({ status: statusFilter });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order_number",
      header: "Order Number",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Link 
            href={`/admin/orders/${order.id}`}
            className="font-mono font-bold text-primary hover:underline"
          >
            {order.order_number}
          </Link>
        );
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        if (order.is_guest_checkout) {
          return (
            <div>
              <span className="font-semibold">{order.shipping_address?.full_name || "Guest"}</span>
              <span className="block text-xs text-muted-foreground">{order.guest_email || "No email"}</span>
            </div>
          );
        }
        return (
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {order.shipping_address?.full_name || order.user?.full_name || "Registered Shopper"}
            </span>
            <span className="block text-xs text-muted-foreground">{order.guest_email || "Registered Profile"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        
        if (status === "cancelled") variant = "destructive";
        else if (status === "delivered") variant = "secondary";
        else if (status === "shipped") variant = "outline";

        return (
          <Badge variant={variant} className="capitalize font-semibold">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        return <span className="font-bold text-slate-800 dark:text-slate-200">AED {amount.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>
            <Badge 
              variant={order.payment_status === "paid" ? "secondary" : "destructive"}
              className="text-xs uppercase font-bold"
            >
              {order.payment_status}
            </Badge>
            <span className="block text-xs text-muted-foreground mt-0.5">{order.payment_method}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date Placed",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <span className="text-slate-600 dark:text-slate-400 text-xs">{format(date, "MMM dd, yyyy h:mm a")}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Link href={`/admin/orders/${order.id}`}>
            <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-primary">
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer purchases, update tracking details, and control production workflow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isLoading || isFetching}
            className="rounded-lg h-9"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 text-slate-800 dark:text-slate-200 outline-none text-sm shadow-sm cursor-pointer h-9 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading orders catalog...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders || []}
          searchKey="order_number"
          searchPlaceholder="Search order number..."
        />
      )}
    </div>
  );
}
