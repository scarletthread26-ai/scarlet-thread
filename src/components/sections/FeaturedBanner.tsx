"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { useBanners } from "@/hooks/use-cms"
import { useMemo } from "react"

export function FeaturedBanner() {
  const { data: dbBanners } = useBanners()

  const featuredBanner = useMemo(() => {
    if (!dbBanners || dbBanners.length === 0) {
      return {
        badge: "Best Seller",
        title: "New Born Gift Sets",
        subtitle: "Thoughtful & adorable gifts for your little ones.",
        imageUrl: "/images/scarlet-bestseller-banner.png",
        linkUrl: "/products",
      }
    }

    // Find first active banner of type 'featured_banner'
    const fb = dbBanners.find((b) => b.is_active && b.banner_type === "featured_banner")
    if (!fb) {
      const activeAny = dbBanners.find((b) => b.is_active)
      if (!activeAny) {
        return {
          badge: "Best Seller",
          title: "New Born Gift Sets",
          subtitle: "Thoughtful & adorable gifts for your little ones.",
          imageUrl: "/images/scarlet-bestseller-banner.png",
          linkUrl: "/products",
        }
      }
      return {
        badge: "Special Offer",
        title: activeAny.title || "Featured Banner",
        subtitle: activeAny.subtitle || "",
        imageUrl: activeAny.image_url || "/images/scarlet-bestseller-banner.png",
        linkUrl: activeAny.link_url || "/products",
      }
    }

    return {
      badge: "Best Seller",
      title: fb.title || "Featured Banner",
      subtitle: fb.subtitle || "",
      imageUrl: fb.image_url || "/images/scarlet-bestseller-banner.png",
      linkUrl: fb.link_url || "/products",
    }
  }, [dbBanners])

  return (
    <section className="py-5 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          className="rounded-3xl bg-[#FDF8EB] overflow-hidden flex flex-col md:flex-row relative min-h-[400px] md:min-h-[450px] lg:min-h-[480px]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Image
              src={featuredBanner.imageUrl}
              alt={featuredBanner.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          <div className="p-8 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-end md:justify-center items-start relative z-10 mt-auto md:mt-0">
            {/* Badge */}
            <motion.div
              className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold tracking-widest text-primary uppercase mb-6 w-max"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              {featuredBanner.badge}
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            >
              {featuredBanner.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-muted-foreground mb-8 text-lg max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            >
              {featuredBanner.subtitle}
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
            >
              <Link href={featuredBanner.linkUrl}>
                <Button size="lg" className="w-max px-8 text-base shadow-md h-12 rounded-[5px]">
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}