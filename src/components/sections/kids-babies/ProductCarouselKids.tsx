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

export function ProductCarouselKids() {
  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const catProducts = dbProducts.filter(
      (p: any) => p.is_active && p.categories?.name === "Kids & Babies"
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
    <section className="py-10 lg:py-6 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="md:text-3xl text-2xl font-heading font-bold flex items-center md:justify-center gap-2">
            Most Loved <span className="text-primary">Kids & Baby</span> Gifts{" "}
            {/* <motion.div
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
              <Heart className="w-5 h-5 text-primary fill-transparent" />
            </motion.div> */}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 md:text-center text-start">
            Handpicked favorites for your little stars
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 sm:px-2 md:px-10"
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
              category: "Kids & Babies",
              slug: product.slug,
              bestSeller: (product as any).bestSeller || (product as any).best_seller
            };

            return (
              <div
                key={product.id}
                className="h-full sm:pt-2 sm:pb-6 group cursor-pointer"
              >
                <ProductCard 
                  product={formattedProduct} 
                />
              </div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/products?category=kids-babies"
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-8 py-5 h-13 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-primary/10"
            )}
          >
            View All Kids & Baby Gifts
          </Link>
        </div>

      </div>
    </section>
  )
}
