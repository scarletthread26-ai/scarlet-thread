"use client";

import React from "react";
import { useActivityLogs, ActivityLog } from "@/hooks/use-admins";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  FileClock, 
  AlertCircle,
  Network,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminActivityLogsPage() {
  const { data: logs = [], isLoading } = useActivityLogs();

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "created_at",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {format(new Date(row.original.created_at), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      accessorKey: "admin_name",
      header: "Administrator",
      cell: ({ row }) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {row.original.admin_name}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action executed",
      cell: ({ row }) => {
        const act = row.original.action;
        let color: "default" | "secondary" | "destructive" = "secondary";
        
        if (act.includes("create") || act.includes("add") || act.includes("restock")) color = "default";
        if (act.includes("delete") || act.includes("revoke") || act.includes("block")) color = "destructive";

        return (
          <Badge 
            variant={color} 
            className={cn(
              "text-[10px] uppercase font-bold py-0.5 px-2 rounded-lg",
              color === "default" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border-emerald-100" : ""
            )}
          >
            {act.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "entity_type",
      header: "Section",
      cell: ({ row }) => (
        <span className="text-xs text-slate-650 dark:text-slate-350 capitalize font-medium">
          {row.original.entity_type || "General"}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Adjustment specifics",
      cell: ({ row }) => {
        const details = row.original.details;
        if (!details) return <span className="text-xs text-slate-400">—</span>;
        
        return (
          <div className="max-w-xs text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-850/80 overflow-hidden text-ellipsis whitespace-nowrap" title={JSON.stringify(details)}>
            {JSON.stringify(details)}
          </div>
        );
      },
    },
    {
      accessorKey: "ip_address",
      header: "Source IP",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Network className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.original.ip_address || "Internal"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileClock className="w-7 h-7 text-purple-650" />
          Security Audit logs
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Historical log records containing administrative setting overrides and profile adjustments.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-805 rounded-2xl p-12 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-sm mt-4">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No activity logs recorded</h3>
          <p className="text-slate-400 text-xs mt-1">There are no historical activity overrides found.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          searchKey="admin_name"
          searchPlaceholder="Search audit trails by administrator name..."
        />
      )}
    </div>
  );
}
