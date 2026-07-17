"use client";

import { Heart } from "lucide-react";
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero";
import { useHomepageSection } from "@/hooks/use-cms";

const ACCENT = "#4b0082";
const ACCENT_LIGHT = "#8059BB";

export function HeroGallery() {
  const { data: sectionData, isLoading } = useHomepageSection("gallery");

  if (isLoading) {
    return <CommonHeroSkeleton />;
  }

  const title = sectionData?.title ?? "";
  const subtitle = sectionData?.subtitle ?? "";
  const desktopImage = sectionData?.content?.image_desktop ?? "";
  const mobileImage = sectionData?.content?.image_mobile ?? "";

  return (
    <CommonHero
      eyebrow="A Gallery of Love"
      eyebrowIcon={
        <Heart className="h-3.5 w-3.5" style={{ fill: ACCENT_LIGHT, color: ACCENT_LIGHT }} />
      }
      accentColor={ACCENT}
      title={title}
      formatTitle={(rawTitle) => {
        if (rawTitle === "Real Gifts, Real Smiles, Real Memories.") {
          return (
            <>
              Real Gifts, Real Smiles,
              <br />
              <span className="text-[#4b0082]">Real Memories.</span>
            </>
          );
        }
        
        // For custom titles, highlight the last word as indicated in the CMS
        const words = rawTitle.split(" ");
        const lastWord = words.pop() || "";
        return (
          <>
            {words.join(" ")}
            <span className="text-[#4b0082]"> {lastWord}</span>
          </>
        );
      }}
      subtitle={subtitle}
      primaryHref="/products"
      primaryLabel="Shop Now"
      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts gallery"
      bgColor="#fce8ec"
      blobColor={ACCENT_LIGHT}
    />
  );
}


