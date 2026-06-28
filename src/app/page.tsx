import { Hero } from "@/components/sections/Hero"
import { Discover } from "@/components/sections/Discover"
import { Categories } from "@/components/sections/Categories"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { FeaturedBanner } from "@/components/sections/FeaturedBanner"
import { ProductGrid } from "@/components/sections/ProductGrid"
import { StoreFeatures } from "@/components/sections/StoreFeatures"
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
     
      {/* <Categories /> */}
      <NewHowItWorks />
      {/* <HowItWorks /> */}
      <FeaturedBanner />
     
      <StoreFeatures />
      <CraftedGalleryHer />
      <Testimonials />
      <SmileCTA />
    </div>
  );
}
