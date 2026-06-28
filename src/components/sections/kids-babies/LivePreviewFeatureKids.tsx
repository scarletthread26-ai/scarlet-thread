"use client"

import { Gift, Type, Truck, ArrowRight, Eye, Scissors, Smile } from "lucide-react"
import { motion, Variants } from "framer-motion"

export function LivePreviewFeatureKids() {
  const steps = [
    { icon: <Gift strokeWidth={1.5} className="w-6 h-6" />, title: "Choose Your Gift", desc: "Pick your favorite product" },
    { icon: <Type strokeWidth={1.5} className="w-6 h-6" />, title: "Personalize It", desc: "Add name or design" },
    { icon: <Eye strokeWidth={1.5} className="w-6 h-6" />, title: "Preview Design", desc: "See how it looks" },
    { icon: <Scissors strokeWidth={1.5} className="w-6 h-6" />, title: "We Craft It", desc: "Handmade with love" },
    { icon: <Truck strokeWidth={1.5} className="w-6 h-6" />, title: "Fast Delivery", desc: "To your doorstep" },
    { icon: <Smile strokeWidth={1.5} className="w-6 h-6" />, title: "Happy Customer", desc: "A smile on their face" },
  ]

  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" } 
    },
  }

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Single unified pink background */}
        <div className="rounded-[20px] sm:rounded-[32px] overflow-hidden bg-[#FFF0F5] flex flex-col lg:flex-row items-stretch shadow-sm border border-pink-100 min-h-[200px] sm:min-h-[260px]">

          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:w-[35%] w-full flex-shrink-0 relative overflow-hidden h-[200px] sm:h-[240px] lg:h-auto"
          >
            <img
              src="/images/scarlet-secondbanner.png"
              alt="Personalized baby gifts"
              className="w-full h-full object-cover object-center"
            />
            {/* Fade */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#FFF0F5]" />
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#FFF0F5] to-transparent" />
          </motion.div>

          {/* Right: 6 Steps */}
          <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-10 py-6 sm:py-10 text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground inline-flex items-center gap-2 mb-8 sm:mb-12 justify-center lg:justify-start w-full"
            >
              How It Works
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </motion.h2>

            {/* MOBILE SNAKE GRID (lg:hidden) */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                show: { transition: { staggerChildren: 0.2 } }
              }}
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
                    variants={{
                      hidden: { opacity: 0, y: 15, scale: 0.9 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" } }
                    }}
                    className={`relative flex flex-col items-center text-center group ${orderClass}`}
                  >
                    <div className="relative z-10 w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-primary shadow-sm border-2 border-primary/20 mb-3 transition-all duration-300 group-hover:border-primary group-hover:-translate-y-1">
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-xs text-primary mb-1 group-hover:text-[#c86dd7] transition-colors">{step.title}</h4>
                    <p className="text-[10px] text-muted-foreground">{step.desc}</p>

                    {/* Connectors */}
                    {index === 0 && (
                      <div className="absolute top-6 left-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 0 12 L 100 12" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 90 7 L 100 12 L 90 17" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 12 0 L 12 32" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 7 26 L 12 32 L 17 26" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-6 right-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 100 12 L 0 12" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 10 7 L 0 12 L 10 17" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 12 0 L 12 32" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 7 26 L 12 32 L 17 26" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 4 && (
                      <div className="absolute top-6 left-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 0 12 L 100 12" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 90 7 L 100 12 L 90 17" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>

            {/* DESKTOP GRID (lg:grid) */}
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                show: { transition: { staggerChildren: 0.15 } }
              }}
              className="hidden lg:grid grid-cols-3 gap-y-12 gap-x-6 relative"
            >
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 15 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="flex flex-col items-center text-center relative z-10 group"
                >
                  <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center text-primary shadow-sm border-2 border-primary/20 mb-4 transition-all duration-300 group-hover:border-primary group-hover:-translate-y-1">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-sm text-primary mb-2 group-hover:text-[#c86dd7] transition-colors">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}