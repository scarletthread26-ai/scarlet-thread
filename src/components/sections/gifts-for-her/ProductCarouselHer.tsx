"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useProducts } from "@/hooks/use-products"

const products = [
  {
    id: 11,
    name: "Embroidered Hoodie",
    price: 1499,
    rating: 4.9,
    reviews: 124,
    imagePlaceholder: "Pink Hoodie",
    image: "/images/forherproduct/scarlet-pinkhoodie.png",
    bestSeller: false,
  },
  {
    id: 12,
    name: "Makeup Pouch",
    price: 599,
    rating: 4.8,
    reviews: 98,
    imagePlaceholder: "Pouch",
    image: "/images/forherproduct/scarlet-pouch.png",
    bestSeller: false,
  },
  {
    id: 13,
    name: "Personalized Jewelry Box",
    price: 899,
    rating: 4.9,
    reviews: 215,
    imagePlaceholder: "Jewelry Box",
    image: "/images/forherproduct/scarlet-bag.png",
    bestSeller: false,
  },
  {
    id: 14,
    name: "Metal Tumbler",
    price: 699,
    rating: 4.8,
    reviews: 85,
    imagePlaceholder: "Tumbler",
    image: "/images/forherproduct/scarlet-trumbler.png",
    bestSeller: false,
  },
  {
    id: 15,
    name: "Tote Bag",
    price: 699,
    rating: 4.7,
    reviews: 72,
    imagePlaceholder: "Tote Bag",
    image: "/images/forherproduct/scarlet-totebag.png",
    bestSeller: false,
  },
]

export function ProductCarouselHer() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const catProducts = dbProducts.filter(
      (p: any) => p.is_active && p.categories?.name === "Gifts For Her"
    )
    if (catProducts.length > 0) {
      return catProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: 4.9,
        reviews: 100,
        image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
        imagePlaceholder: p.sku || "Custom",
        bestSeller: p.featured,
        slug: p.slug,
        is_personalized: p.is_personalized
      }))
    }
    return products
  }, [dbProducts])

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
    
    api.on("resize", () => {
      setCount(api.scrollSnapList().length)
    })
  }, [api])

  return (
    <section className="py-3 lg:py-6 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Most Loved Gifts For Her{" "}
            <motion.div
              animate={{
                y: [0, -4, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-block"
            >
              <Heart className="w-5 h-5 text-[#c0004e] fill-[#c0004e]" />
            </motion.div>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked with love, just for her
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative px-2 md:px-10"
        >
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {displayProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-[55%] sm:basis-[40%] md:basis-[33.33%] lg:basis-[20%]">
                  <div className="h-full pt-2 pb-6 group cursor-grab active:cursor-grabbing">
                    
                    <Card className="group/card border-0 shadow-none bg-transparent h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-2xl aspect-square w-full shadow-sm hover:shadow-lg transition-shadow duration-500 bg-[#FFF5F5]">
                        <div className="absolute inset-0 transition-transform duration-700 group-hover/card:scale-105">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-heading italic text-xl text-[#c0004e] font-medium">
                                {product.imagePlaceholder}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Floating Glow (Subtle) */}
                        <div className="absolute inset-0 rounded-2xl border border-[#c0004e]/10 transition-colors duration-500 group-hover/card:border-[#c0004e]/30 pointer-events-none" />

                        {product.bestSeller ? (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-100 shadow-sm z-10">
                            <span className="text-[10px] font-heading italic font-semibold text-[#c0004e]">
                              Best Seller
                            </span>
                          </div>
                        ) : (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-pink-100 shadow-sm z-10">
                            <span className="text-[10px] font-heading italic font-semibold text-[#c0004e]">
                              {product.imagePlaceholder}
                            </span>
                          </div>
                        )}

                        {/* Wishlist */}
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 hover:bg-white transition-all active:scale-95 z-10">
                          <Heart className="w-4 h-4 text-[#c0004e] hover:fill-[#c0004e] transition-colors" />
                        </button>
                      </div>

                      {/* Content */}
                      <CardContent className="px-1 pt-4 pb-0 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="font-semibold text-sm text-[#2f1f3a] mb-2 line-clamp-1 group-hover/card:text-[#c0004e] transition-colors">
                            {product.name}
                          </h3>

                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[#c0004e] font-bold text-lg">
                              AED {product.price}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{product.rating}</span>
                              <span className="hidden sm:inline opacity-70">({product.reviews})</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <Link
                            href={`/product/${(product as { slug?: string; id: number | string }).slug || product.id}`}
                            className={cn(
                              buttonVariants({ variant: "default" }),
                              "w-full h-9 rounded-xl text-xs font-bold bg-[#c0004e] hover:bg-[#a0003f] text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                            )}
                          >
                            Add to Cart
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots Indicator */}
          {count > 0 && (
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    i === current 
                      ? "w-6 h-2 bg-[#c0004e] shadow-sm" 
                      : "w-2 h-2 bg-[#c0004e]/20 hover:bg-[#c0004e]/40"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </section>
  )
}