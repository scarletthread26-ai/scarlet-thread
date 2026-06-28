"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 101,
    name: "Best Dad Ever Hoodie",
    price: 149,
    rating: 4.9,
    reviews: 125,
    badge: "Bestseller",
    image: "/images/forhimpage/scarlet-dadhero.png",
  },
  {
    id: 102,
    name: "Dad Est. Hoodie",
    price: 149,
    rating: 4.8,
    reviews: 95,
    badge: null,
    image: "/images/forhimpage/scarlet-papahoodie.png",
  },
  {
    id: 103,
    name: "Dad Life Cap",
    price: 79,
    rating: 4.9,
    reviews: 74,
    badge: "New",
    image: "/images/forhimpage/scarlet-Cap.png",
  },
  {
    id: 104,
    name: "Personalized Wallet",
    price: 99,
    rating: 4.9,
    reviews: 62,
    badge: null,
    image: "/images/forhimpage/scarlet-pouch.png",
  },
  {
    id: 105,
    name: "Super Dad Mug",
    price: 59,
    rating: 4.7,
    reviews: 81,
    badge: "Sale",
    image: "/images/forhimpage/scarlet-mug.png",
  },
  {
    id: 106,
    name: "The Man The Myth The Legend T-Shirt",
    price: 99,
    rating: 4.8,
    reviews: 112,
    badge: null,
    image: "/images/forhimpage/scarlet-hoodie.png",
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
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col rounded-2xl"
              >
                <Card className="w-full h-full overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all group flex flex-col rounded-2xl bg-white">
                  <div className="relative aspect-square bg-[#FAFAFA] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded border border-border shadow-sm text-[10px] font-bold uppercase tracking-wider text-primary z-10">
                        {product.badge}
                      </div>
                    )}

                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors border border-primary/10 z-10">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <CardContent className="p-4 pt-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <div className="font-bold text-sm mb-3 text-primary">
                      AED {product.price}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, index) => (
                          <Star key={index} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span>{product.rating}</span>
                      <span className="ml-1">({product.reviews})</span>
                    </div>

                    <Link
                      href={`/product/${(product as { slug?: string; id: number | string }).slug || product.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "default" }),
                        "w-full mt-auto rounded-lg bg-[#8059BB] text-white border-primary hover:bg-[#4B0082] hover:text-white font-medium h-10"
                      )}
                    >
                      Add to Cart
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
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