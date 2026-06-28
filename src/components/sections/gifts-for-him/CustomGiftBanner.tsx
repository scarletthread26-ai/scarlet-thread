"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { rotateXPerspective } from "@/lib/animations"

export function CustomGiftBanner() {
  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden" style={{ perspective: 1000 }}>
      <motion.div 
        variants={rotateXPerspective}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="group bg-[#5c2a86] rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center text-white shadow-lg min-h-[260px] p-8 md:p-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/forhimpage/scarlet-custombanner.png"
              alt="Custom Gift Banner"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
              sizes="(max-width: 1200px) 100vw, 1152px"
              priority
            />
            {/* Dark overlay for mobile readability, transparent on desktop if image has space */}
            <div className="absolute inset-0 bg-[#5c2a86]/80 md:bg-transparent pointer-events-none" />
          </div>

          <div className="hidden md:block md:w-[45%]"></div>

          {/* Text Container (Right side) */}
          <div className="w-full md:w-[55%] relative z-10 text-center md:text-left flex flex-col justify-center md:pl-12 lg:pl-16 py-12 md:py-8 px-8 md:px-0">
            <h3 className="text-lg md:text-xl font-medium text-white/95 mb-2">
              Can&apos;t Find The Perfect Gift?
            </h3>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Create A Fully Custom Gift
            </h2>
            <p className="text-white/85 text-sm md:text-base mb-6 max-w-md mx-auto md:mx-0 leading-relaxed">
              Upload your design, photo or idea, <br className="hidden md:block" />
              and we&apos;ll craft something unique just for him.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button size="lg" className="group/btn rounded-md bg-white text-[#5c2a86] hover:bg-white/90 font-bold px-6 h-11 text-sm shadow-sm transition-all duration-300">
                Start Custom Order <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
              </Button>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  )
}
