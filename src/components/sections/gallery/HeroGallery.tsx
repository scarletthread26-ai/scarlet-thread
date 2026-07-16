"use client";

import { Heart } from "lucide-react";
import { CommonHero } from "@/components/sections/CommonHero";

const ACCENT = "#4b0082";
const ACCENT_LIGHT = "#8059BB";

export function HeroGallery() {
  return (
    <CommonHero
      eyebrow="A Gallery of Love"
      eyebrowIcon={
        <Heart className="h-3.5 w-3.5" style={{ fill: ACCENT_LIGHT, color: ACCENT_LIGHT }} />
      }
      accentColor={ACCENT}
      title="Real Gifts, Real Smiles, Real Memories."
      formatTitle={() => (
        <>
          Real Gifts, Real Smiles,
          <br />
          <span className="text-[#4b0082]">Real Memories.</span>
        </>
      )}
      subtitle="Every gift has a story. and every stitch holds a memory. Here's a glimpse of the love we've helped create."
      primaryHref="/products"
      primaryLabel="Shop Now"
      desktopImage="/images/gallery-hero.png"
      mobileImage="/images/galler-mobile-banner.png"
      imageAlt="Personalized gifts for her"
      bgColor="#fce8ec"
      blobColor={ACCENT_LIGHT}
    />
  );
}


