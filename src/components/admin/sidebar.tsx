"use client";

import React, { useState } from "react";
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
  BellRing
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

  const menuGroups = [
    {
      title: "Core",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Sales",
      items: [
        { href: "/admin/orders", label: "Orders", icon: Tag },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/returns", label: "Returns", icon: RotateCcw },
        { href: "/admin/coupons", label: "Coupons", icon: Tag },
        { href: "/admin/shipping", label: "Shipping", icon: Truck },
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
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
        { href: "/admin/notifications", label: "Notifications", icon: BellRing },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/admins", label: "Staff Members", icon: Users },
        { href: "/admin/activity-logs", label: "Audit Logs", icon: FileText },
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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              {!isCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">
                  {group.title}
                </span>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition font-semibold text-sm cursor-pointer ${isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/10"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50"
                        }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
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
