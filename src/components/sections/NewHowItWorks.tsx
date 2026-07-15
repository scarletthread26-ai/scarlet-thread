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
    transition: { staggerChildren: 0.15 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
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
    number: "01",
    title: "Select & Prepay",
    description:
      "Find your favorite base product (hoodie, tee, cap, etc.) and complete secure payment to lock in your order slot.",
    image: "/images/heropage/scarlet-heartbag.png",
    color: "#FDF4FF",
  },
  {
    number: "02",
    title: "Whatsapp Us Details",
    description:
      "Check your email confirmation for your Order id # and a direct link to chat with us on WhatsApp. Share your design idea!",
    image: "/images/heropage/scarlet-phone.png",
    color: "#F4F6FF",
  },
  {
    number: "03",
    title: "Mockup & Approval",
    description:
      "We create a realistic digital mockup for your review. Give us your final 'Thumbs Up' before we craft!",
    image: "/images/heropage/scarlet-laptop.png",
    color: "#FFF9F4",
  },
  {
    number: "04",
    title: "We Craft & Ship!",
    description:
      "Once approved, our team produces your unique gift with care and ships it straight to your door!",
    image: "/images/heropage/scarlet-delivery.png",
    color: "#F4FFF7",
  },
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
  const formattedTitle =
    typeof title === "string"
      ? title.split(/(Custom Gift)/i).map((part: string, i: number) =>
          part.toLowerCase() === "custom gift" ? (
            <span key={i} className="text-primary">
              {part}
            </span>
          ) : (
            part
          )
        )
      : title
  const steps = section?.content?.steps || defaultSteps

  return (
    <section className="md:py-5 md:py-2 bg-white">
      <div className="max-w-[1420px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="rounded-[28px] py-8 sm:px-2 md:px-4 lg:px-6 md:py-12">

          {/* ── Heading ── */}
          <div className="text-center mb-10 md:mb-16">
            <motion.h2
              className="text-[26px] md:text-3xl font-bold text-[#1A1530] "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headingVariants}
            >
            Creating your perfect <br className="md:hidden" /> <span className="text-primary ">Custom Gift</span> 
            </motion.h2>
            <motion.p
              className="text-[13px] md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={headingVariants}
            >
              Our simple 4-step process makes creating your perfect custom gift
              quick and effortless
            </motion.p>
          </div>

          {/* ── MOBILE: Vertical stacked cards ── */}
          <motion.div
            className="flex flex-col gap-0 md:hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {steps.map((step: any, index: number) => {
              const s = defaultSteps[index] ?? {}
              const num = step.number ?? s.number ?? String(index + 1)
              const bg = step.color ?? s.color ?? "#ffffff"
              const img = s.image
              const isLast = index === steps.length - 1

              return (
                <React.Fragment key={num}>
                  <motion.div variants={stepVariants}>
                    <MobileStepCard
                      number={num}
                      title={step.title}
                      desc={step.description || step.desc}
                      image={img}
                      bgColor={bg}
                      link={index === 0 ? "/products" : undefined}
                    />
                  </motion.div>

                  {/* Dashed down arrow between cards */}
                  {!isLast && (
                    <motion.div
                      className="flex justify-center py-1"
                      variants={stepVariants}
                    >
                      <ArrowDownDashed />
                    </motion.div>
                  )}
                </React.Fragment>
              )
            })}
          </motion.div>

          {/* ── DESKTOP: Horizontal row ── */}
          <motion.div
            className="hidden md:flex flex-row items-stretch gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {steps.map((step: any, index: number) => (
              <React.Fragment key={step.number || index}>
                <DesktopStepCard
                  number={step.number || String(index + 1)}
                  title={step.title}
                  desc={step.description || step.desc}
                  image={defaultSteps[index]?.image}
                  link={index === 0 ? "/products" : undefined}
                  bgColor={step.color || defaultSteps[index]?.color || "#ffffff"}
                />

                {index < steps.length - 1 && (
                  <motion.div
                    className="flex items-center flex-shrink-0 text-[#9B6BD3]"
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

/* ── Mobile Step Card ── */
function MobileStepCard({
  number,
  title,
  desc,
  image,
  bgColor,
  link,
}: {
  number: string
  title: string
  desc: string
  image?: string
  bgColor?: string
  link?: string
}) {
  const inner = (
    <div
      className="relative flex flex-row items-center gap-3 rounded-2xl px-4 py-5 shadow-[0_4px_20px_rgba(107,70,193,0.08)] border border-[#EDE6F8] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Number badge — top-left corner */}
      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#6F35C4] text-white flex items-center justify-center text-xs font-bold shadow-md z-10 select-none flex-shrink-0">
        {number}
      </div>

      {/* Image — left side */}
      <div className="relative w-[120px] h-[110px] flex-shrink-0 mt-3">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            sizes="120px"
          />
        )}
      </div>

      {/* Text — right side */}
      <div className="flex flex-col flex-1 pt-1">
        <h3 className="text-[15px] font-bold text-primary mb-1 leading-snug">
          {title}
        </h3>
        <p className="text-[12px] text-black/70 leading-relaxed">{desc}</p>
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ── Desktop Step Card ── */
function DesktopStepCard({
  number,
  title,
  desc,
  image,
  bgColor,
  link,
}: {
  number: string
  title: string
  desc: string
  image?: string
  bgColor?: string
  link?: string
}) {
  const content = (
    <motion.div
      className={`relative flex-1 rounded-[30px] px-2 pt-6 pb-2 md:px-3 md:pt-8 md:pb-3 
                 shadow-[0_4px_20px_rgba(107,70,193,0.08)] md:hover:shadow-[0_12px_32px_rgba(107,70,193,0.15)] transition-shadow duration-300
                 border border-[#EDE6F8] flex flex-col overflow-visible ${link ? "cursor-pointer select-none" : ""}`}
      style={{ backgroundColor: bgColor }}
      variants={stepVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Number badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#6F35C4] text-white flex items-center justify-center text-sm font-bold shadow-md z-10 select-none">
        {number}
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full gap-4">
        {/* Image */}
        <div className="relative w-full h-[150px] rounded-[10px] overflow-hidden flex items-center justify-center p-3">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col items-center text-center w-full px-1 pb-2">
          <h3 className="text-sm md:text-base font-bold text-primary mb-1 tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] md:text-[12px] text-black/80">{desc}</p>
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

/* ── Icons ── */
function ArrowDownDashed() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 32"
      fill="none"
      className="w-5 h-7 text-[#9B6BD3]"
    >
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d="M6 16L12 22L18 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
