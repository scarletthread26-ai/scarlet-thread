"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { staggerContainer, cardPerspective } from "@/lib/animations"

const occasions = [
  {
    id: "birthday",
    title: "Birthday Gifts",
    description: "Make his birthday extra special",
    bgColor: "bg-[#FAFAFA]",
    imagePlaceholder: "Gift Box 1",
    image: "/images/forhimpage/scarlet-blackbox.png",
  },
  {
    id: "anniversary",
    title: "Anniversary Gifts",
    description: "Celebrate your special bond",
    bgColor: "bg-[#FFF5F5]",
    titleColor: "text-red-500",
    imagePlaceholder: "Gift Box 2",
    image: "/images/forhimpage/scarlet-redbox2.png",
  },
  {
    id: "fathers-day",
    title: "Father's Day Gifts",
    description: "Thank him for being your hero",
    bgColor: "bg-[#FDF8EB]",
    imagePlaceholder: "Super Dad Pouch",
    image: "/images/forhimpage/scarlet-superdeal.png",
  },
  {
    id: "boyfriend",
    title: "Gifts For Boyfriend",
    description: "Because he deserves the best",
    bgColor: "bg-[#F5F3FF]",
    titleColor: "text-primary",
    imagePlaceholder: "Hubby Hoodie",
    image: "/images/forhimpage/scarlet-hubbyhoodie.png",
  }
]

export function OccasionsGrid() {
  return (
    <section className="py-12 bg-white overflow-hidden perspective-1000">
      <div className="container px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div 
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          {occasions.map((occ) => (
            <motion.div 
              key={occ.id} 
              variants={cardPerspective}
              className={`${occ.bgColor} rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full min-h-[220px]`}
            >
              <div className="relative z-10 w-2/3">
                <h3 className={`font-bold text-xl mb-2 ${occ.titleColor || 'text-foreground'}`}>
                  {occ.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {occ.description}
                </p>
                <Link href={`/gifts-for-him/${occ.id}`} className="inline-flex items-center text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors">
                  Shop Now <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Image Placeholder */}
              {/* Image */}
              <div className="absolute right-0 bottom-0 w-39 h-39 md:w-46 md:h-46 lg:w-55 lg:h-55 translate-x-4 translate-y-4">
                {occ.image ? (
                  <Image
                    src={occ.image}
                    alt={occ.title}
                    fill
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                    className="object-contain object-right-bottom"
                  />
                ) : (
                  <div className="w-full h-full bg-white/50 backdrop-blur rounded-full flex items-center justify-center border border-white shadow-sm p-4 text-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {occ.imagePlaceholder}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
