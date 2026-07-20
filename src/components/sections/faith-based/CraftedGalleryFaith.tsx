"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

export function CraftedGalleryFaith() {
  return (
    <CraftedGallerySection
      heading={<>Stitched with Love & <span className="text-primary">Devotion</span></>}
      category="faith"
      galleryHref="/gallery?category=faith-based#gallery-grid"
      bgColor="bg-white"
      cardBg="bg-[#f8f4f1]"
    />
  )
}
