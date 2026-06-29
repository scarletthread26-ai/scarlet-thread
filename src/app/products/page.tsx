import type { Metadata } from "next";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "All Gifts | The Scarlet Thread",
  description: "Browse our complete collection of beautiful, custom embroidered gifts.",
};

export default function AllProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-sm font-semibold text-slate-400">Loading catalog...</span>
          </div>
        </div>
      }>
        <ProductCatalog />
      </Suspense>
    </div>
  );
}
