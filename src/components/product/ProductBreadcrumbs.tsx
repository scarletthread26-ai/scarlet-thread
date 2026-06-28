import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbsProps {
  product?: any;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const productName = product?.name || "Personalized Hoodie";
  const categoryName = product?.categories?.name || "Gifts For Him";
  const categorySlug = product?.categories?.slug || "gifts-for-him";

  return (
    <nav className="flex items-center text-xs text-slate-400 py-4 font-medium">
      <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
      <ChevronRight className="w-3 h-3 mx-2" />
      <Link href={`/${categorySlug}`} className="hover:text-purple-600 transition-colors">{categoryName}</Link>
      <ChevronRight className="w-3 h-3 mx-2" />
      <span className="text-slate-600 dark:text-slate-300 font-bold">{productName}</span>
    </nav>
  );
}
