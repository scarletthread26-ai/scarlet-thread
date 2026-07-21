import { HeroSeasonal } from "@/components/sections/seasonal-gifts/HeroSeasonal"
import { ProductCarouselSeasonal } from "@/components/sections/seasonal-gifts/ProductCarouselSeasonal"
import { OccasionsGridSeasonal } from "@/components/sections/seasonal-gifts/OccasionsGridSeasonal"
import { CraftedGallerySeasonal } from "@/components/sections/seasonal-gifts/CraftedGallerySeasonal"

export const metadata = {
  title: "Seasonal Gifts | The Scarlet Thread",
  description: "Celebrate every season with our beautiful, personalized custom embroidered gifts.",
}

import CategoryFAQ from "@/components/sections/CategoryFAQ"

export default function SeasonalGiftsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSeasonal />
      <CraftedGallerySeasonal />
      <OccasionsGridSeasonal />
      <ProductCarouselSeasonal />
      <CategoryFAQ categorySlug="seasonal-gifts" />
    </div>
  )
}
