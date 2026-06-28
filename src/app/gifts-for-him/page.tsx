import { HeroHim } from "@/components/sections/gifts-for-him/HeroHim"
import { CategoryIcons } from "@/components/sections/gifts-for-him/CategoryIcons"
import { ProductCarousel } from "@/components/sections/gifts-for-him/ProductCarousel"
import { LivePreviewFeature } from "@/components/sections/gifts-for-him/LivePreviewFeature"
import { OccasionsGrid } from "@/components/sections/gifts-for-him/OccasionsGrid"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { EmbroideryStyles } from "@/components/sections/gifts-for-him/EmbroideryStyles"
import { CraftedGallery } from "@/components/sections/gifts-for-him/CraftedGallery"
import { ValueProps } from "@/components/sections/gifts-for-him/ValueProps"
import { Testimonials } from "@/components/sections/Testimonials"
import { CustomGiftBanner } from "@/components/sections/gifts-for-him/CustomGiftBanner"
import { RelatedCategories } from "@/components/sections/gifts-for-him/RelatedCategories"

// Force Next.js route re-compilation to resolve hydration mismatch cache desync
export default function GiftsForHimPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroHim />
      <CategoryIcons />
      <ProductCarousel />
      {/* <LivePreviewFeature /> */}
      <OccasionsGrid />
      {/*<HowItWorks />*/}
      {/* <EmbroideryStyles /> */}
      <CraftedGallery />
      <ValueProps />
      <Testimonials />
      <CustomGiftBanner />
      <RelatedCategories />
    </div>
  )
}
