"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const occasions = [
  {
    id: "anniversary",
    cursiveText: "Seasonal",
    mainText: "Favorites",
    image: "/images/anu/anniversarry.png", // Using a fallback image if specific ones don't exist
    href: "/products?category=anniversary",
  },
  {
    id: "birthday",
    cursiveText: "For",
    mainText: "Kids",
    image: "/images/anu/kidsgift.png",
    href: "/products?category=birthday",
  },
  {
    id: "Couple",
    cursiveText: "Hoodie",
    mainText: "Gifts",
    image: "/images/anu/hooodie.png",
    href: "/products?category=wedding",
  },
  {
    id: "romance",
    cursiveText: "Seasonal",
    mainText: "Favorites",
    image: "/images/anu/seasonal.png",
    href: "/products?category=seasonal",
  },
];

export function ForEveryOccasion() {
  return (
    <section className=" pb-5  bg-white overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-5 sm:mb-10 text-center"
        >
          <h2 className="text-[22px] md:text-2xl lg:text-3xl font-heading font-bold text-foreground text-center">
            For Every <span className="text-primary">Occasion</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {occasions.map((occ, index) => (
            <motion.div
              key={occ.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={occ.href} className="block group">
                <div className="relative w-full h-[130px] sm:h-[240px] md:h-[200px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Background Image */}
                  <Image
                    src={occ.image}
                    alt={`${occ.cursiveText} ${occ.mainText}`}
                    fill
                    className="object-cover object-left md:object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 50vw, 50vw"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
