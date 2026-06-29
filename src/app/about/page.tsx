"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { motion } from "framer-motion";

const placeholderImages = [
  "/images/scarlet-about5.png",
  "/images/scarlet-about.png",
  "/images/scarlet-about1.png",
  "/images/scarlet-about2.png",
  "/images/scarlet-about3.png",
  "/images/scarlet-about4.png"
];

export default function AboutPage() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [aboutRes, galleryRes] = await Promise.all([
          fetch("/api/admin/cms/homepage-sections?key=about"),
          fetch("/api/gallery")
        ]);

        if (aboutRes.ok) {
          const aboutJson = await aboutRes.json();
          if (aboutJson) {
            setSectionData(aboutJson);
          }
        }

        if (galleryRes.ok) {
          const galleryJson = await galleryRes.json();
          if (Array.isArray(galleryJson)) {
            const images = galleryJson
              .filter((item: any) => item.media_type === "image" && item.media_url)
              .map((item: any) => item.media_url);
            setGalleryImages(images);
          }
        }
      } catch (err) {
        console.warn("Failed to load about / gallery data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const title = sectionData?.title || "Discover The Scarlet Thread";
  const subtitle = sectionData?.subtitle || "Bringing Your Gift Ideas To Life";
  const description = sectionData?.content?.description || "At Scarlet, we believe the most meaningful gifts are the ones created with love, thought and personal touch. Whether it's a heartfelt gift for him, a thoughtful gift for her, a precious keepsake for a new born, a surprise gift for a toddler or unforgettable baby shower gifts, we turn emotions into meaningful gifts that hold memories forever.";
  
  const getActiveImages = () => {
    if (galleryImages.length === 0) {
      return placeholderImages;
    }
    if (galleryImages.length < 6) {
      const merged = [...galleryImages];
      const needed = 6 - galleryImages.length;
      for (let i = 0; i < needed; i++) {
        merged.push(placeholderImages[i % placeholderImages.length]);
      }
      return merged;
    }
    return galleryImages;
  };

  const images = getActiveImages();

  return (
    <div className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-[#F9F5FF] to-white min-h-[80vh]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-primary font-semibold tracking-wide flex items-center gap-2">
              <Heart className="w-4 h-4 fill-primary/20" />
              <span>{subtitle}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              {title}
            </h1>

            <div className="h-1 w-20 bg-primary rounded" />

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Image Gallery Column */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {images.map((src: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl overflow-hidden shadow-md border border-slate-100/50 aspect-[3/4]"
                >
                  <img
                    src={src}
                    alt={`Lookbook ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
