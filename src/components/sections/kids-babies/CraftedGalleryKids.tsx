"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

export function CraftedGalleryKids() {
  return (
    <CraftedGallerySection
      heading={<>Loved by Parents,<span className="text-primary"> Made for Kids</span></>}
      category="kids"
      galleryHref="/gallery?category=kids-babies#gallery-grid"
      bgColor="bg-[#FAFAFA]"
      cardBg="bg-white"
    />
  )
}