"use client"

import { CraftedGallerySection } from "@/components/sections/CraftedGallerySection"

const fallbackImages = [
  { image: "/images/occassion/scarlet-girlboss.png", alt: "Girl Boss" },
  { image: "/images/occassion/scarlet-beyou.png", alt: "Be You" },
  { image: "/images/occassion/scarlet-happysoul.png", alt: "Happy Soul" },
  { image: "/images/occassion/scarlet-staypositive.png", alt: "Stay Positive" },
  { image: "/images/occassion/scarlet-box.png", alt: "Gift Box" },
  { image: "/images/occassion/scarlet-proud.png", alt: "Proud" },
]

export function CraftedGalleryHer() {
  return (
    <CraftedGallerySection
      heading={<>Our Most Loved <span className="text-primary">Gifts</span></>}
      description={<p>Explore our most cherished gifts, carefully selected to bring joy to your loved ones.</p>}
      category="all"
      galleryHref="/gallery?category=all#gallery-grid"
      fallbackImages={fallbackImages}
      bgColor="bg-white"
      cardBg="bg-white"
      minImages={5}
    />
  )
}