"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

export function CraftedGallerySeasonal() {
  return (
    <CraftedGallerySection
      heading={<>Stitched with Love for the <span className="text-primary">Holidays</span></>}
      category="seasonal"
      galleryHref="/gallery?category=seasonal-gifts#gallery-grid"
      bgColor="bg-white"
      cardBg="bg-[#f8f4f1]"
    />
  )
}
