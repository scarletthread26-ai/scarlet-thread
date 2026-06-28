"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { staggerContainer, fadeUp } from "@/lib/animations"
import {
  Great_Vibes,
  Playfair_Display,
  Parisienne,
  Dancing_Script,
} from "next/font/google"

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
})

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "600",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: "600",
})

export function EmbroideryStyles() {
  const styles = [
    { name: "Alexander", style: "Script Style", fontClass: greatVibes.className },
    { name: "Michael", style: "Luxury Serif", fontClass: parisienne.className },
    { name: "Daniel", style: "Modern Sans", fontClass: playfair.className },
    { name: "John", style: "Handwritten", fontClass: dancingScript.className },
  ]

  return (
    <section className="py-3 md:py-4 bg-[#FAFAFA] overflow-hidden">
      <motion.div
        variants={fadeUp(0.7, 30)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_4fr] gap-3 md:gap-4 items-stretch">
          <div className="bg-[#FFF7FD] rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col justify-center shadow-sm border border-[#F4E8F1]">
            <h2 className="text-base md:text-lg font-heading font-bold text-foreground leading-tight mb-1">
              Choose Your Embroidery Style
            </h2>

            <p className="text-[10px] md:text-xs text-muted-foreground leading-snug mb-3">
              Pick a font that suits his personality
            </p>

            <Button
              size="sm"
              className="w-fit h-7 rounded-full bg-primary px-3 text-[10px] text-white hover:bg-primary/90"
            >
              View All Fonts <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <motion.div 
            variants={staggerContainer(0.08, 0.1)}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {styles.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.6, 20)}
                className="bg-white rounded-xl md:rounded-2xl px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center text-center shadow-sm border border-[#F4E8F1] hover:border-primary/30 transition-colors group cursor-pointer min-h-[82px] md:min-h-[92px]"
              >
                <span
                  className={`text-xl md:text-2xl mb-2 text-foreground group-hover:text-primary transition-colors leading-none ${item.fontClass}`}
                >
                  {item.name}
                </span>

                <span className="text-[8px] md:text-[9px] uppercase tracking-wide text-muted-foreground font-semibold">
                  {item.style}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}