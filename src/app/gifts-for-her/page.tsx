import { HeroHer } from "@/components/sections/gifts-for-her/HeroHer"
import { CategoryIconsHer } from "@/components/sections/gifts-for-her/CategoryIconsHer"
import { ProductCarouselHer } from "@/components/sections/gifts-for-her/ProductCarouselHer"
import { LivePreviewFeatureHer } from "@/components/sections/gifts-for-her/LivePreviewFeatureHer"
import { OccasionsGridHer } from "@/components/sections/gifts-for-her/OccasionsGridHer"
import { EmbroideryStylesHer } from "@/components/sections/gifts-for-her/EmbroideryStylesHer"
import { CraftedGalleryHer } from "@/components/sections/gifts-for-her/CraftedGalleryHer"
import { ValuePropsHer } from "@/components/sections/gifts-for-her/ValuePropsHer"
import { Testimonials } from "@/components/sections/Testimonials"
import { CustomGiftBannerHer } from "@/components/sections/gifts-for-her/CustomGiftBannerHer"
import { RelatedCategories } from "@/components/sections/gifts-for-him/RelatedCategories"

export default function GiftsForHerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHer />
      <CategoryIconsHer />
      <ProductCarouselHer />
     {/*<LivePreviewFeatureHer />*/}
      <OccasionsGridHer />
      {/* <EmbroideryStylesHer /> */}
      <CraftedGalleryHer />
      <ValuePropsHer />
      <Testimonials />
      <CustomGiftBannerHer />
      {/* Reusing the RelatedCategories from Him as it points to same structure */}
      <RelatedCategories /> 
    </div>
  )
}
