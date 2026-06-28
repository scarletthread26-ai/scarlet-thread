import type { Metadata } from "next";
import { fontSans, fontHeading } from "@/lib/fonts";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import ThemeProvider from "@/providers/theme-provider";
import { StorefrontLayout } from "@/components/layout/StorefrontLayout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "The Scarlet Thread | Every Gift Tells A Story",
  description: "Personalized luxury gifts. Embroidered and made with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden`}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <StorefrontLayout>
              {children}
            </StorefrontLayout>
            <Toaster position="bottom-left" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

