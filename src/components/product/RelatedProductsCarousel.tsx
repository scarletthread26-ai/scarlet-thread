"use client"

import * as React from "react"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 101,
    name: "Best Dad Ever Hoodie",
    price: 149,
    rating: 4.9,
    reviews: 125,
    badge: "Bestseller",
    image: "/images/forhimpage/scarlet-dadhero.png",
    compare_at_price: 199,
  },
  {
    id: 102,
    name: "Dad Est. Hoodie",
    price: 149,
    rating: 4.8,
    reviews: 95,
    badge: null,
    image: "/images/forhimpage/scarlet-papahoodie.png",
    compare_at_price: 199,
  },
  {
    id: 103,
    name: "Dad Life Cap",
    price: 79,
    rating: 4.9,
    reviews: 74,
    badge: "New",
    image: "/images/forhimpage/scarlet-Cap.png",
    compare_at_price: 99,
  },
  {
    id: 104,
    name: "Personalized Wallet",
    price: 99,
    rating: 4.9,
    reviews: 62,
    badge: null,
    image: "/images/forhimpage/scarlet-pouch.png",
    compare_at_price: 129,
  },
  {
    id: 105,
    name: "Super Dad Mug",
    price: 59,
    rating: 4.7,
    reviews: 81,
    badge: "Sale",
    image: "/images/forhimpage/scarlet-mug.png",
    compare_at_price: 79,
  },
  {
    id: 106,
    name: "The Man The Myth The Legend T-Shirt",
    price: 99,
    rating: 4.8,
    reviews: 112,
    badge: null,
    image: "/images/forhimpage/scarlet-hoodie.png",
    compare_at_price: 129,
  },
]

export function RelatedProductsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold flex items-center justify-center gap-2">
            You May Also Like{" "}
            <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-10">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-2 lg:-ml-6 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center z-10 hover:bg-[#FDF8FF] transition-colors border border-border text-muted-foreground cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-2 lg:-mr-6 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center z-10 hover:bg-[#FDF8FF] transition-colors border border-border text-muted-foreground cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel container using native scroll on desktop, grid on mobile */}
          <div
            ref={scrollRef}
            className="flex max-sm:grid max-sm:grid-cols-2 overflow-x-auto gap-6 max-sm:gap-0 pb-8 max-sm:pb-0 pt-4 max-sm:pt-0 px-2 max-sm:px-0 max-sm:border-t max-sm:border-slate-200/50 snap-x hide-scrollbar scroll-smooth"
          >
          {products.map((product, idx) => {
            const formattedProduct = {
              id: product.id,
              name: product.name,
              price: product.price,
              compare_at_price: product.compare_at_price,
              image: product.image,
              imagePlaceholder: "Product",
              rating: product.rating,
              reviews: product.reviews,
              category: "You May Also Like",
              slug: (product as any).slug,
              bestSeller: product.badge === "Best Seller"
            };

            return (
              <div
                key={product.id}
                className={cn(
                  "w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col rounded-2xl",
                  "max-sm:w-full max-sm:border-b max-sm:border-slate-200/50 max-sm:rounded-none",
                  idx % 2 === 0 ? "max-sm:border-r" : ""
                )}
              >
                <ProductCard 
                  product={formattedProduct} 
                  buttonClassName="bg-[#8059BB] hover:bg-[#4B0082] text-white" 
                  className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                />
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