"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { CommonHero } from "@/components/sections/CommonHero"

const ACCENT = "#4b0082"

export function HeroHer() {
  const [sectionData, setSectionData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/homepage-sections?key=gifts-for-her")
        if (res.ok) {
          const json = await res.json()
          if (json) setSectionData(json)
        }
      } catch (err) {
        console.warn("Failed to load gifts-for-her hero settings:", err)
      }
    }
    loadData()
  }, [])

  const title = sectionData?.title || "Made for Her, Personalized with Love"
  const subtitle =
    sectionData?.subtitle ||
    "Thoughtful, personalized & embroidered gifts that celebrate the most special women in your life."
  const desktopImage =
    sectionData?.content?.image_desktop ||
    "/images/forher/scarlet-forherbanner-image.png"
  const mobileImage =
    sectionData?.content?.image_mobile ||
    "/images/forher/scarlet-forhermobile.png"

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
      primaryLabel="Shop Best Sellers"
      secondaryHref="/products?category=gifts-for-her"
      secondaryLabel="Explore Collection"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized gifts for her — premium embroidered set"
      bgColor="#fce8ec"
      blobColor={ACCENT}
    />
  )
}
