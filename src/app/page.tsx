import { Hero } from "@/components/sections/Hero"
import { Discover } from "@/components/sections/Discover"
import { FeaturedBanner } from "@/components/sections/FeaturedBanner"
import { ProductGrid } from "@/components/sections/ProductGrid"
import { Testimonials } from "@/components/sections/Testimonials"
import { SmileCTA } from "@/components/sections/SmileCTA"
import { CraftedGalleryHer } from "@/components/sections/gifts-for-her/CraftedGalleryHer"
import { NewHowItWorks } from "@/components/sections/NewHowItWorks"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Discover />
      <ProductGrid />
      <NewHowItWorks />
      <FeaturedBanner />
      <CraftedGalleryHer />
      <Testimonials />
      {/* <SmileCTA /> */}
    </div>
  );
}
