"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useHomepageSection } from "@/hooks/use-cms";



export function ForEveryOccasion() {
  const { data: section } = useHomepageSection("occasions");
  
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
          {cards.map((occ: any, index: number) => (
            <motion.div
              key={occ.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={occ.href} className="block group">
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
          ))}
        </div>
      </div>
    </section>
  );
}
