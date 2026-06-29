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

const products = [
  {
    id: 21,
    name: "Hooded Towel",
    price: 899,
    rating: 4.9,
    reviews: 128,
    imagePlaceholder: "Myra Towel",
    image: "/images/scarlet-babie1.png",
    slug: "hooded-towel-baby",
    compare_at_price: 1199,
  },
  {
    id: 22,
    name: "Embroidered Onesie",
    price: 699,
    rating: 4.8,
    reviews: 95,
    imagePlaceholder: "Little Prince",
    image: "/images/scarlet-babie2.png",
    slug: "embroidered-onesie",
    compare_at_price: 899,
  },
  {
    id: 23,
    name: "Personalized Teddy",
    price: 999,
    rating: 4.9,
    reviews: 112,
    imagePlaceholder: "Teddy Bear",
    image: "/images/scarlet-babie3.png",
    slug: "personalized-teddy",
    compare_at_price: 1399,
  },
  {
    id: 24,
    name: "Kids Backpack",
    price: 1299,
    rating: 4.8,
    reviews: 74,
    imagePlaceholder: "Ananya Backpack",
    image: "/images/scarlet-babie4.png",
    slug: "kids-backpack",
    compare_at_price: 1699,
  },
  {
    id: 25,
    name: "Baby Blanket",
    price: 1099,
    rating: 4.9,
    reviews: 86,
    imagePlaceholder: "Vihaan Blanket",
    image: "/images/scarlet-babie5.png",
    slug: "baby-blanket",
    compare_at_price: 1499,
  },
]

export function ProductCarouselKids() {
  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const catProducts = dbProducts.filter(
      (p: any) => p.is_active && p.categories?.name === "Kids & Babies"
    )
    if (catProducts.length > 0) {
      return catProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        compare_at_price: p.compare_at_price,
        rating: 4.9,
        reviews: 100,
        image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
        imagePlaceholder: p.name ? p.name.split(" ")[0] : "Custom",
        bestSeller: p.featured,
        slug: p.slug,
        is_personalized: p.is_personalized
      }))
    }
    return products
  }, [dbProducts])

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
            Most Loved Kids & Baby Gifts{" "}
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
              <Heart className="w-5 h-5 text-primary fill-transparent" />
            </motion.div>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked favorites for your little stars
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-10"
        >
          {displayProducts.slice(0, 4).map((product) => {
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
                className="h-full pt-2 pb-6 group cursor-pointer"
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
              "px-8 py-5 h-auto rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-primary/10"
            )}
          >
            View All Kids & Baby Gifts
          </Link>
        </div>

      </div>
    </section>
  )
}
