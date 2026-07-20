"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

export function CraftedGalleryHer() {
  return (
    <CraftedGallerySection
      heading={<>Our Most Loved <span className="text-primary">Gifts</span></>}
      description={<p>Explore our most cherished gifts, carefully selected to bring joy to your loved ones.</p>}
      category="her"
      galleryHref="/gallery?category=gifts-for-her#gallery-grid"
      bgColor="bg-white"
      cardBg="bg-white"
    />
  )
}