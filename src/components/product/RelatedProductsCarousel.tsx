"use client"

import * as React from "react"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"

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

          {/* Carousel container using native scroll */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 pt-4 px-2 snap-x hide-scrollbar scroll-smooth"
          >
          {products.map((product) => {
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
                className="w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col rounded-2xl"
              >
                <ProductCard 
                  product={formattedProduct} 
                  buttonClassName="bg-[#8059BB] hover:bg-[#4B0082] text-white" 
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