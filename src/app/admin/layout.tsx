"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-250 text-slate-800 dark:text-slate-100">
      {/* 1. Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* 2. Mobile Sidebar Overlay drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-64 bg-white dark:bg-slate-900 h-full shadow-2xl flex"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 -right-12 p-2 rounded-lg bg-slate-900/80 dark:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => {}}
                onMobileClose={() => setIsMobileOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        <Header onMobileMenuOpen={() => setIsMobileOpen(true)} />
        
        {/* Main scrollable body panel */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/40 dark:bg-slate-950/20 p-4 md:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
