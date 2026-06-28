"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, ChevronRight, User, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";
import { toast } from "sonner";
import Link from "next/link";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAdminData() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminUser({
          email: user.email || "admin@scarletthread.com",
          fullName: (user.user_metadata?.full_name as string) || "Scarlet Admin",
        });
      }
      setIsLoading(false);
    }
    getAdminData();
  }, [supabase]);

  // Generate breadcrumbs from pathname
  const paths = pathname.split("/").filter((x) => x);
  // Remove 'admin' from paths for cleaner admin breadcrumbs
  const breadcrumbs = paths.slice(1);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      router.push("/admin/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* Left side: Hamburger (Mobile) & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu trigger */}
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <Link href="/admin/dashboard" className="hover:text-purple-600 dark:hover:text-purple-400 transition">
            Admin
          </Link>
          {breadcrumbs.map((segment, index) => {
            const href = `/admin/${breadcrumbs.slice(0, index + 1).join("/")}`;
            const label = segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            const isLast = index === breadcrumbs.length - 1;

            return (
              <React.Fragment key={segment}>
                <ChevronRight className="w-3.5 h-3.5" />
                {isLast ? (
                  <span className="text-slate-700 dark:text-slate-200 font-bold select-none">
                    {label}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-purple-600 dark:hover:text-purple-400 transition">
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Right side: Search, Theme Toggle, Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Command Palette Search bar */}
        <CommandPalette />

        {/* Dark/Light mode toggle */}
        <ThemeToggle />

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer outline-none select-none"
          >
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-purple-600/10 border border-purple-500/20 select-none">
                {adminUser ? getInitials(adminUser.fullName) : "AD"}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                {isLoading ? "Loading..." : adminUser?.fullName || "Admin User"}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Administrator
              </p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay behind dropdown to close it */}
              <div onClick={() => setIsDropdownOpen(false)} className="fixed inset-0 z-30" />
              <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-xl py-1 z-40 relative">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/50">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {adminUser?.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {adminUser?.email}
                  </p>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left cursor-pointer border-t border-slate-100 dark:border-slate-800/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
