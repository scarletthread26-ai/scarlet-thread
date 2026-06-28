"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star, Heart } from "lucide-react"
import { staggerContainer, fadeUp } from "@/lib/animations"

export function HeroHer() {
  const line1 = "Made for Her,"

  return (
    <section className="relative bg-[#fce8ec] py-6 md:py-6 overflow-hidden">
      {/* Background Image — Desktop */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 hidden md:block"
      >
        <Image
          src="/images/forher/scarlet-forherbanner-image.png"
          alt="Personalized gifts for her — premium embroidered set"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Background Image — Mobile */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 md:hidden"
      >
        <Image
          src="/images/forher/scarlet-forhermobile.png"
          alt="Personalized gifts for her — premium embroidered set"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </motion.div>

      {/* Sophisticated Overlay for better visibility (matches Occasions) */}
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white/95 via-white/80 md:from-white/70 md:via-white/30 to-white/20 md:to-transparent backdrop-blur-[1px] md:backdrop-blur-none pointer-events-none" />

      <motion.div
        variants={staggerContainer(0.2)}
        initial="hidden"
        animate="show"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 min-h-[360px] md:min-h-[500px]">
          {/* Left Content */}
          <div className="flex-1 text-left py-10 sm:py-14 md:py-0">
            <motion.div
              variants={fadeUp(0.8, 40)}
              className="inline-block text-[10px] font-semibold tracking-widest text-[#c0004e] uppercase mb-3"
            >
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Heart className="h-3 w-3 fill-[#c0004e] text-[#c0004e]" />
                </motion.div>
                <span>Gifts For Her</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.8, 40)}
              className="text-3xl md:text-5xl lg:text-6xl font-sans font-extrabold text-[#111] mb-4 md:mb-5 leading-tight"
            >
              {line1}
              <br />
              <span className="text-[#c0004e]">Personalized</span>
              <br />
              with Love
            </motion.h1>

            <motion.p
              variants={fadeUp(0.8, 40)}
              className="text-sm md:text-base text-[#666] mb-6 max-w-md"
            >
              Thoughtful, personalized &amp; embroidered gifts that celebrate the
              most special women in your life.
            </motion.p>

            <motion.div
              variants={fadeUp(0.8, 40)}
              className="mb-6 flex flex-wrap items-center gap-2.5"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/gifts-for-her"
                  className="inline-flex h-10 md:h-11 items-center rounded-full bg-[#c0004e] px-6 text-[0.78rem] md:text-sm font-bold text-white shadow transition-all duration-200 hover:bg-[#a0003f] hover:-translate-y-px active:translate-y-0"
                >
                  Shop Best Sellers
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/gifts-for-her"
                  className="inline-flex h-10 md:h-11 items-center rounded-full border border-[#c0004e]/60 bg-white/60 px-6 text-[0.78rem] md:text-sm font-semibold text-[#c0004e] backdrop-blur-sm transition-all duration-200 hover:bg-white hover:-translate-y-px active:translate-y-0"
                >
                  Explore Collection
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="inline-block"
                  >
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp(0.8, 40)}
              className="flex flex-wrap items-center justify-start gap-3 md:gap-4 text-xs font-medium text-[#444]"
            >
              <TrustBadge icon={<Sparkles className="h-3 w-3" />} label="Personalized &amp; Unique" />
              <TrustBadge icon={<Star className="h-3 w-3" />} label="Premium Quality" />
              <TrustBadge icon={<Heart className="h-3 w-3" />} label="Embroidered Items" />
            </motion.div>
          </div>

          {/* Empty Right Side - Preserves Layout */}
          <div className="flex-1 hidden md:block" />
        </div>
      </motion.div>

      {/* Floating Decorative Elements (matches Occasions) */}
      <motion.div
        className="hidden md:block absolute top-10 right-20 w-40 h-40 bg-[#c0004e]/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute -bottom-10 -right-10 w-32 h-32 md:w-48 md:h-48 bg-[#c0004e]/10 rounded-full blur-[60px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  )
}

/* ── Helper ── */
function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-2 md:py-2.5 text-[0.7rem] md:text-xs font-medium text-[#444] shadow-sm backdrop-blur-sm">
      <span className="text-[#c0004e]">{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  )
}
