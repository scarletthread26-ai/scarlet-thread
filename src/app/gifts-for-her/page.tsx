import { HeroHer } from "@/components/sections/gifts-for-her/HeroHer"
import { ProductCarouselHer } from "@/components/sections/gifts-for-her/ProductCarouselHer"
import { OccasionsGridHer } from "@/components/sections/gifts-for-her/OccasionsGridHer"
import { CraftedGalleryHer } from "@/components/sections/gifts-for-her/CraftedGalleryHer"

import CategoryFAQ from "@/components/sections/CategoryFAQ"

export default function GiftsForHerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHer />
      <CraftedGalleryHer />
      <OccasionsGridHer />
      <ProductCarouselHer />
      <CategoryFAQ categorySlug="gifts-for-her" />
    </div>
  )
}
