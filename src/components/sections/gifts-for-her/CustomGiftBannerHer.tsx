"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { rotateXPerspective } from "@/lib/animations"

export function CustomGiftBannerHer() {
  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden" style={{ perspective: 1000 }}>
      <motion.div 
        variants={rotateXPerspective}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div
          className="group rounded-3xl p-8 md:p-16 relative overflow-hidden flex items-center text-white shadow-xl border-2 border-primary/20 bg-cover bg-center bg-no-repeat min-h-[320px] md:min-h-[380px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
          style={{
            backgroundImage: "url('/images/custombanner/bannerimage.png')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 z-0" />

          {/* Left Content */}
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Can&apos;t Find The Perfect Gift? <br />
              Create A Custom Gift For Her
            </h2>

            <p className="text-white/90 text-sm md:text-base mb-8">
              Share your idea, photo or message and we&apos;ll craft something truly unique.
            </p>

            <Button
              size="lg"
              className="group/btn rounded-md bg-primary backdrop-blur-sm hover:bg-white text-white hover:text-primary border border-white h-12 px-8 font-bold transition-all duration-300"
            >
              Start Custom Order
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
            </Button>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </div>
      </motion.div>
    </section>
  )
}