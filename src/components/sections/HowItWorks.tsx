"use client"

import Image from "next/image"
import { motion, Variants } from "framer-motion"
import { Smile, Eye } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      image: "/images/icons/gift2.png", // Reusing gift icon for product selection
      title: "Choose Product",
      desc: "Pick your favorite product",
    },
    {
      image: "/images/icons/personalize.png",
      title: "Personalize It",
      desc: "Add name, message or design",
    },
    {
      icon: <Eye className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />,
      title: "Preview Design",
      desc: "See exactly how it looks",
    },
    {
      image: "/images/icons/craft.png", // Reuse craft for preview or just use craft
      title: "We Craft It",
      desc: "Our artisans handcraft with love",
    },
    {
      image: "/images/icons/delivery.png",
      title: "Delivered With Love",
      desc: "Delivered to your doorstep on time",
    },
    {
      icon: <Smile className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />,
      title: "Happy Customer",
      desc: "A smile on their face",
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 12,
      } 
    },
  }

  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeInOut" 
      } 
    },
  }

  return (
    <section className="py-8 lg:py-24 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-transparent lg:bg-secondary/20 border border-transparent lg:border-primary/10 rounded-[28px] lg:rounded-[40px] px-4 lg:px-10 py-8 lg:py-16 shadow-none"
        >

          {/* Heading */}
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Create meaningful memories with our easy personalization process
            </p>
          </div>

          {/* MOBILE SNAKE GRID */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:hidden grid grid-cols-2 gap-y-10 gap-x-4 relative"
          >
            {steps.map((step, index) => {
              let orderClass = '';
              if (index === 0) orderClass = 'col-start-1 row-start-1';
              else if (index === 1) orderClass = 'col-start-2 row-start-1';
              else if (index === 2) orderClass = 'col-start-2 row-start-2';
              else if (index === 3) orderClass = 'col-start-1 row-start-2';
              else if (index === 4) orderClass = 'col-start-1 row-start-3';
              else if (index === 5) orderClass = 'col-start-2 row-start-3';

              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  className={`relative flex flex-col items-center text-center group ${orderClass}`}
                >
                  {/* Icon Circle - transparent background */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-transparent border-2 border-primary/20 flex items-center justify-center mb-2 transition-all duration-500 group-hover:border-primary group-hover:-translate-y-1">
                    <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }} transition={{ duration: 0.4 }}>
                      {step.icon ? (
                        step.icon
                      ) : (
                        <Image
                          src={step.image!}
                          alt={step.title}
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      )}
                    </motion.div>
                  </div>

                  <h3 className="font-bold text-foreground text-[13px] leading-tight group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Horizontal Line 1 -> 2 */}
                  {index === 0 && (
                    <div className="absolute top-8 left-[75%] w-[50%] z-0 pointer-events-none">
                      <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                        <motion.path d="M 0 12 L 100 12" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" fill="none" variants={lineVariants}/>
                        <motion.path d="M 90 7 L 100 12 L 90 17" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                      </svg>
                    </div>
                  )}

                  {/* Vertical Line 2 -> 3 */}
                  {index === 1 && (
                    <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <motion.path d="M 12 0 L 12 32" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" fill="none" variants={lineVariants}/>
                        <motion.path d="M 6 26 L 12 32 L 18 26" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                      </svg>
                    </div>
                  )}

                  {/* Horizontal Line 3 -> 4 */}
                  {index === 2 && (
                    <div className="absolute top-8 right-[75%] w-[50%] z-0 pointer-events-none">
                      <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                        <motion.path d="M 100 12 L 0 12" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" fill="none" variants={lineVariants}/>
                        <motion.path d="M 10 7 L 0 12 L 10 17" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                      </svg>
                    </div>
                  )}

                  {/* Vertical Line 4 -> 5 */}
                  {index === 3 && (
                    <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <motion.path d="M 12 0 L 12 32" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" fill="none" variants={lineVariants}/>
                        <motion.path d="M 6 26 L 12 32 L 18 26" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                      </svg>
                    </div>
                  )}

                  {/* Horizontal Line 5 -> 6 (Badge) */}
                  {index === 4 && (
                    <div className="absolute top-8 left-[75%] w-[50%] z-0 pointer-events-none">
                      <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                        <motion.path d="M 0 12 L 100 12" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4" fill="none" variants={lineVariants}/>
                        <motion.path d="M 90 7 L 100 12 L 90 17" vectorEffect="non-scaling-stroke" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                      </svg>
                    </div>
                  )}

                </motion.div>
              )
            })}
          </motion.div>

          {/* DESKTOP FLEX ROW */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="hidden lg:flex flex-row items-center justify-between gap-4 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="relative flex flex-col items-center text-center group flex-1"
              >
                {/* Icon Circle */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-transparent border-2 border-primary/20 flex items-center justify-center mb-5 transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_10px_30px_-5px_rgba(var(--primary),0.3)] group-hover:-translate-y-2">
                  <motion.div whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }} transition={{ duration: 0.4 }}>
                    {step.icon ? (
                      step.icon
                    ) : (
                      <Image
                        src={step.image!}
                        alt={step.title}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    )}
                  </motion.div>
                </div>

                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-[150px]">
                  {step.desc}
                </p>

                {/* Desktop Horizontal Connecting Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-[65%] w-[70%] z-0">
                    <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                      <motion.path 
                        d="M 20 12 L 100 12" 
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--primary)"
                        strokeOpacity="0.3"
                        strokeWidth="2" 
                        strokeDasharray="6 6"
                        fill="none" 
                        variants={lineVariants}
                      />
                      <motion.path 
                        d="M 95 7 L 102 12 L 95 17" 
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--primary)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        fill="none" 
                        variants={lineVariants}
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}