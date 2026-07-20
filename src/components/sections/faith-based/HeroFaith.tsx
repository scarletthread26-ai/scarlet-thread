"use client"

import { Star } from "lucide-react"
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero"
import { useHomepageSection } from "@/hooks/use-cms"

const ACCENT = "#4b0082"
const ACCENT_GOLD = "#D4AF37"

export function HeroFaith() {
  const { data: sectionData, isLoading } = useHomepageSection("faith-based")

  if (isLoading) {
    return <CommonHeroSkeleton />
  }

  const title = sectionData?.title ?? ""
  const subtitle = sectionData?.subtitle ?? ""
  const desktopImage = sectionData?.content?.image_desktop ?? ""
  const mobileImage = sectionData?.content?.image_mobile ?? ""

  return (
    <CommonHero
      eyebrow="Faith Based"
      eyebrowIcon={
        <Star className="h-3.5 w-3.5" style={{ fill: ACCENT_GOLD, color: ACCENT_GOLD }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      primaryHref="/products?category=faith-based"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized faith-based gifts"
      bgColor="#FAF8F5"
      blobColor={ACCENT_GOLD}
    />
  )
}
