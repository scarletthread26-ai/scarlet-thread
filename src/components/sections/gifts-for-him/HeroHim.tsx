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

  const title = sectionData?.title ?? ""
  const subtitle = sectionData?.subtitle ?? ""
  const bodyText = sectionData?.content?.body_text ?? ""
  const desktopImage = sectionData?.content?.image_desktop ?? ""
  const mobileImage = sectionData?.content?.image_mobile ?? ""

  return (
    <CommonHero
      eyebrow="Gifts For Him"
      eyebrowIcon={
        <Heart className="h-3 w-3" style={{ fill: ACCENT, color: ACCENT }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      bodyText={bodyText}
      primaryHref="/products"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts for him"
      bgColor="#FFF7FD"
    />
  )
}