"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

const fallbackImages = [
  { image: "/images/forhimpage/scarlet-papahoodie.png",   alt: "Papa Hoodie" },
  { image: "/images/forhimpage/scarlet-mrperfect.png",    alt: "Mr Perfect" },
  { image: "/images/forhimpage/scarlet-papapouch.png",    alt: "Papa Pouch" },
  { image: "/images/forhimpage/scarlet-amazinghoodie.png",alt: "Amazing Hoodie" },
  { image: "/images/forhimpage/scarlet-kinghoodie.png",   alt: "King Hoodie" },
  { image: "/images/forhimpage/scarlet-mannat.png",       alt: "Mannat" },
  { image: "/images/forhimpage/scarlet-dadhero.png",      alt: "Dad Hero" },
]

export function CraftedGallery() {
  return (
    <CraftedGallerySection
      heading="Crafted With Love - Just For Him"
      category="him"
      galleryHref="/gallery?category=him#gallery-grid"
      fallbackImages={fallbackImages}
      bgColor="bg-white"
      cardBg="bg-[#f8f4f1]"
    />
  )
}