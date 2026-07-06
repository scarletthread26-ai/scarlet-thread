"use client"
import { Heart, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHomepageSection } from "@/hooks/use-cms"
import Link from "next/link"
import Image from "next/image"
import { Great_Vibes } from 'next/font/google'

const cursiveFont = Great_Vibes({ weight: "400", subsets: ['latin'] })

export function SmileCTA() {
  const { data: section } = useHomepageSection("cta")

  // Section Heading (Outside)
  const sectionTitle = section?.title || "Special"
  const sectionTitleHighlight = "Gifts"
  const sectionSubtitle = section?.subtitle || "Add your unique touch to make it truly theirs."

  // Banner Content (Inside)
  const mainTitle = "Create Something"
  const cursiveTitle = "Unforgettable"
  
  const bannerSubtitle = "Gifts designed to leave a lasting impression"
  const content = section?.content || {}
  const buttonText = content.button_text || "Start Personalizing Now"
  const buttonLink = content.button_link || "/products"
  const imageUrl = content.image_url || "/images/scarlet-couple.png"
  const isActive = section?.is_active !== false

  if (!isActive) return null

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 sm:pb-10">
      
      {/* Section Heading (Outside the box) */}
      <div className="text-left md:text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
          <span className="text-[#0f172a] mr-2">{sectionTitle}</span>
          <span className="text-[#4a0b70]">{sectionTitleHighlight}</span>
        </h2>
        <p className="text-muted-foreground text-[14px] md:text-[15px] max-w-2xl md:mx-auto font-medium">
          {sectionSubtitle}
        </p>
      </div>

      <div className="relative w-full rounded-[24px] overflow-hidden flex flex-col md:flex-row bg-[#f3efff] shadow-sm border border-purple-100">
        
        {/* Left Content Area */}
        <div className="relative flex-[1.2] p-6 md:p-8 flex flex-col justify-center items-center text-center z-20 min-h-[160px]">
          
          {/* Decorative dots top left */}
          <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 opacity-20">
            {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-1 bg-[#4a0b70] rounded-full" />)}
          </div>
          {/* Decorative dots bottom left */}
          <div className="absolute bottom-4 left-4 grid grid-cols-4 gap-1.5 opacity-20">
            {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-1 bg-[#4a0b70] rounded-full" />)}
          </div>

          {/* Floating tiny hearts */}
          <Heart className="absolute top-[30%] left-[10%] w-3 h-3 text-[#4a0b70] opacity-60 -rotate-12" />
          <Heart className="absolute top-[25%] left-[15%] w-3.5 h-3.5 text-[#4a0b70] opacity-60 rotate-12" />

          {/* Top Divider */}
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <div className="w-6 h-[1px] bg-[#4a0b70]"></div>
            <div className="w-1 h-1 rounded-full bg-[#4a0b70]"></div>
            <Heart className="w-3 h-3 text-[#4a0b70]" />
            <div className="w-1 h-1 rounded-full bg-[#4a0b70]"></div>
            <div className="w-6 h-[1px] bg-[#4a0b70]"></div>
          </div>

          {/* Titles */}
          <h2 className="text-[20px] md:text-[24px] lg:text-[28px] font-medium text-[#4a4f54] leading-none mb-1">
            {mainTitle}
          </h2>
          <div className="relative inline-block mb-3">
            <span className={`${cursiveFont.className} text-[36px] md:text-[44px] lg:text-[52px] text-[#4a0b70] leading-[1.1]`}>
              {cursiveTitle}
            </span>
            <Heart className="absolute -right-6 top-2 w-5 h-5 text-[#4a0b70] stroke-[1.5] -rotate-12 opacity-80" />
          </div>

          {/* Bottom Divider */}
          <div className="flex items-center gap-2 mb-4 opacity-60">
            <div className="w-12 h-[2px] bg-[#4a0b70]"></div>
            <Heart className="w-2.5 h-2.5 fill-[#4a0b70] text-[#4a0b70]" />
            <div className="w-12 h-[2px] bg-[#4a0b70]"></div>
          </div>

          <p className="text-[#5a5f64] text-[13px] md:text-[14px] max-w-[280px] leading-snug font-medium mb-6">
            {bannerSubtitle}
          </p>

          <Link href={buttonLink}>
            <Button size="lg" className="bg-[#4a0b70] hover:bg-[#34074f] text-white rounded-[10px] px-6 h-13 text-[14px] font-semibold shadow-[0_4px_14px_rgba(74,11,112,0.3)] flex items-center gap-2 transition-all hover:-translate-y-0.5">
              <Gift className="w-4 h-4" />
              {buttonText}
            </Button>
          </Link>
          
          {/* Curved swoosh overlapping the image on desktop */}
          <svg className="hidden md:block absolute top-0 -right-[1px] h-full w-[80px] text-[#f3efff] z-10 drop-shadow-[4px_0_4px_rgba(0,0,0,0.03)]" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q100,50 0,100 Z" />
            <path d="M0,0 Q100,50 0,100" fill="none" stroke="#d8b4fe" strokeWidth="3" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* Right Image Area */}
        <div className="relative flex-1 min-h-[220px] md:min-h-[300px] bg-[#e6d5f7] w-full">
          <Image
            src={imageUrl}
            alt="Make someone smile"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle gradient overlay to blend corners if needed */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#4a0b70]/5" />
        </div>

      </div>
    </section>
  )
}
