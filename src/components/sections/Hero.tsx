"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useHeroSlides } from "@/hooks/use-cms"
import { FloatingFeatureBar } from "./FloatingFeatureBar"

// Memoize FloatingFeatureBar to prevent unnecessary repaints on slide transition
const MemoizedFloatingFeatureBar = React.memo(FloatingFeatureBar)

// Modern CSS-driven fade/slide text variants for slide changes
const textVariants = {
  hidden: (prefersReducedMotion: boolean) => ({
    opacity: 0,
    y: prefersReducedMotion ? 0 : 15,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: (prefersReducedMotion: boolean) => ({
    opacity: 0,
    y: prefersReducedMotion ? 0 : -15,
    transition: { duration: 0.3, ease: "easeIn" as const },
  }),
}

function Dots({ total, active, onChange }: { total: number; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Slideshow Indicators">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onChange(i)}
          className={`rounded-full transition-all duration-300 ${i === active
            ? "bg-primary w-5 h-2"
            : "bg-primary/30 hover:bg-primary/60 w-2 h-2"
            }`}
        />
      ))}
    </div>
  )
}

function formatHeroTitle(titleStr: string | null) {
  if (!titleStr) return ""

  const lower = titleStr.toLowerCase()
  if (lower.includes("more than a gift") && lower.includes("memory in the making")) {
    return (
      <>
        <span className="block whitespace-nowrap">More Than a Gift.</span>
        <span className="block text-primary">
          A Memory in the <span>Making</span>.
        </span>
      </>
    )
  }

  const parts = titleStr.split(". ")
  if (parts.length > 1) {
    const firstPart = parts[0] + "."
    const secondPart = parts.slice(1).join(". ")
    const words = secondPart.split(" ")
    if (words.length > 0) {
      const lastWord = words[words.length - 1]
      const remainingWords = words.slice(0, -1).join(" ")
      return (
        <>
          {firstPart} <br />
          {remainingWords} <span className="text-primary italic">{lastWord}</span>
        </>
      )
    }
  }

  const words = titleStr.split(" ")
  if (words.length > 1) {
    const lastWord = words[words.length - 1]
    const remainingWords = words.slice(0, -1).join(" ")
    return (
      <>
        {remainingWords} <span className="text-primary italic">{lastWord}</span>
      </>
    )
  }

  return titleStr
}

