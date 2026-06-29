"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Heart, Award } from "lucide-react"
import { motion } from "framer-motion"

function formatKidsTitle(titleStr: string) {
  if (!titleStr) return "";
  const lower = titleStr.toLowerCase();
  if (lower === "little moments, made personal") {
    return (
      <>
        Little Moments,<br />
        <span className="text-[#FF69B4]">Made Personal</span>
      </>
    );
  }
  
  // If title has a comma, break there
  const parts = titleStr.split(",");
  if (parts.length > 1) {
    const firstPart = parts[0] + ",";
    const secondPart = parts.slice(1).join(",");
    const words = secondPart.trim().split(" ");
    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      const remaining = words.slice(0, -1).join(" ");
      return (
        <>
          {firstPart}<br />
          {remaining} <span className="text-[#FF69B4]">{lastWord}</span>
        </>
      );
    }
  }

  // Fallback split by space
  const words = titleStr.split(" ");
  if (words.length > 1) {
    const lastWord = words[words.length - 1];
    const remaining = words.slice(0, -1).join(" ");
    return (
      <>
        {remaining} <span className="text-[#FF69B4]">{lastWord}</span>
      </>
    );
  }

  return titleStr;
}

export function HeroKids() {
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/homepage-sections?key=kids-babies");
        if (res.ok) {
          const json = await res.json();
          if (json) {
            setSectionData(json);
          }
        }
      } catch (err) {
        console.warn("Failed to load kids-babies hero settings:", err);
      }
    }
    loadData();
  }, []);

  const title = sectionData?.title || "Little Moments, Made Personal";
  const subtitle = sectionData?.subtitle || "Adorable embroidered gifts for your little ones, stitched with love and care.";
  const desktopImage = sectionData?.content?.image_desktop || "/images/scrlet-babiesbanne.png";
  const mobileImage = sectionData?.content?.image_mobile || "/images/scrlet-babiesbanne.png";

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
          src={mobileImage} 
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
          src={desktopImage} 
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
              {formatKidsTitle(title)}
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0"
            >
              {subtitle}
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="mb-6 md:mb-8 flex flex-wrap items-center justify-center md:justify-start gap-2.5"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/products"
                  className="inline-flex h-10 md:h-11 items-center justify-center rounded-full bg-[#6E3B9B] px-6 text-[0.78rem] md:text-sm font-bold text-white shadow transition-all duration-200 hover:bg-[#5D2E85] hover:-translate-y-px active:translate-y-0"
                >
                  Shop Best Sellers
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/products?category=kids-babies"
                  className="inline-flex h-10 md:h-11 items-center rounded-full border border-[#6E3B9B]/60 bg-white/60 px-6 text-[0.78rem] md:text-sm font-semibold text-[#6E3B9B] backdrop-blur-sm transition-all duration-200 hover:bg-white hover:-translate-y-px active:translate-y-0"
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
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs font-medium text-[#444]"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-2 md:py-2.5 text-[0.7rem] md:text-xs font-medium text-[#444] shadow-sm backdrop-blur-sm">
                <span className="text-[#FF69B4]"><ShieldCheck className="h-3.5 w-3.5" /></span>
                Safe & Baby Friendly
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-2 md:py-2.5 text-[0.7rem] md:text-xs font-medium text-[#444] shadow-sm backdrop-blur-sm">
                <span className="text-[#FF69B4]"><Award className="h-3.5 w-3.5" /></span>
                Premium Quality
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-2 md:py-2.5 text-[0.7rem] md:text-xs font-medium text-[#444] shadow-sm backdrop-blur-sm">
                <span className="text-[#FF69B4]"><Heart className="h-3.5 w-3.5" /></span>
                Made With Love
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
