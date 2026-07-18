import { HeroFaith } from "@/components/sections/faith-based/HeroFaith"
import { ProductCarouselFaith } from "@/components/sections/faith-based/ProductCarouselFaith"
import { OccasionsGridFaith } from "@/components/sections/faith-based/OccasionsGridFaith"
import { CraftedGalleryFaith } from "@/components/sections/faith-based/CraftedGalleryFaith"

export const metadata = {
  title: "Faith Based Gifts | The Scarlet Thread",
  description: "Beautifully embroidered spiritual and faith-based gifts that carry deep meaning.",
}

export default function FaithBasedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroFaith />
      <ProductCarouselFaith />
      <OccasionsGridFaith />
      <CraftedGalleryFaith />
    </div>
  )
}
