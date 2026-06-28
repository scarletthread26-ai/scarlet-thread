"use client"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/animations"
import Image from "next/image"

export function CategoryIconsHer() {
  const categories = [
    {
      name: "Tote Bags",
      icon: "/images/categoryicons/scarlet-totebag.png",
    },
    {
      name: "Pouches",
      icon: "/images/categoryicons/scarlet-pouch.png",
    },
    {
      name: "Hoodies",
      icon: "/images/categoryicons/scarlet-sweatshirt.png",
    },
    {
      name: "Personalized Jewelry",
      icon: "/images/categoryicons/scarlet-necklace.png",
    },
    {
      name: "Mugs & Bottles",
      icon: "/images/categoryicons/scarlet-bottle.png",
    },
    {
      name: "Towels",
      icon: "/images/categoryicons/scarlet-towel.png",
    },
    {
      name: "Gift Boxes",
      icon: "/images/categoryicons/scarlet-giftbox.png",
    },
    {
      name: "Makeup Pouches",
      icon: "/images/categoryicons/scarlet-pouch.png",
    },
    {
      name: "Desk Essentials",
      icon: "/images/categoryicons/scarlet-desk.png",
    },
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
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-[#FFF8FB] border border-[#F5E8EE] flex items-center justify-center transition-all duration-300 hover:shadow-md hover:border-primary/30 overflow-hidden"
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
                  />
                </motion.div>
              </motion.div>

              <motion.span
                whileHover={{ y: -2 }}
                className="text-xs md:text-sm font-medium text-center text-gray-700 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2"
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