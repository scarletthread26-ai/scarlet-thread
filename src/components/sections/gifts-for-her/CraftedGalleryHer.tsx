"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

const fallbackImages = [
  { image: "/images/occassion/scarlet-girlboss.png",     alt: "Girl Boss" },
  { image: "/images/occassion/scarlet-beyou.png",        alt: "Be You" },
  { image: "/images/occassion/scarlet-happysoul.png",    alt: "Happy Soul" },
  { image: "/images/occassion/scarlet-staypositive.png", alt: "Stay Positive" },
  { image: "/images/occassion/scarlet-box.png",          alt: "Gift Box" },
  { image: "/images/occassion/scarlet-proud.png",        alt: "Proud" },
]

export function CraftedGalleryHer() {
  return (
    <CraftedGallerySection
      heading="Loved By Her, Crafted By Us"
      category="her"
      galleryHref="/gallery?category=her#gallery-grid"
      fallbackImages={fallbackImages}
      bgColor="bg-[#F9F5FF]"
      cardBg="bg-white"
      minImages={6}
    />
  )
}