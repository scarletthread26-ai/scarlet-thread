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
    id: 1,
    name: "Embroidered Hoodie",
    price: 1499,
    rating: 4.9,
    reviews: 102,
    imagePlaceholder: "Hoodie",
    bestSeller: true,
    image: "/images/forhimpage/scarlet-hoodie.png",
    slug: "embroidered-hoodie",
    compare_at_price: 1999,
  },
  {
    id: 2,
    name: "Embroidered Towel",
    price: 899,
    rating: 4.8,
    reviews: 86,
    imagePlaceholder: "Towel",
    bestSeller: true,
    image: "/images/forhimpage/scarlet-towel.png",
    slug: "embroidered-towel",
    compare_at_price: 1199,
  },
  {
    id: 3,
    name: "Travel Pouch",
    price: 699,
    rating: 4.9,
    reviews: 44,
    imagePlaceholder: "Pouch",
    bestSeller: true,
    image: "/images/forhimpage/scarlet-pouch.png",
    slug: "travel-pouch",
    compare_at_price: 999,
  },
  {
    id: 4,
    name: "Personalized Mug",
    price: 449,
    rating: 4.8,
    reviews: 38,
    imagePlaceholder: "Mug",
    bestSeller: true,
    image: "/images/forhimpage/scarlet-mug.png",
    slug: "personalized-mug",
    compare_at_price: 599,
  },
  {
    id: 5,
    name: "Embroidered Cap",
    price: 499,
    rating: 4.7,
    reviews: 30,
    imagePlaceholder: "Cap",
    bestSeller: true,
    image: "/images/forhimpage/scarlet-cap.png",
    slug: "embroidered-cap",
    compare_at_price: 699,
  },
  {
    id: 6,
    name: "Embroidery Gift Box",
    price: 999,
    rating: 4.9,
    reviews: 57,
    imagePlaceholder: "Box",
    bestSeller: false,
    image: "/images/forhimpage/scarlet-giftbox.png",
    slug: "embroidery-gift-box",
    compare_at_price: 1399,
  },
]

export function ProductCarousel() {
  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const catProducts = dbProducts.filter(
      (p: any) => p.is_active && p.categories?.name === "Gifts For Him"
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
            Most Loved Gifts For Him{" "}
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
            Handpicked gifts that he will truly appreciate
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
              category: "Gifts For Him",
              slug: product.slug,
              bestSeller: product.bestSeller
            };

            return (
              <div
                key={product.id}
                className="h-full pt-2 pb-6 group cursor-pointer"
              >
                <ProductCard 
                  product={formattedProduct} 
                  buttonClassName="bg-[#38015c] hover:bg-[#2a0145] text-white" 
                />
              </div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/products?category=gifts-for-him"
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-8 py-5 h-auto rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-primary/10"
            )}
          >
            View All Gifts For Him
          </Link>
        </div>

      </div>
    </section>
  )
}