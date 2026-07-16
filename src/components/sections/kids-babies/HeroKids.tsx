"use client"

import { Heart } from "lucide-react"
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero"
import { useHomepageSection } from "@/hooks/use-cms"

const ACCENT = "#4b0082"
const ACCENT_PINK = "#FF69B4"

export function HeroKids() {
  const { data: sectionData, isLoading } = useHomepageSection("kids-babies")

  if (isLoading) {
    return <CommonHeroSkeleton />
  }

  const title = sectionData?.title || "Little Moments, Made Personal"
  const subtitle =
    sectionData?.subtitle ||
    "Adorable embroidered gifts for your little ones, stitched with love and care."
  const desktopImage =
    sectionData?.content?.image_desktop || "/images/scrlet-babiesbanne.png"
  const mobileImage =
    sectionData?.content?.image_mobile || "/images/scrlet-babiesbanne.png"

  return (
    <CommonHero
      eyebrow="Kids & Babies"
      eyebrowIcon={
        <Heart className="h-3.5 w-3.5" style={{ color: ACCENT_PINK }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      primaryHref="/products"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized baby gifts"
      bgColor="#FFF5F8"
      blobColor={ACCENT_PINK}
    />
  )
}
