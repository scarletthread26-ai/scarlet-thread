import type { Metadata } from "next";
import { ProductCatalog } from "@/components/sections/ProductCatalog";

export const metadata: Metadata = {
  title: "All Gifts | The Scarlet Thread",
  description: "Browse our complete collection of beautiful, custom embroidered gifts.",
};

export default function AllProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ProductCatalog />
    </div>
  );
}
