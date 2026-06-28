"use client"

import { motion } from "framer-motion"
import { Droplet, ShieldCheck, Smile, Gift } from "lucide-react"

export function MidValuePropsKids() {
  const props = [
    {
      icon: <Droplet className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Gentle on Skin",
      desc: "Made with baby safe, hypoallergenic materials"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Highly Durable",
      desc: "Stitched to last through every hug & wash"
    },
    {
      icon: <Smile className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Unique & Personal",
      desc: "Add name, initials or cute designs"
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Perfect for Gifting",
      desc: "Premium packaging, ready to surprise"
    }
  ]

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 bg-[#FFF5F8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-sm"
        >
          {props.map((prop, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="flex flex-col items-center text-center md:flex-row md:text-left gap-2 sm:gap-3 md:gap-4 flex-1 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm border border-primary/10 text-primary">
                {prop.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#6E3B9B] mb-0.5 sm:mb-1">{prop.title}</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{prop.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
