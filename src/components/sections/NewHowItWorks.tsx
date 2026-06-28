"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

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

const arrowDownVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.8,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function NewHowItWorks() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    setIsDesktop(media.matches)
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* ── Lavender outer rounded container ── */}
        <div className="bg-[#EEE8FA] rounded-[28px] px-4 py-8 sm:px-8 md:px-12 md:py-12">
          {/* Heading */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1530] uppercase text-center tracking-wide mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headingVariants}
          >
            Creating Your Perfect Custom Gift
          </motion.h2>

          {/* ── Steps row ── */}
          <motion.div
            className="flex flex-col md:flex-row items-stretch gap-1.5 md:gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <StepCard
              number="1"
              title="Choose Your Product"
              desc="Find your favorite base product and complete secure payment to lock in your order."
              image="/images/heropage/scarlet-heartbag.png"
              isDesktop={isDesktop}
            />

            {/* Arrow */}
            <motion.div className="hidden md:flex items-center flex-shrink-0 text-[#9B6BD3]" variants={arrowRightVariants}>
              <ArrowRightIcon />
            </motion.div>
            <motion.div className="flex md:hidden justify-center text-[#9B6BD3] my-0" variants={arrowDownVariants}>
              <ArrowDownIcon />
            </motion.div>

            <StepCard
              number="2"
              title="WhatsApp Us Details"
              desc="Check your email confirmation for your order details and share your design idea with us on WhatsApp."
              image="/images/heropage/scarlet-phone.png"
              isDesktop={isDesktop}
            />

            {/* Arrow */}
            <motion.div className="hidden md:flex items-center flex-shrink-0 text-[#9B6BD3]" variants={arrowRightVariants}>
              <ArrowRightIcon />
            </motion.div>
            <motion.div className="flex md:hidden justify-center text-[#9B6BD3] my-0" variants={arrowDownVariants}>
              <ArrowDownIcon />
            </motion.div>

            <StepCard
              number="3"
              title="Mockup & Approval"
              desc="We create a realistic digital mockup for your review. Give us your final thumbs up before we craft!"
              image="/images/heropage/scarlet-laptop.png"
              isDesktop={isDesktop}
            />

            {/* Arrow */}
            <motion.div className="hidden md:flex items-center flex-shrink-0 text-[#9B6BD3]" variants={arrowRightVariants}>
              <ArrowRightIcon />
            </motion.div>
            <motion.div className="flex md:hidden justify-center text-[#9B6BD3] my-0" variants={arrowDownVariants}>
              <ArrowDownIcon />
            </motion.div>

            <StepCard
              number="4"
              title="We Craft & Ship"
              desc="Once approved, our team creates your unique gift with care and ships it straight to your doorstep."
              image="/images/heropage/scarlet-delivery.png"
              isDesktop={isDesktop}
            />
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
}: {
  number: string
  title: string
  desc: string
  image?: string
  isDesktop: boolean
}) {
  const cardVariants = isDesktop ? stepDesktopVariants : stepMobileVariants
  return (
    <motion.div
      className="relative flex-1 bg-white rounded-[18px] px-3.5 pt-6 pb-3.5 md:px-5 md:pt-8 md:pb-5
                 shadow-[0_4px_20px_rgba(107,70,193,0.08)] border border-[#EDE6F8]
                 flex flex-col overflow-visible"
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Number badge — overlaps top-left edge, overflow-visible keeps it visible */}
      <div className="absolute -top-4 left-3 w-9 h-9 rounded-full bg-[#6F35C4] text-white flex items-center justify-center text-sm font-bold shadow-md z-10 select-none">
        {number}
      </div>

      {/* Row on desktop/tablet, stacked on mobile */}
      <div className="flex flex-row items-center md:items-end justify-between gap-3 md:gap-2 flex-1">
        {/* Text */}
        <div className="flex-1 min-w-0 md:self-start">
          <h3 className="text-[13px] md:text-sm font-bold text-[#1A1530] mb-1.5 leading-snug">
            {title}
          </h3>
          <p className="text-[11px] text-[#8B8194] leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Image container */}
        <div className="relative flex-shrink-0 w-[85px] h-[85px] md:w-[115px] md:h-[115px] md:self-end">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain md:object-cover"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

function PersonalizeBox() {
  return (
    <div className="w-[150px] sm:w-[180px] flex-shrink-0 bg-white rounded-2xl border border-[#EFE6F7] shadow-[0_6px_25px_rgba(107,70,193,0.08)] p-3 sm:p-4">
      <label className="text-[11px] text-[#8B8194] block mb-1">
        Enter Name
      </label>

      <div className="h-9 rounded-md border border-[#E7DFF0] text-xs flex items-center px-3 text-[#2B2238] font-medium mb-3">
        Ayesha
      </div>

      <p className="text-[11px] text-[#8B8194] mb-1">Choose Font</p>

      <div className="flex gap-1.5 mb-3">
        {["Abc", "Abc", "Abc"].map((font, index) => (
          <span
            key={index}
            className="text-xs border border-[#E7DFF0] rounded px-2 py-1 text-[#2B2238]"
          >
            {font}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-[#8B8194] mb-2">Thread Color</p>

      <div className="flex gap-2">
        {["#6F35C4", "#26A69A", "#4F8DF7", "#F6A623", "#E94B5A", "#111827"].map(
          (color) => (
            <span
              key={color}
              className="w-4 h-4 rounded-full border border-white shadow"
              style={{ backgroundColor: color }}
            />
          )
        )}
      </div>
    </div>
  )
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

function ArrowDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 48"
      fill="none"
      className="w-4 h-8"
    >
      <path
        d="M12 4V42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d="M6 36L12 42L18 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}