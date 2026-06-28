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

export function EmbroideryStylesHer() {
  const styles = [
    {
      name: "Ananya",
      style: "Script Style",
      fontClass: greatVibes.className,
    },
    {
      name: "Priyanka",
      style: "Elegant Style",
      fontClass: parisienne.className,
    },
    {
      name: "Meera",
      style: "Classic Style",
      fontClass: playfair.className,
    },
    {
      name: "Simran",
      style: "Modern Style",
      fontClass: dancingScript.className,
    },
  ]

  return (
    <section className="py-3 md:py-4 bg-white overflow-hidden">
      <motion.div 
        variants={fadeUp(0.7, 30)} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-50px" }} 
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/4 text-center md:text-left bg-[#FFF5F5] rounded-3xl p-8 flex flex-col justify-center h-full min-h-[200px]">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              Make It Uniquely Hers
            </h2>

            <p className="text-muted-foreground text-sm mb-6">
              Choose from our beautiful embroidery fonts
            </p>

            <Button
              size="sm"
              className="rounded-full bg-primary text-white hover:bg-primary/90 w-max mx-auto md:mx-0"
            >
              View All Fonts <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </div>

          <motion.div 
            variants={staggerContainer(0.08, 0.1)}
            className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {styles.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.6, 20)}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer aspect-square"
              >
                <span
                  className={`text-3xl md:text-4xl mb-4 text-foreground group-hover:text-primary transition-colors ${item.fontClass}`}
                >
                  {item.name}
                </span>

                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
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