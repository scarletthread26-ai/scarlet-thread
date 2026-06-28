"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useProducts } from "@/hooks/use-products"

const products = [
  {
    id: 1,
    name: "Mama Heart Hoodie",
    category: "Hoodies",
    price: 1499,
    rating: 4.9,
    reviews: 120,
    imagePlaceholder: "Mama",
    image: "/images/scarlet-lovedgift1.png"
  },
  {
    id: 2,
    name: "Personalized Hooded Towel",
    category: "Towels",
    price: 899,
    rating: 4.8,
    reviews: 86,
    imagePlaceholder: "Aryan",
    image: "/images/scarlet-lovedgift2.png"
  },
  {
    id: 3,
    name: "Bride Cosmetic Pouch",
    category: "Pouches",
    price: 699,
    rating: 4.9,
    reviews: 44,
    imagePlaceholder: "Bride",
    image: "/images/scarlet-lovedgift3.png"
  },
  {
    id: 4,
    name: "Teacher's Day Notebook",
    category: "Notebooks",
    price: 449,
    rating: 4.7,
    reviews: 32,
    imagePlaceholder: "Best Teacher",
    image: "/images/scarlet-lovedgift4.png"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

function ProductCard({ product }: { product: any }) {
  const href = `/product/${product.slug || product.id}`;
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <Link href={href} className="block w-full h-full">
        <div className="relative aspect-square bg-secondary/30 overflow-hidden">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-muted-foreground hover:text-red-500 transition-colors z-20 opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-4 h-4" />
          </button>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="w-full h-full bg-white rounded-2xl shadow-sm flex items-center justify-center border border-border/30">
                <span className="font-heading italic text-xl text-primary font-medium">{product.imagePlaceholder}</span>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4 pt-5">
          <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">{product.category}</div>
          <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg">AED {product.price}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="text-xs">({product.reviews})</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export function ProductGrid() {
  const { data: dbProducts = [] } = useProducts()

  const displayProducts = React.useMemo(() => {
    const activeProducts = dbProducts.filter((p) => p.is_active && p.best_seller)
    if (activeProducts.length > 0) {
      return activeProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || "Apparel",
        price: p.price,
        rating: 4.9,
        reviews: 100,
        imagePlaceholder: p.sku || "Custom",
        image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
        slug: p.slug
      }))
    }
    return products
  }, [dbProducts])

  return (
    <section className="py-5 md:py-24 bg-[#F9F5FF]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* Heading */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            Our Most Loved <span className="text-primary">Gifts</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            Carefully selected and thoughtfully crafted to bring joy, create meaningful connections, and make every moment feel extra special.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll carousel */}
        <div className="sm:hidden -mx-4 px-4">
          <motion.div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <style>{`.mobile-carousel::-webkit-scrollbar { display: none; }`}</style>
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className="snap-start shrink-0 w-[58vw]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            {/* trailing spacer so last card doesn't hug edge */}
            <div className="shrink-0 w-4" />
          </motion.div>
        </div>

        {/* Desktop: grid */}
        <motion.div
          className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10 md:mt-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Link href="/products">
            <Button size="lg" className="rounded-[5px] px-8 shadow-sm">View All Gifts</Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}