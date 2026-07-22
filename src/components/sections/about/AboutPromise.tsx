"use client";

import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPromise() {
  return (
    <section className="py-10 max-w-[1280px] mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 md:p-14 text-center overflow-hidden shadow-xl"
      >
        {/* Subtle background glow graphics */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto space-y-6 flex flex-col items-center">
          <Heart className="w-12 h-12 text-pink-400 fill-pink-400/20 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight">Our Promise</h2>
          <div className="h-0.5 w-16 bg-pink-400 rounded-full" />
          <p className="text-sm  font-medium leading-relaxed italic text-purple-100">
            "Every personalized gift we create represents someone's special moment. That's why we focus on quality craftsmanship, thoughtful design, clear communication, and customer satisfaction from the moment you place your order until your gift reaches its destination."
          </p>
          <p className="text-sm text-purple-200/90 font-bold uppercase tracking-wider">
            We're committed to creating gifts that people will cherish for years to come.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
