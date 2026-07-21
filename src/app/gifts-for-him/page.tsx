import { HeroHim } from "@/components/sections/gifts-for-him/HeroHim"
import { ProductCarousel } from "@/components/sections/gifts-for-him/ProductCarousel"
import { OccasionsGridHim } from "@/components/sections/gifts-for-him/OccasionsGrid"
import { CraftedGallery } from "@/components/sections/gifts-for-him/CraftedGallery"

import CategoryFAQ from "@/components/sections/CategoryFAQ"

// Force route compilation rebuild to clear hydration desync
export default function GiftsForHimPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHim />
      <CraftedGallery />
      <OccasionsGridHim />
      <ProductCarousel />
      <CategoryFAQ categorySlug="gifts-for-him" />
    </div>
  )
}
