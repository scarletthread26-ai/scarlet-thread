"use client"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SmileCTA() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-10 bg-[#F9F5FF]">
      <div 
        className="relative overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/scarlet-couple.png')" }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 md:py-10 lg:py-11 space-y-3">
          <h2 className="font-heading font-bold text-white text-xl md:text-2xl lg:text-3xl flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span>Ready to Make Someone Smile?</span>
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-pink-400 stroke-[1.5] animate-pulse" />
          </h2>
          
          <p className="text-xs md:text-sm text-gray-200 max-w-xl font-medium tracking-wide">
            Create a gift that will be remembered forever
          </p>
          
          <div className="pt-1">
            <Button size="lg" className="text-xs md:text-sm h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[5px] shadow-lg hover:shadow-primary/20 transition-all">
              Start Personalizing Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
