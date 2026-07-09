"use client"

import * as React from "react"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"
import { MobileProductCard } from "@/components/sections/FeaturedBanner"
import { cn } from "@/lib/utils"

import { useProducts } from "@/hooks/use-products"

export function RelatedProductsCarousel({ currentProduct }: { currentProduct?: any }) {
  const { data: dbProducts = [], isLoading } = useProducts()
  const scrollRef = useRef<HTMLDivElement>(null)

  const displayProducts = React.useMemo(() => {
    // Filter active products, excluding the current product
    const active = dbProducts.filter((p: any) => p.is_active && String(p.id) !== String(currentProduct?.id))
    
    // Try to get products from the same category
    const categoryName = currentProduct?.categories?.name || currentProduct?.category?.name || currentProduct?.categories || currentProduct?.category
    const sameCategory = active.filter((p: any) => {
      const pCatName = p.categories?.name || p.category?.name || p.categories || p.category
      return pCatName && categoryName && String(pCatName).toLowerCase() === String(categoryName).toLowerCase()
    })

    if (sameCategory.length > 0) {
      return sameCategory
    }
    
    // Otherwise fallback to other active products
    return active
  }, [dbProducts, currentProduct])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isLoading || displayProducts.length === 0) return null

  return (
    <section className="pb-5 pt-2 bg-white ">
      <div className="container mx-auto px-4">
        <div className="md:text-center text-start mb-5">
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center md:justify-center gap-2">
            You May Also <span className="text-primary"> Like{" "}</span>
          
          </h2>
        </div>

        <div className="relative max-w-7xl md:px-10">
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center z-10 hover:bg-[#FDF8FF] transition-colors border border-border text-muted-foreground cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center z-10 hover:bg-[#FDF8FF] transition-colors border border-border text-muted-foreground cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex max-sm:grid max-sm:grid-cols-2 overflow-x-auto gap-6 max-sm:gap-2 pb-8 max-sm:pb-4 pt-4 max-sm:pt-2 px-2 max-sm:px-2 snap-x hide-scrollbar scroll-smooth"
          >
          {displayProducts.map((product, idx) => {
            const formattedProduct = {
              id: product.id,
              name: product.name,
              price: product.price,
              compare_at_price: product.compare_at_price,
              image: product.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
              imagePlaceholder: product.name ? product.name.split(" ")[0] : "Custom",
              rating: product.rating || 0,
              reviews: product.reviews || 0,
              category: product.categories?.name || "You May Also Like",
              slug: product.slug,
              bestSeller: product.featured || false
            };

            return (
              <div
                key={product.id}
                className="w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col rounded-2xl max-sm:w-full"
              >
                <div className="sm:hidden w-full h-full">
                  <MobileProductCard product={formattedProduct} />
                </div>
                <div className="hidden sm:block w-full h-full">
                  <ProductCard 
                    product={formattedProduct} 
                    buttonClassName="bg-[#8059BB] hover:bg-[#4B0082] text-white" 
                  />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />
    </section>
  )
}