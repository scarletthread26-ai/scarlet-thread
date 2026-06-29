"use client"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHomepageSection } from "@/hooks/use-cms"
import Link from "next/link"

export function SmileCTA() {
  const { data: section } = useHomepageSection("cta")

  const title = section?.title || "Ready to Make Someone Smile?"
  const subtitle = section?.subtitle || "Create a gift that will be remembered forever"
  const content = section?.content || {}
  const buttonText = content.button_text || "Start Personalizing Now"
  const buttonLink = content.button_link || "/products"
  const imageUrl = content.image_url || "/images/scarlet-couple.png"
  const isActive = section?.is_active !== false

  if (!isActive) return null

  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-10 bg-[#F9F5FF]">
      <div 
        className="relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 md:py-10 lg:py-11 space-y-3">
          <h2 className="font-heading font-bold text-white text-xl md:text-2xl lg:text-3xl flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span>{title}</span>
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-pink-400 stroke-[1.5] animate-pulse" />
          </h2>
          
          <p className="text-xs md:text-sm text-gray-200 max-w-xl font-medium tracking-wide">
            {subtitle}
          </p>
          
          <div className="pt-1">
            <Link href={buttonLink}>
              <Button size="lg" className="text-xs md:text-sm h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-lg hover:shadow-primary/20 transition-all cursor-pointer">
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
