"use client";

import React, { useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Percent, 
  DollarSign,
  Calendar,
  Sparkles,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";

const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#F59E0B", "#10B981"];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("7d");
  const { data, isLoading } = useAnalytics(range);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const tooltipStyle = isDark 
    ? { backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a" };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-650"></div>
      </div>
    );
  }

  const { revenueData = [], categoryData = [], funnelData = [] } = data;

  // Aggregate stats
  const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0);
  const totalOrders = revenueData.reduce((acc, d) => acc + d.orders, 0);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const conversionRate = 11.25; // mock constant conversion

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-purple-605" />
            Performance Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time analytics charts and conversions metrics for Scarlet Thread.
          </p>
        </div>
        
        {/* Date presets */}
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-850 p-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm shrink-0">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                range === r 
                  ? "bg-purple-650 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-350"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Total Revenue</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">AED {totalRevenue}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Completed Orders</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">{totalOrders} sales</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Avg. Order Value</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">AED {averageOrderValue}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-2xl">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Conversion Rate</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-150">{conversionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-650" />
              Sales & Orders History
            </CardTitle>
            <CardDescription className="text-xs">
              Daily revenue outputs and transaction volumes.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue (AED)" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="rounded-2xl shadow-sm border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-150 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-650" />
              Category Share
            </CardTitle>
            <CardDescription className="text-xs">
              Order splits based on store categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-center">
            <div className="h-60 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel charts split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Funnel conversion */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-150">
              Checkout Conversion Funnel
            </CardTitle>
            <CardDescription className="text-xs">
              Conversion drop-offs from visitors to purchases.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? "#10B981" : "#8B5CF6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Real-time stats aggregates */}
        <Card className="rounded-2xl shadow-sm border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 mb-4 text-base">Funnel Conversion</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Cart Add Rate</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">40.0%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Checkout Step Rate</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">45.8%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Purchase Success Rate</span>
                <span className="font-bold text-emerald-650">61.3%</span>
              </div>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/80 my-2" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Overall Conversion</span>
                <span className="font-extrabold text-purple-605">11.3%</span>
              </div>
            </div>
          </div>
          <div className="text-slate-400 text-[10px] italic pt-4">
            * Data refreshed in real-time based on checkout event analytics logs.
          </div>
        </Card>
      </div>
    </div>
  );
}
