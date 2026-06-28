"use client";

import React, { useState } from "react";
import { useSalesReport, ReportRow } from "@/hooks/use-analytics";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const { data: salesReport = [], isLoading } = useSalesReport();
  const [statusFilter, setStatusFilter] = useState("all");

  const handleExportCSV = () => {
    if (salesReport.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = ["Date", "Order Number", "Customer Name", "Items Count", "Subtotal (AED)", "Discount (AED)", "Shipping Fee (AED)", "Total Amount (AED)", "Payment Status", "Order Status"];
      
      const rows = salesReport.map(r => [
        r.date,
        r.order_number,
        r.customer,
        r.items_count,
        r.subtotal,
        r.discount,
        r.shipping,
        r.total,
        r.payment_status,
        r.status
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(e => e.map(val => typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `scarlet-thread-sales-report-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Sales report CSV exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CSV file");
    }
  };

  const filteredData = statusFilter === "all"
    ? salesReport
    : salesReport.filter(r => r.status === statusFilter);

  const totalRevenue = filteredData.reduce((acc, r) => acc + r.total, 0);
  const totalDiscounts = filteredData.reduce((acc, r) => acc + r.discount, 0);
  const totalTax = Math.round(totalRevenue * 0.05); // 5% VAT UAE

  const columns: ColumnDef<ReportRow>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.date}</span>,
    },
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
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="font-medium text-slate-700 dark:text-slate-350">{row.original.customer}</span>
      ),
    },
    {
      accessorKey: "items_count",
      header: "Items",
      cell: ({ row }) => <span className="text-xs">{row.original.items_count} items</span>,
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => <span className="text-xs">{row.original.subtotal} AED</span>,
    },
    {
      accessorKey: "discount",
      header: "Discount",
      cell: ({ row }) => (
        <span className={cn("text-xs font-semibold", row.original.discount > 0 ? "text-emerald-600" : "")}>
          {row.original.discount > 0 ? `-AED ${row.original.discount}` : "—"}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total Revenue",
      cell: ({ row }) => (
        <span className="font-extrabold text-slate-800 dark:text-slate-105">
          {row.original.total} AED
        </span>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const pay = row.original.payment_status;
        return (
          <Badge 
            variant={pay === "paid" ? "default" : "secondary"}
            className={cn(
              "rounded-full font-bold px-2 py-0.5 text-[10px] capitalize",
              pay === "paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border-emerald-100" : ""
            )}
          >
            {pay}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Fulfillment",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" = "secondary";
        let customClass = "";
        
        if (status === "delivered") {
          variant = "default";
          customClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border-emerald-100";
        } else if (status === "cancelled") {
          variant = "destructive";
        } else {
          variant = "secondary";
          customClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/20 border-amber-100";
        }

        return (
          <Badge 
            variant={variant} 
            className={cn("rounded-full font-bold px-2 py-0.5 text-[10px] capitalize", customClass)}
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-purple-650" />
            Financial Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Export comprehensive sales history and tax calculations to CSV spreadsheets.
          </p>
        </div>
        <Button 
          onClick={handleExportCSV}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition-all hover:translate-y-[-1px]"
        >
          <Download className="w-4.5 h-4.5" />
          Export to CSV
        </Button>
      </div>

      {/* Aggregate row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Net Sales Revenue</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">AED {totalRevenue}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Promotional Discounts Issued</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">AED {totalDiscounts}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Estimated UAE VAT (5%)</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">AED {totalTax}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {["all", "pending", "processing", "delivered", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={cn(
              "pb-3 text-sm font-bold capitalize transition duration-200 relative",
              statusFilter === tab ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
            )}
          >
            {tab}
            {statusFilter === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No records found</h3>
          <p className="text-slate-400 text-xs mt-1">There are no orders matching this fulfillment category.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchKey="order_number"
          searchPlaceholder="Search report log by order number..."
        />
      )}
    </div>
  );
}
