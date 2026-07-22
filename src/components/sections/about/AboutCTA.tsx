"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

interface AboutCTAProps {
  whatsappUrl: string;
}

export default function AboutCTA({ whatsappUrl }: AboutCTAProps) {
  return (
    <section className="bg-white py-24 md:py-32 w-full border-t border-purple-100/30">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <span className="text-purple-600 font-extrabold tracking-wider text-xs uppercase">Get Started Today</span>
            <h2 className="text-[22px] md:text-3xl lg:text-4xl font-heading font-bold text-slate-900 leading-tight">
              Ready To Create Something Special?
            </h2>
            <p className="text-slate-500 text-sm md:text-sm leading-relaxed">
              Create a personalized gift that will be remembered forever. We specialize in custom embroidery UAE residents love, crafting memorable, timeless gifts for all.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link
              href="/products"
              className={buttonVariants({
                variant: "default",
                className: "sm:w-50 w-full rounded-[18px] bg-purple-600 text-white font-bold px-8 h-[56px] text-base text-center shadow-lg shadow-purple-600/10 cursor-pointer flex items-center justify-center"
              })}
            >
              Shop Now
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-[10px] text-nowrap sm:w-50 rounded-[18px] border  border-emerald-500  text-white font-bold px-8 h-[56px] text-base cursor-pointer gap-2 bg-green-500 inline-flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 text-white fill-emerald-500/10 shrink-0" />
              Contact Us on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
