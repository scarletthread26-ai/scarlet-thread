"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { scaleUp, staggerContainer, fadeUp } from "@/lib/animations"
import { useProducts } from "@/hooks/use-products"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface GalleryImage {
  image: string
  alt?: string
  id?: string
}

export interface CraftedGallerySectionProps {
  /** Section heading text */
  heading: React.ReactNode
  /** API category query param e.g. "him" | "her" | "kids" */
  category: string
  /** Link href for "View More Creations" button */
  galleryHref: string
  /** Fallback images used when the API returns nothing */
  fallbackImages: GalleryImage[]
  /** Background colour class for the section, e.g. "bg-white" */
  bgColor?: string
  /** Card background colour class, e.g. "bg-[#f8f4f1]" */
  cardBg?: string
  /** Minimum images before mixing in fallbacks (default 5) */
  minImages?: number
  /** Optional description text displayed below the heading */
  description?: React.ReactNode
}

// ---------------------------------------------------------------------------
// CraftedGallerySection — shared by Him / Her / Kids & Babies
// ---------------------------------------------------------------------------
export function CraftedGallerySection({
  heading,
  category,
  galleryHref,
  fallbackImages,
  bgColor = "bg-white",
  cardBg = "bg-white",
  minImages = 5,
  description,
}: CraftedGallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: dbProducts = [], isLoading } = useProducts()

  // ── Build display list (merge with fallback when sparse) ─────────────────
  const displayImages: GalleryImage[] = (() => {
    if (isLoading) return fallbackImages;

    const filteredProducts = dbProducts.filter((p: any) => {
      if (category === "all") return true;
      if (!p.categories?.name) return false;
      const catName = p.categories.name.toLowerCase();
      if (category === "her" && catName.includes("her")) return true;
      if (category === "him" && catName.includes("him")) return true;
      if (category === "kids" && (catName.includes("kid") || catName.includes("bab"))) return true;
      if (category === "occasions" && catName.includes("occasion")) return true;
      return false;
    });

    const fromApi = filteredProducts
      .filter((p: any) => p.images && p.images.length > 0)
      .map((p: any) => ({
        image: p.images[0].url,
        alt: p.name,
        id: p.slug || p.id
      }))
      .slice(0, 5)

    if (fromApi.length === 0) return fallbackImages
    if (fromApi.length < minImages) {
      const merged: GalleryImage[] = [...fromApi]
      const needed = minImages - fromApi.length
      for (let i = 0; i < needed; i++) {
        merged.push(fallbackImages[i % fallbackImages.length])
      }
      return merged
    }
    return fromApi
  })()

  return (
    <section className={`pt-10 pb-10 sm:py-16 overflow-hidden`}>
      <motion.div
        variants={scaleUp(1.02, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16"
      >
        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold inline-flex items-center md:justify-center gap-2">
            {heading}
          </h2>
          {description && (
            <div className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {description}
            </div>
          )}
        </motion.div>

        {/* ── Carousel ────────────────────────────────────────────────────── */}
        <div className="relative ">
          <motion.div
            ref={scrollRef}
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-30px" }}
            className="flex overflow-x-auto gap-3 sm:gap-4 pt-4 -mt-4 pb-4 hide-scrollbar scroll-smooth snap-x snap-mandatory px-1"
          >
            {displayImages.map((img, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.5, 18)}
                /*
                 * Mobile card width = (100vw - padding - gaps) / 2.4
                 *   → ~2 full cards + half a third card visible → peek effect
                 * md+  : fixed 220-240 px
                 */
                className={`relative shrink-0 snap-start rounded-tr-3xl rounded-bl-3xl  overflow-hidden 
                  shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 group ${cardBg}
                  w-[calc((100vw-2rem-0.75rem)/2.4)]
                  md:w-[240px] lg:w-[260px]
                  aspect-square`}
              >
                <Link href={img.id ? `/product/${img.id}` : "#"} className="block w-full h-full">
                  <Image
                    src={img.image}
                    alt={img.alt ?? "Gallery image"}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 240px, 260px"
                    className="object-cover"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-center mt-6"
        >
          <Link href={`/products?category=${category}`}>
            <Button
              size="sm"
              className="rounded-[10px] h-13 px-5 bg-primary text-white hover:bg-primary/90"
            >
              View More Collection
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }}
      />
    </section>
  )
}
