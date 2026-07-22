"use client";

import { User, Gift, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHomepageSection } from "@/hooks/use-cms";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ForEveryOccasion() {
  const { data: section } = useHomepageSection("occasions");
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState<{ id: string, title: string, href?: string, slug?: string } | null>(null);

  const headingStr = section?.content?.heading || "For Every Occasion";
  const description = section?.content?.description || "Discover thoughtfully curated gifts perfect for every celebration and milestone, making your special moments even more memorable.";
  const cards = section?.content?.cards || [];

  // Split heading to color the last word
  const words = headingStr.split(" ");
  const lastWord = words.pop();
  const firstPart = words.join(" ");

  return (
    <section className=" pb-5  bg-white overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-5 sm:mb-10 text-center"
        >
          <h2 className="text-[28px] md:text-2xl lg:text-3xl font-heading font-bold text-foreground text-center mb-2 sm:mb-3">
            {firstPart} {firstPart && <span className="text-primary">{lastWord}</span>}
            {!firstPart && <span className="text-primary">{lastWord}</span>}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {cards.map((occ: any, index: number) => {
            const isSpecialOccasion = occ.cursiveText?.toLowerCase() === "anniversary" || occ.cursiveText?.toLowerCase() === "birthday";
            
            return (
            <motion.div
              key={occ.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={isSpecialOccasion ? "#" : occ.href} 
                className="block group"
                onClick={(e) => {
                  if (isSpecialOccasion) {
                    e.preventDefault();
                    
                    let slug = "";
                    try {
                      const urlStr = occ.href || "";
                      if (urlStr.includes("?")) {
                         const searchParams = new URLSearchParams(urlStr.split("?")[1]);
                         slug = searchParams.get("subcategory") || searchParams.get("category") || "";
                      } else {
                         slug = occ.cursiveText?.toLowerCase().replace(/\s+/g, '-') || "";
                      }
                    } catch (err) {
                      slug = occ.cursiveText?.toLowerCase().replace(/\s+/g, '-') || "";
                    }

                    setSelectedOccasion({ 
                      id: occ.id, 
                      title: `${occ.cursiveText} ${occ.mainText}`,
                      href: occ.href,
                      slug: slug
                    } as any);
                  }
                }}
              >
                <div className="relative w-full h-[160px] sm:h-[240px] md:h-[200px] rounded-2xl overflow-hidden duration-300">
                  {/* Background Image */}
                  <Image
                    src={occ.image}
                    alt={`${occ.cursiveText} ${occ.mainText}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 50vw, 50vw"
                  />
                  {/* Text Overlay */}
                  <div className="absolute bottom-3 left-4 sm:bottom-6 sm:left-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-[10%] flex flex-col text-left pointer-events-none z-10">
                    <span className="font-cursive text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-[0.5] sm:leading-[0.5] md:leading-[0.5] -mb-2 sm:-mb-3 md:-mb-4 -ml-1">
                      {occ.cursiveText}
                    </span>
                    <span className="font-bold text-2xl sm:text-2xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-none capitalize pl-1 sm:pl-2 pt-6">
                      {occ.mainText}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={!!selectedOccasion} onOpenChange={(open) => !open && setSelectedOccasion(null)}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] overflow-hidden rounded-[24px] p-4 sm:p-6 border-0 shadow-2xl bg-[#FCFAFF]">
          {/* Subtle background glow/patterns (simulated) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[24px]">
             <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl" />
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Top Tag */}
            <div className="flex items-center justify-center gap-1.5 text-purple-700 font-semibold text-xs mb-2 mt-2">
              <span className="text-purple-400">♥</span>
              <Gift className="w-3.5 h-3.5" />
              <span>{selectedOccasion?.title}</span>
              <span className="text-purple-400">♥</span>
            </div>

            <DialogHeader className="space-y-1.5 mb-4">
              <DialogTitle className="text-2xl sm:text-[32px] leading-tight font-bold text-[#1a1f36] max-w-[400px] mx-auto">
                Choose who you're <span className="text-primary"> shopping for</span>
              </DialogTitle>
              <p className=" font-medium text-[12px] max-w-[340px] mx-auto leading-relaxed">
                We'll show you the most relevant gifts for your selection.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-4">
              {/* For Him Card */}
              <button
                onClick={() => {
                  const url = `/products?category=gifts-for-him&subcategory=${(selectedOccasion as any)?.slug || ''}`;
                  router.push(url);
                  setSelectedOccasion(null);
                }}
                className="flex flex-col items-center justify-between py-3 px-3 bg-white border border-blue-50/50 rounded-[16px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,100,255,0.08)] hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden h-full"
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EBF4FF] flex items-center justify-center text-blue-500 transform group-hover:scale-105 transition-transform duration-300">
                    <User className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                  </div>
                  {/* Floating hearts */}
                  <span className="absolute top-2 -left-2 text-blue-300 text-xs animate-pulse">♥</span>
                  <span className="absolute bottom-2 -right-2 text-blue-300 text-[10px] animate-pulse delay-150">♥</span>
                </div>
                
                <div className="flex flex-col items-center gap-0.5 mb-2">
                  <span className="font-extrabold text-[16px] sm:text-[17px] text-[#1a1f36]">For Him</span>
                  <span className="text-[#64748b] text-[11px] sm:text-[12px]">Shop gifts for him</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-md transform group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              {/* For Her Card */}
              <button
                onClick={() => {
                  const url = `/products?category=gifts-for-her&subcategory=${(selectedOccasion as any)?.slug || ''}`;
                  router.push(url);
                  setSelectedOccasion(null);
                }}
                className="flex flex-col items-center justify-between py-3 px-3 bg-white border border-pink-50/50 rounded-[16px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(255,0,100,0.08)] hover:border-pink-100 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden h-full"
              >
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FDF2F8] flex items-center justify-center text-pink-500 transform group-hover:scale-105 transition-transform duration-300">
                    <User className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                  </div>
                  {/* Floating hearts */}
                  <span className="absolute top-4 -left-2 text-pink-300 text-[10px] animate-pulse">♥</span>
                  <span className="absolute top-8 -right-2 text-pink-300 text-[11px] animate-pulse delay-150">♥</span>
                </div>
                
                <div className="flex flex-col items-center gap-0.5 mb-2">
                  <span className="font-extrabold text-[16px] sm:text-[17px] text-[#1a1f36]">For Her</span>
                  <span className="text-[#64748b] text-[11px] sm:text-[12px]">Shop gifts for her</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#EC4899] flex items-center justify-center text-white shadow-md transform group-hover:bg-pink-600 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </div>

            {/* OR Divider */}
            <div className="w-full flex items-center gap-3 mb-3">
              <div className="h-[1px] flex-1 bg-slate-200"></div>
              <span className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider">OR</span>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                const url = selectedOccasion?.href || `/products`;
                router.push(url);
                setSelectedOccasion(null);
              }}
              className="w-full sm:w-auto min-w-[260px] flex items-center justify-center gap-2 py-2 px-6 rounded-full border border-purple-300 text-purple-700 bg-white hover:bg-purple-50 transition-colors duration-300 font-semibold text-[13px] mb-2 group"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Continue without selecting</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[#94a3b8] text-[13px]">
              We'll show all gifts for this occasion
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
