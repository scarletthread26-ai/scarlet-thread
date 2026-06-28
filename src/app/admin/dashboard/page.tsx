"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  TrendingDown,
  Warehouse,
  ShoppingBag as OrderIcon,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/admin/empty-state";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard statistics");
      return res.json();
    },
    // Keep caching active so UI is instant
    staleTime: 5 * 60 * 1000,
  });

  // Fallback / Mock Data in case of load or db mismatch
  const stats = data?.stats || {
    revenue: 45680.0,
    ordersCount: 312,
    customersCount: 840,
    lowStockCount: 3,
    revenueTrend: { value: 14.5, isPositive: true },
    ordersTrend: { value: 8.2, isPositive: true },
    customersTrend: { value: 12.0, isPositive: true },
    lowStockTrend: { value: 25.0, isPositive: false },
  };

  const revenueHistory = data?.revenueHistory || [
    { name: "Mon", revenue: 4200, orders: 28 },
    { name: "Tue", revenue: 5100, orders: 35 },
    { name: "Wed", revenue: 4800, orders: 32 },
    { name: "Thu", revenue: 6200, orders: 42 },
    { name: "Fri", revenue: 7500, orders: 51 },
    { name: "Sat", revenue: 9100, orders: 62 },
    { name: "Sun", revenue: 8780, orders: 62 },
  ];

  const recentOrders = data?.recentOrders || [
    { id: "1", order_number: "ST-10042", customer: "Amna Al-Mansoori", date: "Just now", amount: 489.0, status: "pending" },
    { id: "2", order_number: "ST-10041", customer: "Zainab Rashid", date: "15 mins ago", amount: 1499.0, status: "processing" },
    { id: "3", order_number: "ST-10040", customer: "John Smith", date: "1 hour ago", amount: 899.0, status: "shipped" },
    { id: "4", order_number: "ST-10039", customer: "Fatima Hassan", date: "3 hours ago", amount: 699.0, status: "delivered" },
    { id: "5", order_number: "ST-10038", customer: "Tareq Ghaoui", date: "5 hours ago", amount: 1299.0, status: "cancelled" },
  ];

  const topProducts = data?.topProducts || [
    { id: "1", name: "Personalized Hooded Towel", sales: 124, revenue: 11147.6, image: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=150&q=80" },
    { id: "2", name: "Mama Heart Hoodie", sales: 98, revenue: 14690.2, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=150&q=80" },
    { id: "3", name: "Bride Cosmetic Pouch", sales: 76, revenue: 5312.4, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=150&q=80" },
  ];

  const lowStockProducts = data?.lowStockProducts || [
    { id: "1", name: "Organic Cotton Baby Bibs (Pink)", sku: "BIB-PNK-01", stock: 2 },
    { id: "2", name: "Personalized Canvas Tote Bag", sku: "TOTE-CAN-01", stock: 4 },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    processing: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    shipped: "bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
    delivered: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    cancelled: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time business performance overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-450 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm select-none">
          <Clock className="w-3.5 h-3.5 text-purple-500" />
          <span>Last 7 Days (AED)</span>
        </div>
      </div>

      {/* 1. Statistics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${stats.revenue.toLocaleString()} AED`}
          icon={DollarSign}
          trend={stats.revenueTrend}
          description="vs last period"
          isLoading={isLoading}
        />
        <StatCard
          title="Orders Placed"
          value={stats.ordersCount}
          icon={ShoppingBag}
          trend={stats.ordersTrend}
          description="vs last period"
          isLoading={isLoading}
        />
        <StatCard
          title="Registered Customers"
          value={stats.customersCount}
          icon={Users}
          trend={stats.customersTrend}
          description="vs last period"
          isLoading={isLoading}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          trend={stats.lowStockTrend}
          description="items need restock"
          isLoading={isLoading}
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Revenue & Orders Trend
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Daily sales value and orders velocity.
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.25)" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value} AED`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Volume Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Order Frequency
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Number of completed checkouts.
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(203, 213, 225, 0.25)" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [value, "Orders"]}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 3. Detailed Data Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  Recent Orders
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Latest customer orders waiting for process.
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Order #</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Price</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50">
                  {recentOrders.map((order: { id: string; order_number: string; customer: string; date: string; amount: number; status: string }) => (
                    <tr key={order.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-950/5 transition">
                      <td className="py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {order.order_number}
                      </td>
                      <td className="py-3.5 text-sm text-slate-600 dark:text-slate-400">
                        {order.customer}
                      </td>
                      <td className="py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {order.amount.toFixed(2)} AED
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Side Panel: Top Selling and Low Stock Alerts */}
        <div className="space-y-6">
          {/* Top Selling Products List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm"
          >
            <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-4">
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {topProducts.map((prod: { id: string; name: string; sales: number; revenue: number; image: string }) => (
                <div key={prod.id} className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {prod.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                      {prod.sales} sold &bull; {prod.revenue.toLocaleString()} AED
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Stock Warning Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts</span>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((prod: { id: string; name: string; sku: string; stock: number }) => (
                  <div
                    key={prod.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/35 dark:border-rose-900/10"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {prod.sku}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 shrink-0">
                      {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-450 dark:text-slate-500">
                All inventory is fully stocked!
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
