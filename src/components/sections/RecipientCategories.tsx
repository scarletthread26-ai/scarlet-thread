"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "him",
    title: "HIM",
    image: "/images/newsection/man.png",
    bgColor: "bg-[#bf99d9]",
    textColor: "text-white",
    accentColor: "bg-white/70",
    href: "/gifts-for-him",
  },
  {
    id: "her",
    title: "HER",
    image: "/images/newsection/lady.png",
    bgColor: "bg-[#fadcdd]",
    textColor: "text-white",
    accentColor: "bg-[#E5485A]/70",
    href: "/gifts-for-her",
  },
  {
    id: "kids",
    title: "KIDS",
    image: "/images/newsection/kids.png",
    bgColor: "bg-[#fad2ad]",
    textColor: "text-[#E5485A]",
    accentColor: "bg-[#E5485A]/70",
    href: "/kids-babies",
  },
];

export function RecipientCategories() {
  return (
    <section className="pb-12 pt-10 md:py-20 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">

        {/* Heading */}
        <div className="w-full mb-8 text-center">
          <h2 className="text-[28px] md:text-3xl font-bold mb-2 sm:mb-3 leading-tight">
            Thoughtful Gifts for<br className="sm:hidden" /> {" "}
            <span className="text-primary">Every Smile</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover thoughtful and unique gifts for everyone on your list,
            carefully selected to bring a smile to their face.
          </p>
        </div>

        {/* MOBILE: Single-column stacked cards */}
        <div className="flex flex-col gap-5 sm:hidden mt-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <Link href={cat.href} className="block relative h-[150px]">
                {/* Background Card */}
                <div
                  className={`absolute inset-0 rounded-2xl ${cat.bgColor} shadow-sm`}
                />

                {/* Text — bottom-left */}
                <div className="absolute left-5 bottom-5 z-20 pointer-events-none">
                  <span
                    className={`block text-[36px] font-black tracking-wide leading-none ${cat.textColor} drop-shadow-sm`}
                  >
                    {cat.title}
                  </span>
                  {/* Underline accent */}
                  <span
                    className={`block mt-1.5 h-[3px] w-8 rounded-full ${cat.accentColor}`}
                  />
                </div>

                {/* Person image — right side, inside the box */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl"
                >
                  <div className="absolute right-0 bottom-0 h-full w-[55%] origin-bottom">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="55vw"
                      className="object-contain object-right-bottom drop-shadow-md"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* TABLET/DESKTOP: Horizontal row (original layout) */}
        <div className="hidden sm:flex flex-row gap-4 md:gap-6 lg:gap-10 pt-2">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-1"
            >
              <Link href={cat.href} className="relative block h-[160px] sm:h-[200px] md:h-[240px] group">
                {/* Background Card */}
                <div
                  className={`absolute inset-0 rounded-[32px] md:rounded-[40px] ${cat.bgColor} shadow-sm group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-300`}
                />

                {/* Title */}
                <div className="relative h-full flex flex-col justify-end px-8 md:px-10 lg:px-12 pb-8 z-30 pointer-events-none group-hover:-translate-y-1 transition-transform duration-300">
                  <span className={`text-[22px] md:text-3xl lg:text-4xl font-sans font-black tracking-wide ${cat.textColor} drop-shadow-sm leading-none`}>
                    {cat.title}
                  </span>
                  <span className={`block mt-1.5 h-[3px] w-8 rounded-full ${cat.accentColor} transition-all duration-300 group-hover:w-12`} />
                </div>

                {/* Overlapping Image */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ clipPath: "inset(-100% 0 0 0 round 0 0 32px 32px)" }}
                >
                  <div className="absolute right-0 bottom-0 h-[120%] w-[80%] origin-bottom">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="33vw"
                      className="object-contain object-right-bottom drop-shadow-md"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
