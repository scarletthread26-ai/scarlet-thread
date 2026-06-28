"use client"

import { motion } from "framer-motion"
import { Baby, Shirt, Bath, Layers, ToyBrick, Backpack, BedDouble, Gift } from "lucide-react"

export function CategoryIconsKids() {
  const categories = [
    { name: "Newborn Gifts", icon: <Baby strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Baby Clothing", icon: <Shirt strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Hooded Towels", icon: <Bath strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Blankets & Wraps", icon: <Layers strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Soft Toys", icon: <ToyBrick strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Backpacks", icon: <Backpack strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Bedding Sets", icon: <BedDouble strokeWidth={1.5} className="w-8 h-8" /> },
    { name: "Return Gifts", icon: <Gift strokeWidth={1.5} className="w-8 h-8" /> },
  ]

  return (
    <section className="py-6 md:py-10 bg-white border-b border-border/40">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="flex overflow-x-auto pb-4 md:pb-0 hide-scrollbar gap-4 md:gap-6 justify-start lg:justify-center"
        >
          {categories.map((cat, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] cursor-pointer group"
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
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center text-[#FF69B4] group-hover:bg-[#FF69B4] group-hover:text-white transition-all duration-300 shadow-sm border border-[#FF69B4]/20 group-hover:border-transparent relative overflow-hidden"
              >
                {/* Glow Effect */}
                <motion.div
                  className="hidden md:block absolute inset-0 rounded-2xl border border-[#FF69B4]/20"
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
                  className="relative flex items-center justify-center z-10"
                >
                  {cat.icon}
                </motion.div>
              </motion.div>
              <motion.span 
                whileHover={{ y: -2 }}
                className="text-xs md:text-sm font-medium text-center text-foreground group-hover:text-[#FF69B4] transition-colors duration-300 line-clamp-2"
              >
                {cat.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}
