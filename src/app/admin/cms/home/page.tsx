"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sliders, Image as ImageIcon, BookOpen, ShoppingBag, MessageSquare, Heart, Workflow } from "lucide-react";
import HeroSliderEditorPage from "../hero-slider/page";
import BannersEditorPage from "../banners/page";
import AboutSectionEditorPage from "../about/page";
import FeaturedProductsEditorPage from "../featured-products/page";
import TestimonialsPage from "../testimonials/page";
import CTASectionEditorPage from "../cta/page";
import HowItWorksEditorPage from "../how-it-works/page";
import OccasionsEditorPage from "../occasions/page";

export default function HomePageSettings() {
  const [activeTab, setActiveTab] = useState("hero");

  const tabs = [
    { id: "hero", label: "Hero Slider", icon: Sliders, component: <HeroSliderEditorPage isTabbed={true} /> },
    { id: "banners", label: "Store Banners", icon: ImageIcon, component: <BannersEditorPage isTabbed={true} /> },
    { id: "about", label: "About Section", icon: BookOpen, component: <AboutSectionEditorPage isTabbed={true} /> },
    { id: "featured", label: "Featured Products", icon: ShoppingBag, component: <FeaturedProductsEditorPage isTabbed={true} /> },
    { id: "how-it-works", label: "How It Works", icon: Workflow, component: <HowItWorksEditorPage isTabbed={true} /> },
    { id: "cta", label: "CTA Section", icon: Heart, component: <CTASectionEditorPage isTabbed={true} /> },
    { id: "occasions", label: "Occasions", icon: Heart, component: <OccasionsEditorPage isTabbed={true} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/cms"
          className="p-2 text-white bg-purple-700 hover:text-white dark:text-white dark:hover:text-white hover:bg-purple-500 dark:hover:bg-purple-500 rounded-lg outline-none transition"
        >
          <ArrowLeft className="w-5 h-5 " />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Home Page Settings
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-400 mt-0.5">
            Configure Hero sliders, promotional banners, storefront texts, testimonials and featured items.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition duration-200 cursor-pointer rounded-t-lg ${
                isActive
                  ? "border-purple-650 text-white bg-purple-700 dark:text-purple-400 dark:border-purple-400 dark:bg-purple-950/30"
                  : "border-transparent text-slate-700 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="mt-4 bg-slate-50/30 dark:bg-slate-950/5 p-1 rounded-2xl">
        {tabs.find((t) => t.id === activeTab)?.component}
      </div>
    </div>
  );
}
