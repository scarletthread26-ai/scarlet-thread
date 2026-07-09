"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

const fallbackImages = [
  { image: "/images/scarlet-babie1.png",  alt: "Myra" },
  { image: "/images/scarlet-gift.png",    alt: "Aarav" },
  { image: "/images/scarlet-babie3.png",  alt: "Teddy" },
  { image: "/images/scarlet-loved4.png",  alt: "Little Princess" },
  { image: "/images/scarlet-loved5.png",  alt: "Princess" },
  { image: "/images/scarlet-loved6.png",  alt: "Siya" },
]

export function CraftedGalleryKids() {
  return (
    <CraftedGallerySection
      heading={<>Loved by Parents,<span className="text-primary"> Made for Kids</span></>}
      category="kids"
      galleryHref="/gallery?category=kids#gallery-grid"
      fallbackImages={fallbackImages}
      bgColor="bg-[#FAFAFA]"
      cardBg="bg-white"
      minImages={6}
    />
  )
}