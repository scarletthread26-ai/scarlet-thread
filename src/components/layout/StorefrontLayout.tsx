"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppWidget } from "./WhatsAppWidget";
import { MiniCartDrawer } from "../cart/MiniCartDrawer";
import { HeroProvider } from "@/contexts/HeroContext";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude admin dashboard, customer dashboard, and auth routes from storefront layouts
  const isExcludedRoute = 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/account") ||
    pathname?.startsWith("/login") || 
    pathname?.startsWith("/register") || 
    pathname?.startsWith("/forgot-password") || 
    pathname?.startsWith("/reset-password");

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <HeroProvider>
      <Header />
      <main className="flex-1 pt-[114px] lg:pt-[164px] sm:pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
      <MiniCartDrawer />
    </HeroProvider>
  );
}
