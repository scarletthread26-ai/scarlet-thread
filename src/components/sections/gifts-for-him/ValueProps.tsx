"use client"
import { motion } from "framer-motion"
import { Gift, Heart, Truck, Package } from "lucide-react"
import { staggerContainer, rotateXPerspective } from "@/lib/animations"

export function ValueProps() {
  const props = [
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "Premium Embroidery",
      desc: "Finest threads & attention to every detail"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Made With Love",
      desc: "Every piece is handcrafted with care"
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Fast UAE Delivery", // From image reference
      desc: "Quick & safe delivery across UAE"
    },
    {
      icon: <Package className="w-8 h-8 text-primary" />,
      title: "Gift Ready Packaging",
      desc: "Beautifully packed & ready to surprise"
    }
  ]

  return (
    <section className="py-8 bg-white border-y border-border/40 overflow-hidden">
      <motion.div 
        variants={staggerContainer(0.15, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
        style={{ transformPerspective: 1000 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {props.map((prop, index) => (
            <motion.div 
              key={index} 
              variants={rotateXPerspective}
              className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {prop.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground mb-1">{prop.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{prop.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
