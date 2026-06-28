"use client";

import React from "react";
import { useAdminCustomers } from "@/hooks/use-customers";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerStats } from "@/hooks/use-customers";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, Loader2, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminCustomersPage() {
  const { data: customers, isLoading, refetch, isFetching } = useAdminCustomers();

  const columns: ColumnDef<CustomerStats>[] = [
    {
      accessorKey: "full_name",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100 dark:border-purple-900/30">
              {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <div>
              <Link 
                href={`/admin/customers/${customer.id}`}
                className="font-semibold text-slate-800 dark:text-slate-200 hover:text-primary hover:underline block"
              >
                {customer.full_name || "Unnamed Customer"}
              </Link>
              {customer.phone && <span className="block text-xs text-muted-foreground mt-0.5">{customer.phone}</span>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "orders_count",
      header: "Orders Count",
      cell: ({ row }) => {
        const count = row.getValue("orders_count") as number;
        return <span className="font-semibold text-slate-700 dark:text-slate-300">{count} order(s)</span>;
      },
    },
    {
      accessorKey: "total_spent",
      header: "Total Spent",
      cell: ({ row }) => {
        const spent = parseFloat(row.getValue("total_spent"));
        return <span className="font-bold text-primary">AED {spent.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Member Since",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <span className="text-slate-500 dark:text-slate-400 text-xs">{format(date, "MMM dd, yyyy")}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Link href={`/admin/customers/${customer.id}`}>
            <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-primary">
              <Eye className="w-4 h-4 mr-1" /> View Profile
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View customer directories, historical shopping stats, and aggregate lifetime spent totals in AED.
          </p>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isLoading || isFetching}
            className="rounded-lg h-9"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh List
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading customers list...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers || []}
          searchKey="full_name"
          searchPlaceholder="Search customer name..."
        />
      )}
    </div>
  );
}
