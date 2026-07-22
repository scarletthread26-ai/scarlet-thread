"use client";

import React from "react";
import { motion } from "framer-motion";

interface AboutStoryProps {
  imageSrc: string;
}

export default function AboutStory({ imageSrc }: AboutStoryProps) {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-t border-slate-100/40 dark:border-slate-900/40">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Image Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 shadow-purple-950/5 aspect-[4/5] bg-slate-100 dark:bg-slate-900"
            >
              <img
                src={imageSrc}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent" />
            </motion.div>
          </div>

          {/* Story Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase block">Our Roots</span>
              <h2 className="text-[22px] md:text-3xl font-heading font-bold ">
                Our Story
              </h2>
            </div>
            
            <div className="space-y-4  dark:text-slate-350 text-sm md:text-sm leading-relaxed font-normal">
              <p className="font-semibold text-base md:text-lg">
                Scarlet Thread was created with one simple idea—to make gifting more personal across the emirates, establishing our brand as a trusted <strong className="font-extrabold">gift shop UAE</strong> locals love.
              </p>
              <p>
                In a world filled with ordinary presents, we wanted to design <strong className="font-extrabold">unique gifts UAE</strong> families will cherish forever, carrying true emotions, memories, and meaning.
              </p>
              <p>
                Whether it's one of our cozy <strong className="font-extrabold">embroidered hoodies UAE</strong> collections, custom <strong className="font-extrabold">personalized towels UAE</strong> sets, a personalized baby towel, a custom cushion, or <strong className="font-extrabold">personalized keepsakes</strong> that capture love, every item is carefully crafted with <strong className="font-extrabold">custom embroidery UAE</strong> techniques to celebrate relationships and special occasions.
              </p>
              <p>
                Today, Scarlet Thread proudly serves customers as a premier destination for <strong className="font-extrabold">customized gifts Dubai</strong> and UAE-wide, helping families, friends, and loved ones create lasting memories through personalized gifts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
