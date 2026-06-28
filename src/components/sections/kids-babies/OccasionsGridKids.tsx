"use client"

import { ArrowRight, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const occasions = [
  {
    id: "baby-shower",
    title: "Baby Shower Gifts",
    description: "Welcome the little one with a personalized touch.",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-[#9B59B6]",
    image: "/images/scarlet-occassion1.png"
  },
  {
    id: "first-birthday",
    title: "First Birthday Gifts",
    description: "Celebrate their first big milestone in style.",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/scarlet-occassion2.png"
  },
  {
    id: "naming-ceremony",
    title: "Naming Ceremony Gifts",
    description: "Make their special day even more memorable.",
    bgColor: "bg-[#FDF8EB]",
    titleColor: "text-orange-500",
    image: "/images/scarlet-occassion3.png"
  },
  {
    id: "return-gifts",
    title: "Return Gifts",
    description: "Thank your loved ones with cute & useful gifts.",
    bgColor: "bg-[#FFF0F5]",
    titleColor: "text-[#FF69B4]",
    image: "/images/scarlet-occassion4.png"
  }
]

export function OccasionsGridKids() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Gifts For Every Occasion <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {occasions.map((occ) => (
            <motion.div 
              key={occ.id} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className={`${occ.bgColor} rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full min-h-[180px] sm:min-h-[200px] md:min-h-[220px]`}
            >
              <div className="relative z-10 w-full sm:w-2/3">
                <h3 className={`font-bold text-sm sm:text-base md:text-xl mb-1 sm:mb-2 ${occ.titleColor}`}>
                  {occ.title}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-6 line-clamp-2">
                  {occ.description}
                </p>
                <Link href={`/kids-babies/${occ.id}`} className="inline-flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors">
                  Shop Now <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Image Placeholder */}
              <div className="absolute right-0 bottom-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <Image src={occ.image} alt={occ.title} width={200} height={100} className="object-cover rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
