"use client"

import { Heart } from "lucide-react"
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero"
import { useHomepageSection } from "@/hooks/use-cms"

const ACCENT = "#4b0082"

export function HeroHim() {
  const { data: sectionData, isLoading } = useHomepageSection("gifts-for-him")

  if (isLoading) {
    return <CommonHeroSkeleton />
  }

  const title = sectionData?.title || "Make Every Gift Personal"
  const subtitle =
    sectionData?.subtitle ||
    "Thoughtfully embroidered gifts for husbands, boyfriends, fathers, brothers and best friends."
  const desktopImage =
    sectionData?.content?.image_desktop ||
    "/images/forhimpage/scarlet-forhimbanner.png"
  const mobileImage =
    sectionData?.content?.image_mobile ||
    "/images/forhimpage/forhim-mobile-banner.png"

  return (
    <CommonHero
      eyebrow="Gifts For Him"
      eyebrowIcon={
        <Heart className="h-3 w-3" style={{ fill: ACCENT, color: ACCENT }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      bodyText="Personalized with names, dates, quotes, and memories that last forever."
      primaryHref="/products"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts for him"
      bgColor="#FFF7FD"
    />
  )
}