"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useProducts } from "@/hooks/use-products"
import { ProductCard } from "@/components/product/ProductCard"

export function ProductCarouselHer() {
  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const catProducts = dbProducts.filter(
      (p: any) => p.is_active && p.categories?.name === "Gifts For Her"
    )
    return catProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      compare_at_price: p.compare_at_price,
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
      imagePlaceholder: p.name ? p.name.split(" ")[0] : "Custom",
      bestSeller: p.featured,
      slug: p.slug,
      is_personalized: p.is_personalized
    }))
  }, [dbProducts])

  if (displayProducts.length === 0) return null

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

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-0 sm:gap-4 md:gap-6 sm:px-2 md:px-10 max-sm:border-t max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 max-sm:bg-white dark:max-sm:bg-slate-900"
        >
          {displayProducts.slice(0, 4).map((product, idx) => {
            const formattedProduct = {
              id: product.id,
              name: product.name,
              price: product.price,
              compare_at_price: product.compare_at_price,
              image: product.image,
              imagePlaceholder: product.imagePlaceholder,
              rating: product.rating,
              reviews: product.reviews,
              category: "Gifts For Her",
              slug: product.slug,
              bestSeller: product.bestSeller
            };

            return (
              <div
                key={product.id}
                className={cn(
                  "h-full sm:pt-2 sm:pb-6 group cursor-pointer",
                  "max-sm:border-b max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80",
                  idx % 2 === 0 ? "max-sm:border-r" : ""
                )}
              >
                <ProductCard 
                  product={formattedProduct} 
                  buttonClassName="bg-[#c0004e] hover:bg-[#a0003f] text-white" 
                  className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                />
              </div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/products?category=gifts-for-her"
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-8 py-5 h-13 rounded-xl text-xs sm:text-sm font-bold bg-[#c0004e] hover:bg-[#a0003f] text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#c0004e]/10"
            )}
          >
            View All Gifts For Her
          </Link>
        </div>

      </div>
    </section>
  )
}