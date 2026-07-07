"use client"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHomepageSection } from "@/hooks/use-cms"
import Link from "next/link"
import Image from "next/image"

export function SmileCTA() {
  const { data: section } = useHomepageSection("cta")

  // Section Heading (Outside, centered above the box)
  const sectionTitle = section?.title || "Special"
  const sectionTitleHighlight = "Gifts"
  const sectionSubtitle = section?.subtitle || "Add your unique touch to make it truly theirs."

  const content = section?.content || {}
  const buttonText = content.button_text || "Start Personalizing Now"
  const buttonLink = content.button_link || "/products"
  const imageUrl = content.image_url || "/images/scarlet-couple.png"
  const isActive = section?.is_active !== false

  if (!isActive) return null

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-12 sm:pb-10 shadow-md">

      {/* Section Heading (Outside the box, centered) */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
          <span className="text-[#0f172a] mr-2">{sectionTitle}</span>
          <span className="text-[#4a0b70]">{sectionTitleHighlight}</span>
        </h2>
        <p className="text-[13px] md:text-sm text-muted-foreground max-w-2xl mx-auto">
          {sectionSubtitle}
        </p>
      </div>


      {/* Landscape container with background image + centered button */}
     <div className="relative w-full h-[160px] md:h-[220px] rounded-[10px] overflow-hidden shadow-sm border border-purple-100 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt="Make someone smile"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />

      <div className="absolute inset-0 bg-black/10" />

        <Link href={buttonLink} className="relative z-10">
          <Button
            size="lg"
            className="bg-[#4a0b70] hover:bg-[#34074f] text-white rounded-[10px] px-6 h-13 text-[14px] font-semibold shadow-[0_4px_14px_rgba(74,11,112,0.3)] flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Gift className="w-4 h-4" />
            {buttonText}
          </Button>
        </Link>
      </div>

    </section>
  )
}