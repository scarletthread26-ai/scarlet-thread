"use client"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/animations"
import { Shirt, Bath, Box, Coffee, Briefcase, Gift, PartyPopper } from "lucide-react"
import Image from "next/image"

export function CategoryIcons() {
  const categories = [
    { name: "Hoodies", icon: "/images/forhimicons/scarlet-hoodieicon.png" },
    { name: "Sweatshirts", icon: "/images/forhimicons/scarlet-sweatshirt.png" },
    { name: "Towels", icon: "/images/forhimicons/scarlet-towelicon.png" },
    { name: "Gift Boxes", icon: "/images/forhimicons/scarlet-giftbox1.png" },
    { name: "Mugs", icon: "/images/forhimicons/scarlet-mug2.png" },
    { name: "Travel Pouches", icon: "/images/forhimicons/scarlet-pouchicon2.png" },
    { name: "Birthday Gifts", icon: "/images/forhimicons/scarlet-gifticon2.png" },
    { name: "Anniversary Gifts", icon: "/images/forhimicons/scarlet-anniverseryicon.png" },
  ]

  return (
    <section className="py-6 md:py-10 bg-white border-b border-border/40">
      <div className="container px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex overflow-x-auto pb-4 md:pb-0 hide-scrollbar gap-4 md:gap-6 justify-start lg:justify-center"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              variants={fadeUp(0.6, 30)}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center gap-2 md:gap-3 min-w-[76px] md:min-w-[110px] cursor-pointer group"
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-secondary flex items-center justify-center text-primary transition-all duration-300 shadow-sm border border-transparent group-hover:shadow-md group-hover:border-primary/20 overflow-hidden"
              >
                {/* Glow Effect */}
                <motion.div
                  className="hidden md:block absolute inset-0 rounded-xl border border-primary/20"
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.2, 0.7, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />

                {typeof cat.icon === "string" ? (
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3 + index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-24 h-28 md:w-30 md:h-36"
                  >
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      sizes="96px"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3 + index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    {cat.icon}
                  </motion.div>
                )}
              </motion.div>

              <motion.span
                whileHover={{ y: -2 }}
                className="text-xs md:text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2"
              >
                {cat.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>

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