"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { springScaleUp } from "@/lib/animations"

export function LivePreviewFeature() {
  const steps = [
    "Choose your favorite product",
    "Add name, text or initials",
    "Select font style & thread color",
    "Upload photo (optional)",
    "Preview your design in real-time",
    "We craft it with love & deliver to your door",
  ]

  return (
    <section className="py-4 bg-white">
      <motion.div 
        variants={springScaleUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Mockup UI */}
          <div className="flex-1 w-full relative">
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-sm border border-border/40">
              <Image
                src="/images/forhimpage/scarlet-customisedbanner.png"
                alt="Live preview hoodie customization"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Checklist */}
          <div className="flex-1 py-4 lg:py-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground inline-flex items-center gap-2 mb-6">
              See Your Gift Come To Life
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary mt-1 rotate-12"
              >
                <path d="M12 20S5 13.5 3.5 10c-1.5-3.5 1.5-7 5-6.5 2.5.3 3.5 2.5 3.5 2.5s1-2.2 3.5-2.5c3.5-.5 6.5 3 5 6.5C19 13.5 12 20 12 20z" />
              </svg>
            </h2>

            <ul className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 group cursor-pointer">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 mt-0.5" strokeWidth={2} />
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                    {step}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="rounded-md px-8 h-11 text-sm shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto transition-transform hover:scale-102"
            >
              Start Personalizing <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}