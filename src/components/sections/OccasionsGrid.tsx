"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { staggerContainer, cardPerspective } from "@/lib/animations"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface OccasionItem {
  id: string
  title: string
  description: string
  bgColor: string
  titleColor: string
  image: string
  href?: string
}

export interface OccasionsGridProps {
  occasions: OccasionItem[]
  /** Section heading — shown above the grid */
  heading?: React.ReactNode
  /** Show the animated heart icon next to the heading */
  showHeartIcon?: boolean
}

// ---------------------------------------------------------------------------
// OccasionsGrid — shared by Gifts for Him / Her / Kids & Babies
// ---------------------------------------------------------------------------
export function OccasionsGrid({
  occasions,
  heading = "Gifts For Every Occasion",
  showHeartIcon = true,
}: OccasionsGridProps) {
  return (
    <section className="pb-10 sm:py-14 bg-white overflow-hidden perspective-1000">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            {heading}
          </h2>
          {/* {showHeartIcon && (
              <motion.span
                animate={{ scale: [1, 1.25, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Heart className="w-5 h-5 text-primary fill-transparent" />
              </motion.span>
            )} */}
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {occasions.map((occ) => (
            <Link key={occ.id} href={occ.href ?? "/products"} className="block h-full">
              <motion.div
                variants={cardPerspective}
                className={`${occ.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full min-h-[180px] sm:min-h-[210px] md:min-h-[210px] cursor-pointer`}
              >
                {/* ── Text content — left column, max 60% wide so image has room ── */}
                <div className="relative z-10 flex flex-col w-[65%] sm:w-[60%]">
                  <h3 className={`font-bold text-sm sm:text-base md:text-lg leading-tight mb-1.5 sm:mb-2 whitespace-nowrap ${occ.titleColor}`}>
                    {occ.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-4 sm:mb-5 md:mb-6 line-clamp-2">
                    {occ.description}
                  </p>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors">
                    Shop Now <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                {/* ── Image — absolute bottom-right ── */}
                <div className="absolute right-1 bottom-5 w-[48%] sm:w-[45%] aspect-square translate-y-3">
                  <Image
                    src={occ.image}
                    alt={occ.title}
                    fill
                    sizes="(max-width: 640px) 90px, (max-width: 1024px) 120px, 150px"
                    className="object-contain object-right-bottom"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function OccasionsGridSkeleton() {
  return (
    <section className="pb-10 sm:py-14 bg-white overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-64 h-8 bg-slate-200 dark:bg-slate-800 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 relative overflow-hidden flex flex-col h-full min-h-[180px] sm:min-h-[210px] md:min-h-[210px] animate-pulse"
            >
              <div className="w-[65%] sm:w-[60%]">
                <div className="w-full h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="absolute right-1 bottom-5 w-[48%] sm:w-[45%] aspect-square translate-y-3 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
