"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { CommonHero } from "@/components/sections/CommonHero"

const ACCENT = "#4b0082"

export function HeroHim() {
  const [sectionData, setSectionData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/homepage-sections?key=gifts-for-him")
        if (res.ok) {
          const json = await res.json()
          if (json) setSectionData(json)
        }
      } catch (err) {
        console.warn("Failed to load gifts-for-him hero section settings:", err)
      }
    }
    loadData()
  }, [])

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
      primaryLabel="Shop Best Sellers"
      secondaryHref="/products?category=gifts-for-him"
      secondaryLabel="Explore Collection"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts for him"
      bgColor="#FFF7FD"
    />
  )
}