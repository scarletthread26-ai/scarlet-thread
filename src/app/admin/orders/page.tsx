"use client";

import React, { useState, useEffect } from "react";
import { useAdminOrders } from "@/hooks/use-orders";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "@/hooks/use-realtime";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [isTopDropdownOpen, setIsTopDropdownOpen] = useState(false);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: orders, isLoading, refetch, isFetching } = useAdminOrders({ status: statusFilter });

  const queryClient = useQueryClient();

  // Listen to realtime changes on orders table
  useRealtime({
    table: "orders",
    event: "*",
    onPayload: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "order_number",
      header: "Order Number",
      cell: ({ row }) => {
        const order = row.original;
        const isActive = order.status === "pending";
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/orders/${order.id}`}
              className="font-mono font-bold text-primary hover:underline"
            >
              {order.order_number}
            </Link>
            {isActive && (
              <span 
                className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-sm animate-pulse" 
                title="Active Order"
              />
            )}
          </div>
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
            disabled={mounted ? (isLoading || isFetching) : false}
            className="rounded-lg h-9"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Top Custom Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTopDropdownOpen(!isTopDropdownOpen)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 text-slate-800 dark:text-slate-200 outline-none text-sm shadow-sm cursor-pointer h-9 font-medium flex items-center justify-between gap-2 min-w-[130px] transition select-none"
            >
              <span className="capitalize">
                {statusFilter === "all" ? "All Statuses" : statusFilter}
              </span>
              <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isTopDropdownOpen ? "rotate-90" : "")} />
            </button>

            <AnimatePresence>
              {isTopDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsTopDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-20 overflow-hidden py-1 min-w-[130px]"
                  >
                    {statuses.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(item.value);
                          setIsTopDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-850/50 transition font-medium",
                          statusFilter === item.value 
                            ? "text-purple-600 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20" 
                            : "text-slate-700 dark:text-slate-350"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
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
          filterContent={
            <div className="relative w-full max-w-[180px]">
              <button
                type="button"
                onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-xl py-2 px-4 text-slate-850 dark:text-slate-100 outline-none transition duration-200 text-sm shadow-sm cursor-pointer h-[38px] font-medium text-left select-none"
              >
                <span className="capitalize">
                  {statusFilter === "all" ? "All Statuses" : statusFilter}
                </span>
                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isTableDropdownOpen ? "rotate-90" : "")} />
              </button>

              <AnimatePresence>
                {isTableDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsTableDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                    >
                      {statuses.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(item.value);
                            setIsTableDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-850/50 transition font-medium",
                            statusFilter === item.value 
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20" 
                              : "text-slate-700 dark:text-slate-350"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          }
        />
      )}
    </div>
  );
}
