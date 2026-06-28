"use client"

import Image from "next/image"
import { Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CraftedGalleryKids() {
  const mockImages = [
    { text: "Myra", image: "/images/scarlet-babie1.png" },
    { text: "Aarav", image: "/images/scarlet-gift.png" },
    { text: "Teddy", image: "/images/scarlet-babie3.png" },
    { text: "Little Princess", image: "/images/scarlet-loved4.png" },
    { text: "Princess", image: "/images/scarlet-loved5.png" },
    { text: "Siya", image: "/images/scarlet-loved6.png" },
  ]

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAFA] overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            Loved By Parents, Made For Their Little Ones
            <Heart className="w-5 h-5 text-primary fill-transparent" />
          </h2>
        </motion.div>

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
          className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar justify-start md:justify-center"
        >
          {mockImages.map((img, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 shrink-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md group"
            >
              <div className="relative w-full h-full border border-black/5">
                <Image
                  src={img.image}
                  alt={img.text}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Button
            size="sm"
            className="rounded-full bg-primary text-white hover:bg-primary/90"
          >
            View More Creations
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
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