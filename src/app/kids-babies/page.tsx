import { HeroKids } from "@/components/sections/kids-babies/HeroKids"
import { ProductCarouselKids } from "@/components/sections/kids-babies/ProductCarouselKids"
import { OccasionsGridKids } from "@/components/sections/kids-babies/OccasionsGridKids"
import { CraftedGalleryKids } from "@/components/sections/kids-babies/CraftedGalleryKids"

export default function KidsBabiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroKids />
      <ProductCarouselKids />
      <OccasionsGridKids />
      <CraftedGalleryKids />
    </div>
  )
}
