"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

interface AboutHeroProps {
  title: string;
  subtitle: string;
  description: string;
  whatsappUrl: string;
  images: string[];
}

export default function AboutHero({ title, subtitle, description, whatsappUrl, images }: AboutHeroProps) {
  const bgImage = images && images.length > 0 ? images[0] : "/images/scarlet-about.png";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="About Hero" 
          className="w-full h-full object-cover object-center" 
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 text-center text-white">
        <div className="space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 font-semibold text-sm tracking-wide select-none"
          >
            <Heart className="w-4 h-4 text-purple-400 fill-purple-400/30" />
            <span>{subtitle}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-white drop-shadow-md"
          >
            {title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1.5 w-32 bg-purple-500 rounded-full"
          />

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/90 text-sm md:text-md leading-relaxed whitespace-pre-line max-w-3xl drop-shadow-sm"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-6 justify-center w-full"
          >
            <Link 
              href="/products" 
              className={buttonVariants({ 
                variant: "default", 
                className: "rounded-full shadow-xl shadow-purple-900/20 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 w-50 py-6 h-[10] text-base md:text-lg transition-transform hover:scale-105" 
              })}
            >
              Shop Collections
            </Link>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={buttonVariants({ 
                variant: "outline", 
                className: "rounded-full border-white/30 font-bold bg-white/5 backdrop-blur-sm text-white px-8 py-6 h-[10] w-50 text-base md:text-lg transition-transform hover:scale-105" 
              })}
            >
              Discuss on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
