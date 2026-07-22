"use client";

import React, { useState } from "react";
import { useSalesReport, ReportRow } from "@/hooks/use-analytics";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  FileSpreadsheet, 
  Download, 
  AlertCircle,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReportsPage() {
  const { data: salesReport = [], isLoading } = useSalesReport();
  const [statusFilter, setStatusFilter] = useState("all");

  // Export CSV Filters Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportStatus, setExportStatus] = useState("all");
  const [exportCustomer, setExportCustomer] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleExportCSV = () => {
    if (salesReport.length === 0) {
      toast.error("No data to export");
      return;
    }
    setIsExportModalOpen(true);
  };

  const triggerCSVDownload = () => {
    try {
      let dataToExport = [...salesReport];

      // Filter by Start Date
      if (exportStartDate) {
        const start = new Date(exportStartDate);
        start.setHours(0, 0, 0, 0);
        dataToExport = dataToExport.filter(r => new Date(r.date) >= start);
      }

      // Filter by End Date
      if (exportEndDate) {
        const end = new Date(exportEndDate);
        end.setHours(23, 59, 59, 999);
        dataToExport = dataToExport.filter(r => new Date(r.date) <= end);
      }

      // Filter by Status
      if (exportStatus !== "all") {
        dataToExport = dataToExport.filter(r => r.status === exportStatus);
      }

      // Filter by Customer
      if (exportCustomer) {
        const query = exportCustomer.toLowerCase().trim();
        dataToExport = dataToExport.filter(r => 
          r.customer.toLowerCase().includes(query) || 
          r.order_number.toLowerCase().includes(query)
        );
      }

      if (dataToExport.length === 0) {
        toast.error("No records found matching the selected export filters.");
        return;
      }

      const headers = [
        "Date", 
        "Order Number", 
        "Customer Name", 
        "Items Count", 
        "Subtotal (AED)", 
        "Discount (AED)", 
        "Shipping Fee (AED)", 
        "Total Amount (AED)", 
        "Payment Status", 
        "Order Status"
      ];
      
      const rows = dataToExport.map(r => [
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
      
      toast.success(`Successfully exported ${dataToExport.length} orders to CSV!`);
      setIsExportModalOpen(false);
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
      <div className="max-w-sm">
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

      {/* Export Configuration Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-10 space-y-5 text-left"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                  Configure CSV Export
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Select filters to customize your financial sales export.
                </p>
              </div>

              <div className="space-y-4">
                {/* Date range inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none text-slate-805 dark:text-slate-195 focus:border-purple-550"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none text-slate-805 dark:text-slate-195 focus:border-purple-550"
                    />
                  </div>
                </div>

                {/* Status selection */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Order Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none text-slate-805 dark:text-slate-195 focus:border-purple-500 text-left transition select-none"
                  >
                    <span className="capitalize">{exportStatus === "all" ? "All Orders" : exportStatus}</span>
                    <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isStatusDropdownOpen ? "rotate-90" : "")} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsStatusDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1"
                        >
                          {[
                            { value: "all", label: "All Orders" },
                            { value: "pending", label: "Pending" },
                            { value: "processing", label: "Processing" },
                            { value: "delivered", label: "Delivered" },
                            { value: "cancelled", label: "Cancelled" }
                          ].map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                setExportStatus(item.value);
                                setIsStatusDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition font-medium",
                                exportStatus === item.value 
                                  ? "text-purple-600 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20" 
                                  : "text-slate-700 dark:text-slate-300"
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

                {/* Customer name input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Customer Name / Order #
                  </label>
                  <input
                    type="text"
                    value={exportCustomer}
                    onChange={(e) => setExportCustomer(e.target.value)}
                    placeholder="Search customer name or order number..."
                    className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none text-slate-805 dark:text-slate-195 focus:border-purple-550"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerCSVDownload}
                  className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-1.5 transition duration-150 shadow-md shadow-purple-600/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
