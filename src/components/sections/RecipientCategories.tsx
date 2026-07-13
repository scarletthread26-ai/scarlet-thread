"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "him",
    title: "HIM",
    // Placeholder image, replace with actual cutout image
    image: "/images/newsection/man.png",
    bgColor: "bg-[#bf99d9]",
    textColor: "text-white",
    href: "/gifts-for-him",
  },
  {
    id: "her",
    title: "HER",
    image: "/images/newsection/lady.png",
    bgColor: "bg-[#fadcdd]",
    textColor: "text-[#fff5f5]",
    href: "/gifts-for-her",
  },
  {
    id: "kids",
    title: "KIDS",
    image: "/images/newsection/kids.png",
    bgColor: "bg-[#fad2ad]",
    textColor: "text-[#E5485A]",
    href: "/kids-babies",
  },
];

export function RecipientCategories() {
  return (
    <section className="pb-12 pt-20 md:py-20 bg-white">
      <style>{`
        .clip-popout {
          clip-path: inset(-100% 0 0 0 round 0 0 10px 10px);
        }
        @media (min-width: 640px) {
          .clip-popout {
            clip-path: inset(-100% 0 0 0 round 0 0 32px 32px);
          }
        }
        @media (min-width: 768px) {
          .clip-popout {
            clip-path: inset(-100% 0 0 0 round 0 0 40px 40px);
          }
        }
      `}</style>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
       <div className="w-full mb-10">
        <h1 className="text-[22px] md:text-3xl text-start md:text-center font-bold">Thoughtful Gifts for <span className="text-primary"> Every Smile</span> </h1>
       </div>
        <div className="flex flex-row gap-2 sm:gap-4 md:gap-6 lg:gap-10 pt-2">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-1"
            >
              <Link href={cat.href} className="relative block h-[80px] sm:h-[160px] md:h-[200px] group">

                {/* Background Card */}
                <div
                  className={`absolute inset-0 rounded-[10px] sm:rounded-[32px] md:rounded-[40px] ${cat.bgColor} shadow-sm group-hover:shadow-md transition-shadow duration-300`}
                />

                {/* Content Container */}
                <div className="relative h-full flex items-center px-4 sm:px-8 md:px-10 lg:px-12 z-30 pointer-events-none">
                  <span className={`text-[15px] sm:text-[22px] md:text-3xl lg:text-4xl font-sans font-black tracking-wide ${cat.textColor} drop-shadow-sm`}>
                    {cat.title}
                  </span>
                </div>

                {/* Overlapping Image - Pops out of the top only, clipped to card sides/bottom */}
                <div className="absolute inset-0 z-20 pointer-events-none clip-popout">
                  <div className="absolute right-[-15%] sm:right-0 bottom-0 h-[120%] sm:h-[115%] w-[130%] sm:w-[80%] origin-bottom">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 33vw"
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