function formatDescription(text: string | null) {
  if (!text) return null
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

const FALLBACK_SLIDES = [
  {
    id: "fallback-0",
    desktopBg: "/images/forhimpage/scarlet-forhimbanner.png",
    tabletImg: "/images/forhimpage/scarlet-forhimbanner.png",
    mobileImg: "/images/forhimpage/forhim-mobile-banner.png",
    ctaLink: "/products",
    title: "More Than a Gift. A Memory in the Making",
    subtitle: "Whether you're celebrating someone special or treating yourself, make it uniquely personal.",
    buttonText: "Shop Collection",
  }
]

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const { data: rawSlides, isLoading, isError } = useHeroSlides()

  // Map CMS data or fallback dynamically, preventing above-the-fold visual delays
  const slides = useMemo(() => {
    if (isLoading || isError || !rawSlides || rawSlides.length === 0) {
      return FALLBACK_SLIDES
    }
    const active = rawSlides.filter((slide) => slide.is_active)
    if (active.length === 0) return FALLBACK_SLIDES
    return active.map((slide) => ({
      id: slide.id,
      desktopBg: slide.image_desktop,
      tabletImg: slide.image_desktop,
      mobileImg: slide.image_mobile || slide.image_desktop,
      ctaLink: slide.button_link || "/products",
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      buttonText: slide.button_text || "Shop Collection",
    }))
  }, [rawSlides, isLoading, isError])

  const [current, setCurrent] = useState(0)

  // Configure Embla Autoplay options once
  const autoplayOptions = useMemo(() => ({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  }), [])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 35 },
    [Autoplay(autoplayOptions)]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrent(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  const handleDotClick = useCallback((index: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo(index)
  }, [emblaApi])

  // Keyboard accessibility arrow controls
  useEffect(() => {
    if (!emblaApi) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi.scrollPrev()
      if (e.key === "ArrowRight") emblaApi.scrollNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [emblaApi])

  const slide = slides[current] || FALLBACK_SLIDES[0]
  const heroTitle = slide.title || "More Than a Gift. A Memory in the Making"
  const heroSubtitle = slide.subtitle || "Whether you're celebrating someone special or treating yourself, make it uniquely personal."

  return (
    <section
      className="relative w-full h-[600px] lg:min-h-[640px] lg:h-[80vh] lg:max-h-[850px] flex flex-col lg:flex-row lg:items-center"
      aria-label="Promotional Hero Showcase"
      role="region"
    >
      {/* ── GPU-Accelerated Embla Background Slider ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className="relative flex-none w-full h-full select-none"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${slides.length}`}
            >
              {/* Desktop background image (lg+) */}
              <div className="hidden lg:block absolute inset-0">
                <Image
                  src={s.desktopBg}
                  alt={s.title || "Hero Background"}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-cover object-right"
                  decoding="async"
                />
              </div>

              {/* Tablet background image (sm to lg) */}
              <div className="hidden sm:block lg:hidden absolute inset-0">
                <Image
                  src={s.tabletImg}
                  alt={s.title || "Hero Background"}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-cover object-center"
                  decoding="async"
                />
              </div>

              {/* Mobile background image (< sm) */}
              <div className="block sm:hidden absolute inset-0">
                <Image
                  src={s.mobileImg}
                  alt={s.title || "Hero Background"}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-cover object-center"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Layout Overlay (≤ lg) ── */}
      <div className="lg:hidden relative z-20 w-full h-full flex flex-col justify-start pt-32 px-5 sm:px-10 sm:pt-40 pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            custom={prefersReducedMotion}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-start space-y-2 w-full max-w-md pointer-events-auto"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span>For Every Moment That Matters</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-left leading-tight tracking-tight max-w-full">
              {formatHeroTitle(heroTitle)}
            </h1>

            <p className="text-[13px] text-muted-foreground text-left max-w-xs">
              {formatDescription(heroSubtitle)}
            </p>

            <div className="pt-1 flex flex-col items-start gap-3 w-full">
              <Link href="/products">
                <Button size="lg" className="text-base h-12 px-8 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-md transition-all">
                  Shop Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots — hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:flex mt-6 justify-start pointer-events-auto">
          <Dots total={slides.length} active={current} onChange={handleDotClick} />
        </div>
      </div>

      {/* ── Desktop Layout Overlay (≥ lg) ── */}
      <div className="hidden lg:block w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-20 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-5 z-20 relative pointer-events-auto">
            {/* Decorative hearts */}
            <div className="absolute -top-8 left-[32%] w-5 h-5 text-pink-400 opacity-70 transform rotate-12 animate-pulse hidden md:block">
              <HeartIcon />
            </div>
            <div className="absolute top-[42%] -right-8 w-6 h-6 text-pink-400 opacity-70 transform -rotate-12 animate-pulse hidden md:block">
              <HeartIcon />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
              <span>For Every Moment That Matters</span>
            </div>

            {/* Animated content block */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                custom={prefersReducedMotion}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  {formatHeroTitle(heroTitle)}
                </h1>

                <div className="w-12 h-[2px] bg-primary/50" />

                <p className="text-sm text-muted-foreground max-w-md whitespace-pre-line">
                  {formatDescription(heroSubtitle)}
                </p>

                <div className="flex items-center gap-6 pt-2">
                  <Link href="/products">
                    <Button size="lg" className="text-base h-12 px-8 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-md transition-all">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="pt-1">
              <Dots total={slides.length} active={current} onChange={handleDotClick} />
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <MemoizedFloatingFeatureBar />
    </section>
  )
}