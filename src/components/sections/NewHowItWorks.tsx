"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useHomepageSection } from "@/hooks/use-cms"

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const stepMobileVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const stepDesktopVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const arrowRightVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.8,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}



const defaultSteps = [
  {
    number: "1",
    title: "Select a Product",
    description: "Find your favorite base product (hoodie, tee, cap, etc.) and complete secure payment to lock in your order slot.",
    image: "/images/heropage/scarlet-heartbag.png"
  },
  {
    number: "2",
    title: "Personalize Details",
    description: "Check your email confirmation for your Order # and a direct link to chat with us on WhatsApp. Share your design idea!",
    image: "/images/heropage/scarlet-phone.png"
  },
  {
    number: "3",
    title: "Meticulous Crafting",
    description: "We create a realistic digital mockup for your review. Give us your final 'Thumbs Up' before we craft!",
    image: "/images/heropage/scarlet-laptop.png"
  },
  {
    number: "4",
    title: "Gift-Wrapped Delivery",
    description: "Once approved, our team produces your unique gift with care and ships it straight to your door!",
    image: "/images/heropage/scarlet-delivery.png"
  }
]

export function NewHowItWorks() {
  const [isDesktop, setIsDesktop] = useState(false)
  const { data: section } = useHomepageSection("how-it-works")

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    setIsDesktop(media.matches)
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  const title = section?.title || "Creating Your Perfect Custom Gift"
  const formattedTitle = typeof title === 'string'
    ? title.split(/(Custom Gift)/i).map((part: string, i: number) =>
        part.toLowerCase() === "custom gift" ? (
          <span key={i} className="text-primary">
            {part}
          </span>
        ) : (
          part
        )
      )
    : title;
  const steps = section?.content?.steps || defaultSteps

  return (
    <section className="py-5 md:py-2 bg-white">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* ── Lavender outer rounded container ── */}
        <div className="rounded-[28px] py-8 sm:px-2 md:px-4 lg:px-6 md:py-12">
          {/* Heading */}
          <div className="text-start sm:text-center mb-12 md:mb-16">
            <motion.h2
              className="text-[20px] md:text-3xl font-bold text-[#1A1530]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headingVariants}
            >
              {formattedTitle}
            </motion.h2>
            <motion.p
              className="text-[13px] md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headingVariants}
            >
              Our simple 4-step process makes creating your perfect custom gift quick and effortless
            </motion.p>
          </div>
        

          {/* ── Steps row ── */}
          <motion.div
            className="grid grid-cols-1 md:flex md:flex-row items-stretch gap-4 md:gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {steps.map((step: any, index: number) => (
              <React.Fragment key={step.number || index}>
                <StepCard
                  number={step.number || String(index + 1)}
                  title={step.title}
                  desc={step.description || step.desc}
                  image={defaultSteps[index]?.image}
                  isDesktop={isDesktop}
                  link={index === 0 ? "/products" : undefined}
                />
                
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:flex items-center flex-shrink-0 text-[#9B6BD3]" 
                    variants={arrowRightVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <ArrowRightIcon />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StepCard({
  number,
  title,
  desc,
  image,
  isDesktop,
  link,
}: {
  number: string
  title: string
  desc: string
  image?: string
  isDesktop: boolean
  link?: string
}) {
  const cardVariants = isDesktop ? stepDesktopVariants : stepMobileVariants
  const content = (
    <motion.div
      className={`relative flex-1 bg-white rounded-[10px] px-2 pt-6 pb-2 md:px-3 md:pt-8 md:pb-3
                 shadow-[0_4px_20px_rgba(107,70,193,0.08)] border border-[#EDE6F8]
                 flex flex-col overflow-visible ${link ? "cursor-pointer select-none" : ""}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Number badge — overlaps top-center edge, overflow-visible keeps it visible */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#6F35C4] text-white flex items-center justify-center text-sm font-bold shadow-md z-10 select-none">
        {number}
      </div>

      {/* Responsive layout: row on mobile, stacked on desktop */}
      <div className="flex flex-row md:flex-col items-center justify-center flex-1 w-full gap-3 md:gap-4">
        {/* Image container on left for mobile, top for desktop */}
        <div className="relative flex-1 aspect-square md:flex-none md:w-full md:aspect-auto md:h-[150px] rounded-[10px] overflow-hidden flex items-center justify-center p-2 md:p-3 shrink-0">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center md:justify-start items-center text-center flex-1 aspect-square md:flex-none md:aspect-auto w-full p-3 md:px-1 md:py-0 bg-[#F9F5FF] md:bg-transparent rounded-[10px] md:rounded-none">
          <h3 className="text-sm md:text-base font-bold text-primary mb-1 md:mb-2  tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] md:text-[12px] text-black/80">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  )

  if (link) {
    return (
      <Link href={link} className="flex-1 flex flex-col">
        {content}
      </Link>
    )
  }

  return content
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 24"
      fill="none"
      className="w-12 h-6"
    >
      <path
        d="M4 12H42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d="M36 6L42 12L36 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

