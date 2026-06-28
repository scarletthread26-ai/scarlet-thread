import { HeroKids } from "@/components/sections/kids-babies/HeroKids"
import { CategoryIconsKids } from "@/components/sections/kids-babies/CategoryIconsKids"
import { ProductCarouselKids } from "@/components/sections/kids-babies/ProductCarouselKids"
import { MidValuePropsKids } from "@/components/sections/kids-babies/MidValuePropsKids"
import { LivePreviewFeatureKids } from "@/components/sections/kids-babies/LivePreviewFeatureKids"
import { OccasionsGridKids } from "@/components/sections/kids-babies/OccasionsGridKids"
import { CraftedGalleryKids } from "@/components/sections/kids-babies/CraftedGalleryKids"
import { TestimonialsKids } from "@/components/sections/kids-babies/TestimonialsKids"
import { CustomGiftBannerKids } from "@/components/sections/kids-babies/CustomGiftBannerKids"
import { BottomValuePropsKids } from "@/components/sections/kids-babies/BottomValuePropsKids"

export default function KidsBabiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroKids />
      <CategoryIconsKids />
      <ProductCarouselKids />
      <MidValuePropsKids />
      <LivePreviewFeatureKids />
      <OccasionsGridKids />
      <CraftedGalleryKids />
      <TestimonialsKids />
      <CustomGiftBannerKids />
      <BottomValuePropsKids />
    </div>
  )
}
