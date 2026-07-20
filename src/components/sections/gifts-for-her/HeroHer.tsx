"use client"

import { Heart } from "lucide-react"
import { CommonHero, CommonHeroSkeleton } from "@/components/sections/CommonHero"
import { useHomepageSection } from "@/hooks/use-cms"

const ACCENT = "#4b0082"

export function HeroHer() {
  const { data: sectionData, isLoading } = useHomepageSection("gifts-for-her")

  if (isLoading) {
    return <CommonHeroSkeleton />
  }

  const title = sectionData?.title ?? ""
  const subtitle = sectionData?.subtitle ?? ""
  const desktopImage = sectionData?.content?.image_desktop ?? ""
  const mobileImage = sectionData?.content?.image_mobile ?? ""

  return (
    <CommonHero
      eyebrow="Gifts For Her"
      eyebrowIcon={
        <Heart className="h-3 w-3" style={{ fill: ACCENT, color: ACCENT }} />
      }
      accentColor={ACCENT}
      title={title}
      subtitle={subtitle}
      primaryHref="/products"
      primaryLabel="Shop Now"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts for her — premium embroidered set"
      bgColor="#fce8ec"
      blobColor={ACCENT}
    />
  )
}
