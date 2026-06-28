"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import { useCategories } from "@/hooks/use-categories"
import { useMemo } from "react"

const categories = [
  { id: "1", name: "Gifts for Him", icon: "/images/scarlet-gift1.png", href: "/gifts-for-him", bgColor: "#E0F2FE"},
  { id: "2", name: "Gifts for Her", icon: "/images/scarlet-gift2.png", href: "/gifts-for-her",bgColor: "#FCE7F3" },
  { id: "3", name: "Kids & Babies", icon: "/images/scarlet-gift3.png", href: "/kids-babies",bgColor: "#FEF3C7" },
  { id: "5", name: "Couple Gifts", icon: "/images/scarlet-couple.png", href: "/corporate",bgColor: "#FEE2E2" },
  { id: "6", name: "Faith Based", icon: "/images/scarlet-faith.png", href: "/custom",bgColor: "#E8D5C4" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function Categories() {
  const { data: dbCategories } = useCategories()

  const displayedCategories = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return categories
    }

    const bgColors = ["#E0F2FE", "#FCE7F3", "#FEF3C7", "#FEE2E2", "#E8D5C4"]
    // Map static items icons if names match, for nice icons
    const staticIconMap: Record<string, string> = {
      "gifts for him": "/images/scarlet-gift1.png",
      "gifts for her": "/images/scarlet-gift2.png",
      "kids & babies": "/images/scarlet-gift3.png",
      "couple gifts": "/images/scarlet-couple.png",
      "faith based": "/images/scarlet-faith.png",
    }

    return dbCategories
      .filter((cat) => cat.is_active !== false)
      .map((cat, idx) => {
        let href = `/products`
        if (cat.slug === "gifts-for-him") href = "/gifts-for-him"
        else if (cat.slug === "gifts-for-her") href = "/gifts-for-her"
        else if (cat.slug === "kids-babies") href = "/kids-babies"
        else if (cat.slug === "corporate-gifts" || cat.slug === "corporate") href = "/corporate"
        else href = `/products?category=${cat.slug}`

        const nameLower = cat.name.toLowerCase()
        const matchedIcon = staticIconMap[nameLower] || cat.image_url || "/images/scarlet-gift1.png"

        return {
          id: cat.id,
          name: cat.name,
          icon: matchedIcon,
          href,
          bgColor: bgColors[idx % bgColors.length],
        }
      })
  }, [dbCategories])

  return (
    <section className="py-5 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        <motion.div
          className="text-center mb-6 md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Discover thoughtfully crafted products that make every celebration, milestone, and special moment truly unforgettable.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {displayedCategories.map((category) => (
            <motion.div key={category.id} variants={cardVariants}>
               <Link
                href={category.href}
                className="flex flex-col items-center text-center py-3 px-2 space-y-3 bg-white border border-gray-200 shadow-lg rounded-2xl group"
              >
                <div
                  style={{ backgroundColor: category.bgColor }}
                  className="w-full md:w-40 h-24 md:h-40 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden p-3"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="font-sans font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}