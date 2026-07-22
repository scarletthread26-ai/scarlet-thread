"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useHomepageSection, useGallery } from "@/hooks/use-cms";
import { useSettings } from "@/hooks/use-settings";

import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutPromise from "@/components/sections/about/AboutPromise";
import AboutMilestones from "@/components/sections/about/AboutMilestones";
import AboutCTA from "@/components/sections/about/AboutCTA";
import { NewHowItWorks } from "@/components/sections/NewHowItWorks";

export default function AboutPage() {
  const { data: sectionData, isLoading: isCmsLoading } = useHomepageSection("about");
  const { data: galleryJson, isLoading: isGalleryLoading } = useGallery();
  const { data: settings, isLoading: isSettingsLoading } = useSettings();

  const isLoading = isCmsLoading || isGalleryLoading || isSettingsLoading;

  const galleryImages = React.useMemo(() => {
    if (!galleryJson || !Array.isArray(galleryJson)) return [];
    return galleryJson
      .filter((item: any) => item.media_type === "image" && item.media_url)
      .map((item: any) => item.media_url);
  }, [galleryJson]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Fallbacks with dynamic SEO keyword placement
  const title = sectionData?.title || "Discover The Scarlet Thread";
  const subtitle = sectionData?.subtitle || "Bringing Your Gift Ideas To Life";
  const description = sectionData?.content?.description || "At Scarlet Thread, we believe every gift should tell a story. We create beautifully personalized gifts UAE residents adore, celebrating life's most meaningful moments—from birthdays and anniversaries to newborn arrivals, weddings, and special milestones. Every product is crafted with love, attention to detail, and a personal touch that makes every gift unforgettable.";

  const images = galleryImages;

  // Format WhatsApp Link dynamically
  const whatsappNum = settings?.whatsapp_number || "971501872337";
  const cleanedNum = whatsappNum.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanedNum}?text=${encodeURIComponent(
    "Hello Scarlet Thread, I am looking to create a personalized gift and would like to share my details!"
  )}`;

  return (
    <div className="bg-[#FAF8FF] dark:bg-slate-950 overflow-x-hidden">
      <AboutHero
        title={title}
        subtitle={subtitle}
        description={description}
        whatsappUrl={whatsappUrl}
        images={images}
      />
      <AboutStory imageSrc={images[1] || "/images/scarlet-about.png"} />
      <NewHowItWorks />
      <AboutPromise />
      <AboutMilestones />
      <AboutCTA whatsappUrl={whatsappUrl} />
    </div>
  );
}
