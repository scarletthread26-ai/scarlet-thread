"use client";

import React from "react";
import { Users, Star, Gift, Truck, Award, CreditCard } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function AboutMilestones() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-px opacity-50" />
     
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 font-extrabold tracking-widest text-[10px] md:text-xs uppercase"
          >
            Our Milestones
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[22px] md:text-4xl font-heading font-black text-slate-900"
          >
            Our Story in <span className="text-primary">Numbers</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm md:text-md leading-relaxed max-w-xl mx-auto"
          >
            We pride ourselves on delivery excellence, customer smiles, and premium products that leave a lasting impression.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8"
        >
          {[
            { num: "300+", label: "Happy Customers", icon: Users, color: "from-blue-500 to-cyan-400" },
            { num: "100+", label: "5-Star Reviews", icon: Star, color: "from-amber-400 to-orange-400" },
            { num: "500+", label: "Gifts Delivered", icon: Gift, color: "from-pink-500 to-rose-400" },
            { num: "UAE", label: "Reliable Shipping", icon: Truck, color: "from-emerald-500 to-teal-400" },
            { num: "100%", label: "Premium Quality", icon: Award, color: "from-purple-600 to-indigo-500" },
            { num: "100%", label: "Secure Payments", icon: CreditCard, color: "from-slate-600 to-slate-400" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white backdrop-blur-xl border border-slate-200/50 rounded-3xl p-6 text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md transform group-hover:-translate-y-1 transition-transform duration-300 relative z-10`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-3xl font-black text-slate-800 block tracking-tighter">
                    {stat.num}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
