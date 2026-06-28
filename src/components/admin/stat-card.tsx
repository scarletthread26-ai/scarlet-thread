"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-1">
              {value}
            </h3>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || description) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 text-xs">
          {trend && !isLoading && (
            <div
              className={`flex items-center font-medium gap-0.5 px-1.5 py-0.5 rounded-full ${
                trend.isPositive
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border border-emerald-100/20 dark:border-emerald-900/10"
                  : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border border-rose-100/20 dark:border-rose-900/10"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
          {description && !isLoading && (
            <span className="text-slate-400 dark:text-slate-500">{description}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
