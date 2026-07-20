"use client";

import Link from "next/link";
import { Grip, UserRound, Sparkles, Baby, Gift, Package, Home, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GalleryFilterProps {
  categories: Category[];
  activeCategory: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  all: <Grip className="w-4 h-4" />,
  "gifts-for-him": <UserRound className="w-4 h-4" />,
  him: <UserRound className="w-4 h-4" />,
  "gifts-for-her": <Sparkles className="w-4 h-4" />,
  her: <Sparkles className="w-4 h-4" />,
  "kids-babies": <Baby className="w-4 h-4" />,
  kids: <Baby className="w-4 h-4" />,
  "seasonal-gifts": <Gift className="w-4 h-4" />,
  "faith-based": <Star className="w-4 h-4" />,
  anniversary: <Gift className="w-4 h-4" />,
  couple: <UserRound className="w-4 h-4" />,
  occasions: <Gift className="w-4 h-4" />,
  hampers: <Package className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
};

export function GalleryFilter({ categories, activeCategory }: GalleryFilterProps) {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 60) {
        setIsScrollingUp(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsScrollingUp(false);
      } else {
        setIsScrollingUp(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    { id: "all", label: "All Creations", icon: ICON_MAP.all, active: activeCategory === "all" || !activeCategory },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      icon: ICON_MAP[cat.slug] || <Grip className="w-4 h-4" />,
      active: activeCategory === cat.id,
    })),
  ];

  return (
    <section id="gallery-view" className={`pt-3 pb-3 bg-white sticky z-40 border-b border-border/50 shadow-sm scroll-mt-32 transition-all duration-300 ${isScrollingUp ? "top-[114px] lg:top-[164px]" : "top-[114px]"}`}>
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-3  hide-scrollbar justify-start xl:justify-center">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/gallery?category=${tab.id}`}
              scroll={false}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                tab.active
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-foreground/70 border-border hover:border-primary/50 hover:text-primary"
              }`}
            >
              <span className={tab.active ? "text-white" : "text-[#8059BB]"}>{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
