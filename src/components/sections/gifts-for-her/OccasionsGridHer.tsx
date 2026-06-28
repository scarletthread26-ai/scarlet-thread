"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { staggerContainer, cardPerspective } from "@/lib/animations"

const occasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make her birthday extra special",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    image: "/images/occassion/scarlet-occasionbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your beautiful journey",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    imagePlaceholder: "Heart Box",
    image: "/images/occassion/scarlet-occasionbox2.png",
  },
  {
    id: "mothers-day",
    title: "Mother's Day Gifts",
    description: "Thank her for everything",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    imagePlaceholder: "Best Mom Mug",
    image: "/images/occassion/scarlet-occasionbox3.png",
  },
  {
    id: "valentines",
    title: "Valentine's Gifts",
    description: "Send her love in the most special way",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-pink-600",
    imagePlaceholder: "Heart Pillow",
    image: "/images/occassion/scarlet-occasionbox4.png",
  },
]

export function OccasionsGridHer() {
  return (
    <section className="py-12 bg-white overflow-hidden perspective-1000">
      <div className="container px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Gifts For Every Occasion{" "}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <Heart className="w-5 h-5 text-primary fill-transparent" />
            </motion.div>
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          {occasions.map((occ) => (
            <motion.div
              key={occ.id}
              variants={cardPerspective}
              className={`${occ.bgColor} rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full min-h-[220px]`}
            >
              {occ.image && (
                <div className="absolute inset-0">
                  <Image
                    src={occ.image}
                    alt={occ.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-white/10 pointer-events-none" />

              <div className="relative z-10 max-w-[55%] flex flex-col h-full">
                <h3 className={`font-bold text-xl mb-2 ${occ.titleColor}`}>
                  {occ.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {occ.description}
                </p>

                <Link
                  href={`/gifts-for-her/${occ.id}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors mt-auto"
                >
                  Shop Now{" "}
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {!occ.image && (
                <div className="absolute right-0 bottom-0 w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 translate-x-4 translate-y-4">
                  <div className="w-full h-full bg-white/50 backdrop-blur rounded-full flex items-center justify-center border border-white shadow-sm p-4 text-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {occ.imagePlaceholder}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}