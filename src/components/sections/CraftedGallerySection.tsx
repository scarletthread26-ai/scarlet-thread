"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { scaleUp, staggerContainer, fadeUp } from "@/lib/animations"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface GalleryImage {
  image: string
  alt?: string
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
}: CraftedGallerySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<{ id: string; media_url: string; title?: string }[]>([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // ── Fetch gallery images ─────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/gallery?category=${category}`)
        if (res.ok) {
          const data = await res.json()
          setImages(data)
        }
      } catch (err) {
        console.error(`Error loading ${category} gallery images:`, err)
      }
    }
    load()
  }, [category])

  // ── Build display list (merge with fallback when sparse) ─────────────────
  const displayImages: GalleryImage[] = (() => {
    const fromApi = images
      .filter((img) => img.media_url)
      .map((img) => ({ image: img.media_url, alt: img.title ?? "Gallery image" }))

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

  // ── Scroll helpers ───────────────────────────────────────────────────────
  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })

  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })

  return (
    <section className={`pt-2 pb-10 sm:py-16 overflow-hidden`}>
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
          className="md:text-center  text-start mb-8 sm:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold inline-flex items-center md:justify-center gap-2">
            {heading}
            {/* <motion.span
              animate={{ scale: [1, 1.3, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <Heart className="w-5 h-5 text-primary fill-transparent" />
            </motion.span> */}
          </h2>
        </motion.div>

        {/* ── Carousel ────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Prev button — desktop only */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
            className="hidden md:flex absolute left-[-22px] top-1/2 -translate-y-1/2 z-20
              w-10 h-10 rounded-full bg-white shadow-md items-center justify-center
              hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Next button — desktop only */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            disabled={!canScrollRight}
            className="hidden md:flex absolute right-[-22px] top-1/2 -translate-y-1/2 z-20
              w-10 h-10 rounded-full bg-white shadow-md items-center justify-center
              hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/*
           * Scroll track
           * Mobile : finger-scroll, no buttons, peek of ~half the 3rd card via card width
           * Desktop: arrow-button driven, cards at fixed width
           */}
          <motion.div
            ref={scrollRef}
            onScroll={updateScrollState}
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-30px" }}
            className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 hide-scrollbar scroll-smooth snap-x snap-mandatory"
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
                className={`relative shrink-0 snap-start rounded-2xl overflow-hidden
                  shadow-sm hover:shadow-md transition-all duration-300 group ${cardBg}
                  w-[calc((100vw-2rem-0.75rem)/2.4)]
                  md:w-[220px] lg:w-[240px]
                  aspect-square`}
              >
                <Image
                  src={img.image}
                  alt={img.alt ?? "Gallery image"}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 220px, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
          <Link href={galleryHref}>
            <Button
              size="sm"
              className="rounded-[10px] h-13 px-5 bg-primary text-white hover:bg-primary/90"
            >
              View More Creations
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
