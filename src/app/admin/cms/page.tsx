"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Sliders,
  ArrowRight,
  ShoppingBag,
  Heart,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CMSHubPage() {
  const sections = [
    {
      title: "Home Page Settings",
      description: "Manage homepage main Hero slider, promotional banners, about section, testimonials and featured items.",
      icon: Sliders,
      href: "/admin/cms/home",
      color: "text-purple-650 bg-purple-50 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/30",
    },
    {
      title: "Gifts For Him Page",
      description: "Customize Hero banner headers, descriptive subtext, and banner image slides for Men's catalog.",
      icon: ShoppingBag,
      href: "/admin/cms/gifts-for-him",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30",
    },
    {
      title: "Gifts For Her Page",
      description: "Customize Hero banner headers, descriptive subtext, and banner image slides for Women's catalog.",
      icon: Heart,
      href: "/admin/cms/gifts-for-her",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100/50 dark:border-rose-900/30",
    },
    {
      title: "Kids & Babies Page",
      description: "Customize Hero banner headers, descriptive subtext, and banner image slides for Children's catalog.",
      icon: Sparkles,
      href: "/admin/cms/kids-babies",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/30",
    },
    {
      title: "Gallery Page Settings",
      description: "Customize Hero banner headers, descriptive subtext, and banner image slides for Gallery catalog.",
      icon: FileText,
      href: "/admin/cms/gallery",
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/20 border-teal-100/50 dark:border-teal-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          CMS content Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize website slides, promotional banners, policies, and lookbooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className={`p-3.5 rounded-xl border shrink-0 h-fit ${sec.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {sec.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <Link
                  href={sec.href}
                  className="flex items-center gap-1 text-xs font-bold text-purple-655 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition"
                >
                  <span>Open Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
