"use client"

// ---------------------------------------------------------------------------
// CommonHero — shared hero section used by:
//   • Gifts for Him  (HeroHim.tsx)
//   • Gifts for Her  (HeroHer.tsx)
//   • Kids & Babies  (HeroKids.tsx)
//
// The home-page Hero (Hero.tsx) has a different layout (slideshow + feature
// bar) and is intentionally kept separate.
// ---------------------------------------------------------------------------

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { staggerContainer, fadeUp } from "@/lib/animations"
import { FloatingFeatureBar } from "./FloatingFeatureBar"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommonHeroProps {
  /** Eyebrow text displayed above the h1 */
  eyebrow: string
  /** Small animated icon shown before eyebrow text */
  eyebrowIcon?: React.ReactNode
  /** Accent color (hex) used for eyebrow, icon tint, h1 accent word, and buttons */
  accentColor: string
  /** Full title string — the last word (or last word after a comma-break) is rendered in accentColor */
  title: string
  /** Optional custom title formatter — overrides the default last-word accent logic */
  formatTitle?: (title: string) => React.ReactNode
  /** Main subtitle paragraph */
  subtitle: string
  /** Optional second paragraph beneath the subtitle */
  bodyText?: string
  /** URL for the primary CTA button */
  primaryHref: string
  /** Label for the primary CTA button */
  primaryLabel?: string
  /** URL for the secondary outline CTA button */
  secondaryHref: string
  /** Label for the secondary outline CTA button */
  secondaryLabel?: string

  /** Desktop/tablet background image src */
  desktopImage: string
  /** Mobile background image src */
  mobileImage: string
  /** Alt text for background image */
  imageAlt?: string
  /** Background color (CSS value) used before image loads and for gradient blend */
  bgColor?: string
  /** Blob color (hex) for floating decorative elements — falls back to accentColor */
  blobColor?: string
}

// ---------------------------------------------------------------------------
// Default title formatter — highlights the last word in accentColor
// ---------------------------------------------------------------------------
function defaultFormatTitle(title: string, accentColor: string): React.ReactNode {
  if (!title) return ""
  const commaParts = title.split(",")
  if (commaParts.length > 1) {
    const firstPart = commaParts[0] + ","
    const rest = commaParts.slice(1).join(",").trim()
    const words = rest.split(" ")
    const lastWord = words[words.length - 1]
    const remaining = words.slice(0, -1).join(" ")
    return (
      <>
        {firstPart}
        <br />
        {remaining} <span style={{ color: accentColor }}>{lastWord}</span>
      </>
    )
  }
  const words = title.split(" ")
  if (words.length > 1) {
    const lastWord = words[words.length - 1]
    const remaining = words.slice(0, -1).join(" ")
    return (
      <>
        {remaining} <span style={{ color: accentColor }}>{lastWord}</span>
      </>
    )
  }
  return title
}


// ---------------------------------------------------------------------------
// CommonHero
// ---------------------------------------------------------------------------
export function CommonHero({
  eyebrow,
  eyebrowIcon,
  accentColor,
  title,
  formatTitle,
  subtitle,
  bodyText,
  primaryHref,
  primaryLabel = "Shop Best Sellers",
  secondaryHref,
  secondaryLabel = "Explore Collection",
  desktopImage,
  mobileImage,
  imageAlt = "Hero image",
  bgColor = "#FFF7FD",
  blobColor,
}: CommonHeroProps) {
  const blob = blobColor ?? accentColor

  const renderedTitle = formatTitle
    ? formatTitle(title)
    : defaultFormatTitle(title, accentColor)

  return (
    <section
      className="relative h-[100svh] md:h-auto md:py-6 mb-16 md:mb-20"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Background Wrapper (clips scaled images and blobs) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* ── Desktop background image ── */}
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 hidden md:block"
        >
          <img
            src={desktopImage}
            alt={imageAlt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* ── Mobile background image ── */}
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 md:hidden"
        >
          <img
            src={mobileImage}
            alt={imageAlt}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* ── Mobile-only white gradient overlay on the background ── */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />

        {/* ── Floating decorative blobs ── */}
        <motion.div
          className="hidden md:block absolute top-10 right-20 w-40 h-40 rounded-full blur-[80px]"
          style={{ backgroundColor: `${blob}33` }}
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 md:w-48 md:h-48 rounded-full blur-[60px]"
          style={{ backgroundColor: `${blob}26` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={staggerContainer(0.2)}
        initial="hidden"
        animate="show"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10 h-full"
      >
        <div className="flex flex-col md:flex-row items-end md:items-center gap-12 h-[100svh] md:h-auto md:min-h-[500px]">
          {/* Left content */}
          <div className="flex-1 text-left pb-24 sm:pb-32 md:pb-0 md:py-0 flex flex-col justify-end md:justify-center h-full">

            <motion.div
              variants={fadeUp(0.8, 40)}
              className="inline-block text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: accentColor }}
            >
              <div className="flex items-center gap-1.5">
                {eyebrowIcon && (
                  <motion.div
                    animate={{ y: [0, -6, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {eyebrowIcon}
                  </motion.div>
                )}
                <span>{eyebrow}</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp(0.8, 40)}
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 md:mb-5 leading-tight"
            >
              {renderedTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp(0.8, 40)}
              className="text-sm md:text-base text-muted-foreground mb-4 max-w-md"
            >
              {subtitle}
            </motion.p>

            {/* Optional body text */}
            {/* {bodyText && (
              <motion.p
                variants={fadeUp(0.8, 40)}
                className="hidden md:block text-sm text-foreground/80 mb-6 max-w-md"
              >
                {bodyText}
              </motion.p>
            )} */}

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp(0.8, 40)}
              className="mb-6 md:mb-10 flex flex-wrap items-center gap-2.5"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={primaryHref}
                  className="inline-flex h-10 md:h-11 items-center rounded-full px-6 text-[0.78rem] md:text-sm font-bold text-white shadow transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                  style={{ backgroundColor: accentColor }}
                >
                  {primaryLabel}
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="hidden md:block">
                <Link
                  href={secondaryHref}
                  className="inline-flex h-10 md:h-11 items-center rounded-full border bg-white/60 px-6 text-[0.78rem] md:text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:bg-white hover:-translate-y-px active:translate-y-0"
                  style={{
                    borderColor: `${accentColor}99`,
                    color: accentColor,
                  }}
                >
                  {secondaryLabel}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>


          </div>

          {/* Empty right side — preserves layout so the image shows through */}
          <div className="flex-1 hidden md:block" />
        </div>
      </motion.div>

      {/* ── Floating Feature Bar ── */}
      <FloatingFeatureBar />
    </section>
  )
}
