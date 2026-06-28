"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Heart, Award, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function HeroKids() {
  return (
    <section className="relative overflow-hidden bg-[#FFF5F8] w-full py-0 md:py-16 lg:py-0 md:min-h-[500px] lg:h-[550px] flex items-start md:items-center">
      
      {/* Mobile Background Image — full bleed behind content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 md:hidden"
      >
        <img 
          src="/images/scrlet-babiesbanne.png" 
          alt="Personalized baby gifts" 
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for text readability on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F8]/85 via-[#FFF5F8]/75 to-[#FFF5F8]/90" />
      </motion.div>

      {/* Desktop Background Image (right-aligned) */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute right-0 top-0 bottom-0 h-full aspect-[1584/993] z-0 select-none pointer-events-none hidden md:block"
      >
        <img 
          src="/images/scrlet-babiesbanne.png" 
          alt="Personalized baby gifts in a premium box" 
          className="w-full h-full object-cover object-right"
        />
        {/* Gradient overlay to blend the image left edge seamlessly with the background color */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-60 bg-gradient-to-r from-[#FFF5F8] via-[#FFF5F8]/95 to-transparent z-10" />
      </motion.div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="space-y-4 sm:space-y-6 text-center md:text-left z-20 relative pt-2 pb-6 sm:py-14 md:py-0"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#6E3B9B] uppercase"
            >
              Kids & Babies <Heart className="w-3.5 h-3.5 text-[#FF69B4] fill-none stroke-[2.5]" />
            </motion.div>
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight"
            >
              Little Moments,<br />
              <span className="text-[#FF69B4]">Made Personal</span>
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0"
            >
              Adorable embroidered gifts for your little ones, stitched with love and care.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="rounded-full px-8 h-11 sm:h-12 text-sm sm:text-base shadow-lg shadow-[#6E3B9B]/20 bg-[#6E3B9B] hover:bg-[#5D2E85] text-white w-full sm:w-auto font-semibold">
                  Shop Best Sellers
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Link href="/kids-babies" className="text-[#6E3B9B] hover:text-[#5D2E85] font-semibold flex items-center justify-center gap-2 text-sm sm:text-base py-2">
                  Explore Collection 
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="pt-4 sm:pt-6 border-t border-[#F5E6EC]/60"
            >
              {/* Mobile: strict 2-column grid so badges always align */}
              <div className="grid grid-cols-2 gap-2 md:hidden">
                <div className="flex items-center gap-1.5 bg-white/80 border border-[#F5E6EC] px-2.5 py-1.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF69B4] shrink-0" />
                  <span className="text-[10px] font-semibold text-muted-foreground">Safe & Baby Friendly</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 border border-[#F5E6EC] px-2.5 py-1.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Award className="w-3.5 h-3.5 text-[#FF69B4] shrink-0" />
                  <span className="text-[10px] font-semibold text-muted-foreground">Premium Quality</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 border border-[#F5E6EC] px-2.5 py-1.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF69B4] shrink-0" />
                  <span className="text-[10px] font-semibold text-muted-foreground">Personalized Just For You</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 border border-[#F5E6EC] px-2.5 py-1.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Heart className="w-3.5 h-3.5 text-[#FF69B4] shrink-0" />
                  <span className="text-[10px] font-semibold text-muted-foreground">Made With Love</span>
                </div>
              </div>
              {/* Desktop: 2-column grid */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/80 border border-[#F5E6EC] px-3.5 py-2 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <ShieldCheck className="w-4 h-4 text-[#FF69B4] shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">Safe & Baby Friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-[#F5E6EC] px-3.5 py-2 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Award className="w-4 h-4 text-[#FF69B4] shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-[#F5E6EC] px-3.5 py-2 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Sparkles className="w-4 h-4 text-[#FF69B4] shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">Personalized Just For You</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-[#F5E6EC] px-3.5 py-2 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <Heart className="w-4 h-4 text-[#FF69B4] shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">Made With Love</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Decorative Elements (matches Occasions) */}
      <motion.div
        className="hidden md:block absolute top-10 right-20 w-40 h-40 bg-[#FF69B4]/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute -bottom-10 -right-10 w-32 h-32 md:w-48 md:h-48 bg-[#6E3B9B]/10 rounded-full blur-[60px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  )
}
