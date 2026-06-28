"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Package, User, Heart, MapPin, LogOut, Loader2, Home, MessageSquare, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not authenticated, redirect to customer login
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard Overview", path: "/account", icon: Home },
    { name: "My Orders", path: "/account/orders", icon: Package },
    { name: "Edit Profile", path: "/account/profile", icon: User },
    { name: "Saved Addresses", path: "/account/addresses", icon: MapPin },
    { name: "My Wishlist", path: "/account/wishlist", icon: Heart },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading account session...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition px-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                {user?.email}
              </h4>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Registered Client</span>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1 p-4">
              {navLinks.map((link) => {
                const active = pathname === link.path;
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl font-medium text-sm transition ${
                      active 
                        ? "bg-primary text-white" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 shrink-0" />
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-3">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl gap-3 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>

          {/* Gifting Help Card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl p-5 text-left shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Need Gifting Support?</h5>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Questions about delivery times or custom embroidery requests? Contact our support team.
            </p>
            <a 
              href="https://wa.me/971501234567"
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
            >
              Chat on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
