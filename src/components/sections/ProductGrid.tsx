"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    image: "/images/scarlet-lovedgift1.png",
    compare_at_price: 1999,
  },
  {
    id: 2,
    name: "Personalized Hooded Towel",
    category: "Towels",
    price: 899,
    rating: 4.8,
    reviews: 86,
    imagePlaceholder: "Aryan",
    image: "/images/scarlet-lovedgift2.png",
    compare_at_price: 1199,
  },
  {
    id: 3,
    name: "Bride Cosmetic Pouch",
    category: "Pouches",
    price: 699,
    rating: 4.9,
    reviews: 44,
    imagePlaceholder: "Bride",
    image: "/images/scarlet-lovedgift3.png",
    compare_at_price: 999,
  },
  {
    id: 4,
    name: "Teacher's Day Notebook",
    category: "Notebooks",
    price: 449,
    rating: 4.7,
    reviews: 32,
    imagePlaceholder: "Best Teacher",
    image: "/images/scarlet-lovedgift4.png",
    compare_at_price: 599,
  },
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


import { ProductCard } from "@/components/product/ProductCard"

function formatLovedGiftsTitle(titleStr: string) {
  if (!titleStr) return "";
  const lower = titleStr.toLowerCase();
  if (lower === "our most loved gifts") {
    return (
      <>
        Our Most Loved <span className="text-primary">Gifts</span>
      </>
    );
  }
  const words = titleStr.split(" ");
  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    const remaining = words.slice(0, -1).join(" ");
    return (
      <>
        {remaining} <span className="text-primary">{lastWord}</span>
      </>
    );
  }
  return titleStr;
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col h-full min-h-[380px]"
        >
          {/* Image skeleton */}
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-900/60 animate-pulse relative" />
          
          {/* Content skeleton */}
          <div className="p-4 flex flex-col flex-grow justify-between">
            <div className="space-y-3">
              <div className="w-12 h-2.5 bg-slate-100 dark:bg-slate-900 animate-pulse rounded" />
              <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-900 animate-pulse rounded" />
              <div className="w-2/3 h-4 bg-slate-100 dark:bg-slate-900 animate-pulse rounded" />
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-slate-900/60 animate-pulse">
              <div className="w-16 h-6 bg-slate-100 dark:bg-slate-900 rounded" />
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductGrid() {
  const { data: dbProducts = [], isLoading } = useProducts()
  const [sectionData, setSectionData] = React.useState<any>(null)
  const [isCmsLoading, setIsCmsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadSection() {
      try {
        const res = await fetch("/api/admin/cms/homepage-sections?key=featured-products")
        if (res.ok) {
          const json = await res.json()
          if (json) setSectionData(json)
        }
      } catch (err) {
        console.warn("Failed to load featured products section config:", err)
      } finally {
        setIsCmsLoading(false)
      }
    }
    loadSection()
  }, [])

  const showSkeleton = isLoading || isCmsLoading

  const displayProducts = React.useMemo(() => {
    const selectedIds = sectionData?.content?.product_ids || []
    
    if (selectedIds.length > 0 && dbProducts.length > 0) {
      const selectedProds = selectedIds
        .map((id: string) => dbProducts.find((p) => p.id === id))
        .filter((p: any) => p && p.is_active)
      
      if (selectedProds.length > 0) {
        return selectedProds.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.categories?.name || "Apparel",
          price: p.price,
          compare_at_price: p.compare_at_price,
          rating: 4.9,
          reviews: 100,
          imagePlaceholder: p.name ? p.name.split(" ")[0] : "Custom",
          image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
          slug: p.slug
        }))
      }
    }

    const activeProducts = dbProducts.filter((p) => p.is_active && p.featured)
    if (activeProducts.length > 0) {
      return activeProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || "Apparel",
        price: p.price,
        compare_at_price: p.compare_at_price,
        rating: 4.9,
        reviews: 100,
        imagePlaceholder: p.name ? p.name.split(" ")[0] : "Custom",
        image: p.images?.[0]?.url || "/images/scarlet-lovedgift1.png",
        slug: p.slug
      }))
    }
    return products
  }, [dbProducts, sectionData])

  const title = sectionData?.title || "Our Most Loved Gifts"
  const subtitle = sectionData?.subtitle || "Carefully selected and thoughtfully crafted to bring joy, create meaningful connections, and make every moment feel extra special."

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
            {formatLovedGiftsTitle(title)}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Loading state: skeleton loader */}
        {showSkeleton ? (
          <ProductGridSkeleton />
        ) : (
          <>
            {/* Mobile: grid */}
            <motion.div
              className="sm:hidden grid grid-cols-2 gap-0 border-t border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {displayProducts.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                  className={
                    "border-b border-slate-200/50 dark:border-slate-800/80 " +
                    (i % 2 === 0 ? "border-r" : "")
                  }
                >
                  <ProductCard product={product} className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none" />
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop: grid */}
            <motion.div
              className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {displayProducts.map((product: any) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

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