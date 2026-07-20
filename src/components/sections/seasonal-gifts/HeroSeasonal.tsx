"use client"

import { Gift } from "lucide-react"
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero"
import { useHomepageSection } from "@/hooks/use-cms"

const ACCENT = "#4b0082"
const ACCENT_RED = "#E5485A"

export function HeroSeasonal() {
  const { data: sectionData, isLoading } = useHomepageSection("seasonal-gifts")

  if (isLoading) {
    return <CommonHeroSkeleton />
  }

  const title = sectionData?.title ?? ""
  const subtitle = sectionData?.subtitle ?? ""
  const desktopImage = sectionData?.content?.image_desktop ?? ""
  const mobileImage = sectionData?.content?.image_mobile ?? ""

  return (
    <CommonHero
      eyebrow="Seasonal Gifts"
      eyebrowIcon={
        <Gift className="h-3.5 w-3.5" style={{ fill: ACCENT_RED, color: ACCENT_RED }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      primaryHref="/products?category=seasonal-gifts"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized seasonal gifts"
      bgColor="#FFF9F5"
      blobColor={ACCENT_RED}
    />
  )
}
