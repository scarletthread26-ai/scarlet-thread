"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import {
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { scaleUp, staggerContainer, fadeUp } from "@/lib/animations"

export function CraftedGalleryHer() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const mockImages = [
    { image: "/images/occassion/scarlet-girlboss.png" },
    { image: "/images/occassion/scarlet-beyou.png" },
    { image: "/images/occassion/scarlet-happysoul.png" },
    { image: "/images/occassion/scarlet-staypositive.png" },
    { image: "/images/occassion/scarlet-box.png" },
    { image: "/images/occassion/scarlet-proud.png" },
  ]

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-16 bg-[#F9F5FF] overflow-hidden">
      <motion.div
        variants={scaleUp(1.2, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Loved By Her, Crafted By Us
            <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <motion.div
            ref={scrollRef}
            variants={staggerContainer(0.08, 0.1)}
            className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {mockImages.map((img, index) => (
              <motion.div
                key={index}
                variants={fadeUp(0.6, 20)}
                className="relative w-40 md:w-48 lg:w-56 shrink-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group snap-start bg-white"
              >
                <div className="relative aspect-square">
                  <Image
                    src={img.image}
                    alt="Gallery image"
                    fill
                    sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Heart className="text-white w-8 h-8 fill-transparent" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="text-center">
          <Button
            size="sm"
            className="rounded-full bg-primary text-white hover:bg-primary/90"
          >
            View More Creations
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }

            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `,
        }}
      />
    </section>
  )
}