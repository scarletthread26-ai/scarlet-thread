"use client"
import { motion } from "framer-motion"
import { Gift, Heart, Truck, Package, ShieldCheck } from "lucide-react"
import { staggerContainer, rotateXPerspective } from "@/lib/animations"

export function ValuePropsHer() {
  const props = [
    {
      icon: <Gift className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Premium Quality",
      desc: "Finest materials & attention to detail"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Made With Love",
      desc: "Every piece is handcrafted with care"
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Fast Delivery",
      desc: "Quick & safe delivery across India"
    },
    {
      icon: <Package className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Gift Ready Packaging",
      desc: "Beautifully packed & ready to surprise"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Secure Payment",
      desc: "100% secure payment guaranteed"
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
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-7xl mx-auto">
          {props.map((prop, index) => (
            <motion.div 
              key={index} 
              variants={rotateXPerspective}
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 flex-1 min-w-[150px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {prop.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary mb-1">{prop.title}</h4>
                <p className="text-[11px] leading-tight text-muted-foreground">{prop.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
