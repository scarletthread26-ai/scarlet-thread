"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export default function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <NextThemesProvider
        key="admin"
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="admin-theme"
        {...props}
      >
        {children}
      </NextThemesProvider>
    );
  }

  // Customer Frontend (Public Website) is locked to light mode.
  return (
    <NextThemesProvider
      key="customer"
      forcedTheme="light"
      attribute="class"
      enableColorScheme={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

