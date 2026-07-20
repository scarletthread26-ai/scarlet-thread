"use client";

import React, { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/use-realtime";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Tags,
  Tag,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Warehouse,
  Truck,
  RotateCcw,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  ChevronLeft,
  Menu,
  BellRing,
  Newspaper,
  FolderOpen
} from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";
import { toast } from "sonner";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // Fetch the count of pending orders
  const fetchPendingCount = async () => {
    try {
      if (pathname === "/admin/orders") {
        setNewOrdersCount(0);
        return;
      }

      let lastSeen = null;
      if (typeof window !== "undefined") {
        lastSeen = localStorage.getItem("admin_last_seen_orders_time");
      }

      let query = supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (lastSeen) {
        query = query.gt("created_at", lastSeen);
      }

      const { count, error } = await query;
      if (!error && count !== null) {
        setNewOrdersCount(count);
      }
    } catch (err) {
      console.warn("Failed to fetch pending orders count:", err);
    }
  };

  // Update last seen orders time when viewing the orders list page
  useEffect(() => {
    if (pathname === "/admin/orders") {
      const nowStr = new Date().toISOString();
      localStorage.setItem("admin_last_seen_orders_time", nowStr);
      setNewOrdersCount(0);

      return () => {
        const leaveStr = new Date().toISOString();
        localStorage.setItem("admin_last_seen_orders_time", leaveStr);
      };
    }
  }, [pathname]);

  useEffect(() => {
    fetchPendingCount();
  }, [pathname]);

  // Listen to all database events on the orders table to keep the count perfectly synced in real-time
  useRealtime({
    table: "orders",
    event: "*",
    onPayload: () => {
      fetchPendingCount();
    },
  });

  const menuGroups = [
    {
      title: "Core",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Sales",
      items: [
        { href: "/admin/orders", label: "Orders", icon: Tag },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      title: "Catalog",
      items: [
        { href: "/admin/products", label: "Products", icon: ShoppingBag },
        { href: "/admin/categories", label: "Categories", icon: FolderTree },
      ],
    },
    {
      title: "Marketing & CMS",
      items: [
        { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
        { href: "/admin/cms", label: "CMS Pages", icon: FileText },
        { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
        { href: "/admin/gallery", label: "Gallery", icon: FolderOpen },
        { href: "/admin/notifications", label: "Notifications", icon: BellRing },
      ],
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      router.push("/admin/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutOpen(false);
    }
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 ${isCollapsed ? "w-[72px]" : "w-64"
        }`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sidebar Header */}
        <div className="h-16 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between px-4 shrink-0">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-wide select-none">
              <img
                src="/images/logo/logo.png"
                alt="The Scarlet Thread Logo"
                className="w-8 h-8 object-contain shrink-0"
              />
              <span>Scarlet Panel</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin/dashboard" className="w-8 h-8 mx-auto flex items-center justify-center shrink-0">
              <img
                src="/images/logo/logo.png"
                alt="The Scarlet Thread Logo"
                className="w-8 h-8 object-contain"
              />
            </Link>
          )}

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer shadow-sm"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Sidebar Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scrollbar-none">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 block">
                  {group.title}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-[10px] transition font-semibold text-sm cursor-pointer ${
                        isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                          : "text-black dark:text-slate-300 hover:text-black hover:bg-purple-100 dark:hover:bg-slate-800/80"
                        }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}

                      {/* Live Counter Badge for New Orders */}
                      {item.label === "Orders" && newOrdersCount > 0 && (
                        <>
                          {!isCollapsed ? (
                            <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                              {newOrdersCount}
                            </span>
                          ) : (
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/80 shrink-0">
        <button
          onClick={() => setIsLogoutOpen(true)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-sm transition cursor-pointer outline-none ${isCollapsed ? "justify-center" : ""
            }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        {/* Sign Out Confirmation */}
        <ConfirmDialog
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogout}
          isLoading={isLoggingOut}
          isDestructive={true}
          title="Sign Out"
          description="Are you sure you want to log out of the administrator panel?"
          confirmLabel="Sign Out"
        />
      </div>
    </aside>
  );
}
