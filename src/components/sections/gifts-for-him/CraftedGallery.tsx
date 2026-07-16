"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

export function CraftedGallery() {
  return (
    <CraftedGallerySection
      heading={<>Made with Love for <span className="text-primary">Him</span></>}
      category="him"
      galleryHref="/gallery?category=gifts-for-him#gallery-grid"
      bgColor="bg-white"
      cardBg="bg-[#f8f4f1]"
    />
  )
}