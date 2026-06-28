"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function RelatedCategories() {
  const categories = [
    {
      name: "Gifts For Her",
      href: "/gifts-for-her",
      icon: "/images/relatedproduct/scarlet-gift.png",
    },
    {
      name: "Newborn & Kids",
      href: "/kids-babies",
      icon: "/images/relatedproduct/scarlet-teddy.png",
    },
    {
      name: "Custom Orders",
      href: "/custom",
      icon: "/images/relatedproduct/scarlet-pencil.png",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-transparent border-t border-border/40">
      <motion.div initial={{ opacity: 0, y: 30, filter: "blur(5px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, ease: "easeOut" }} className="container px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.href}
              className="bg-transparent md:bg-[#FFF8FB] rounded-xl px-2 md:px-5 py-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 shadow-none md:shadow-sm hover:shadow-md transition-all group border border-transparent md:border-[#F7EAF0] min-h-[120px] md:min-h-[105px]"
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${cat.icon}')`,
                }}
              />

              <div className="text-center md:text-left">
                <h4 className="font-bold text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors md:mb-2">
                  {cat.name}
                </h4>

                <span className="hidden md:flex text-xs font-medium text-muted-foreground items-center gap-1 group-hover:text-primary transition-colors">
                  Shop Now
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  )
}