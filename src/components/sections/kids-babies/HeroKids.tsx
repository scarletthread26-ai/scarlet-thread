"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { CommonHero } from "@/components/sections/CommonHero"

const ACCENT = "#6E3B9B"
const ACCENT_PINK = "#FF69B4"

export function HeroKids() {
  const [sectionData, setSectionData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/cms/homepage-sections?key=kids-babies")
        if (res.ok) {
          const json = await res.json()
          if (json) setSectionData(json)
        }
      } catch (err) {
        console.warn("Failed to load kids-babies hero settings:", err)
      }
    }
    loadData()
  }, [])

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
      primaryLabel="Shop Best Sellers"
      secondaryHref="/products?category=kids-babies"
      secondaryLabel="Explore Collection"

      desktopImage={desktopImage}
      mobileImage={mobileImage}
      imageAlt="Personalized baby gifts"
      bgColor="#FFF5F8"
      blobColor={ACCENT_PINK}
    />
  )
}
