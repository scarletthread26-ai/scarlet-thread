"use client"

import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/ProductCard"
import { useMemo } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeaturedBanner() {
  const { data: dbProducts, isLoading } = useProducts()

  const bestSellers = useMemo(() => {
    if (!dbProducts) return []
    
    // Filter best seller, sort by latest
    const filtered = dbProducts.filter((p) => p.best_seller === true)
    
    // Fallback: If no products are marked as best seller yet, show the latest 4 products
    const displayProducts = filtered.length > 0 ? filtered : [...dbProducts]

    return displayProducts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
  }, [dbProducts])

  if (isLoading) {
    return null
  }

  return (
    <section className="py-16 md:py-16 bg-white border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-3">
            Best <span className="text-primary">Sellers</span>
            
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Our most loved products, carefully curated for you.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto px-0 sm:px-4 md:px-10">
          {/* Responsive grid for best sellers */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-sm:gap-0 max-sm:border-t max-sm:border-slate-200/50">
            {bestSellers.map((product, idx) => {
              const formattedProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                compare_at_price: product.compare_at_price,
                image: product.images?.[0]?.url || "",
                imagePlaceholder: "Gift",
                category: product.categories?.name || "Best Seller",
                slug: product.slug,
                bestSeller: product.best_seller
              }

              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex flex-col rounded-2xl w-full",
                    "max-sm:border-b max-sm:border-slate-200/50 max-sm:rounded-none",
                    idx % 2 === 0 ? "max-sm:border-r" : ""
                  )}
                >
                  <ProductCard 
                    product={formattedProduct} 
                    className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
