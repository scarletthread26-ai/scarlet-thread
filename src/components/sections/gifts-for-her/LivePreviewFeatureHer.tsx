"use client"
import { motion, Variants } from "framer-motion"
import Image from "next/image"
import { Gift, Type, Truck, Eye, Scissors, Smile } from "lucide-react"
import { springScaleUp } from "@/lib/animations"

export function LivePreviewFeatureHer() {
  const steps = [
    { icon: <Gift strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "Choose Your Gift", desc: "Pick your favorite product" },
    { icon: <Type strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "Personalize It", desc: "Add name or design" },
    { icon: <Eye strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "Preview Design", desc: "See how it looks" },
    { icon: <Scissors strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "We Craft It", desc: "Handmade with love" },
    { icon: <Truck strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "Fast Delivery", desc: "To her doorstep" },
    { icon: <Smile strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />, title: "Happy Customer", desc: "A smile on her face" },
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
    <section className="py-4">
      <motion.div 
        variants={springScaleUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container px-4 sm:px-6 md:px-12 lg:px-24"
      >
        <div className="bg-gradient-to-r from-[#fff7fb] via-[#fdf0f8] to-[#fff7fb] rounded-2xl flex flex-col lg:flex-row items-stretch overflow-hidden shadow-sm border border-[#ead6ec]/60">

          {/* Left: Product Showcase */}
          <div className="relative w-full lg:w-[35%] min-h-[200px] lg:min-h-[400px]">
            <Image
              src="/images/forherproduct/scarlet-personilize.png"
              alt="Personalized gift preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fff7fb]/80 pointer-events-none" />
          </div>

          {/* Right: 6 Steps */}
          <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-8 md:px-10 lg:py-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#3d2b3a] flex items-center gap-2 mb-8 justify-center lg:justify-start">
              How It Works
              <span className="text-xl text-[#9b4bb3]">♡</span>
            </h2>

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
                    <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-transparent flex items-center justify-center text-[#9b4bb3] shadow-sm border-2 border-[#9b4bb3]/20 mb-3 transition-all duration-300 group-hover:border-[#9b4bb3] group-hover:-translate-y-1">
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-xs text-[#8f3ca8] mb-1">{step.title}</h4>
                    <p className="text-[10px] text-[#6f5f70]">{step.desc}</p>

                    {/* Connectors */}
                    {index === 0 && (
                      <div className="absolute top-6 left-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 0 12 L 100 12" stroke="#9b4bb3" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 90 7 L 100 12 L 90 17" stroke="#9b4bb3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 12 0 L 12 32" stroke="#9b4bb3" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 7 26 L 12 32 L 17 26" stroke="#9b4bb3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-6 right-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 100 12 L 0 12" stroke="#9b4bb3" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 10 7 L 0 12 L 10 17" stroke="#9b4bb3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="absolute top-[100%] left-1/2 w-[24px] h-[32px] z-0 pointer-events-none -translate-x-1/2 mt-1">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 12 0 L 12 32" stroke="#9b4bb3" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 7 26 L 12 32 L 17 26" stroke="#9b4bb3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
                        </svg>
                      </div>
                    )}
                    {index === 4 && (
                      <div className="absolute top-6 left-[75%] w-[50%] z-0 pointer-events-none">
                        <svg className="w-full h-[24px] overflow-visible" preserveAspectRatio="none">
                          <motion.path d="M 0 12 L 100 12" stroke="#9b4bb3" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" variants={lineVariants}/>
                          <motion.path d="M 90 7 L 100 12 L 90 17" stroke="#9b4bb3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={lineVariants}/>
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
              className="hidden lg:grid grid-cols-3 gap-y-10 gap-x-4 relative"
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
                  <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center text-[#9b4bb3] shadow-sm border-2 border-[#9b4bb3]/20 mb-3 transition-all duration-300 group-hover:border-[#9b4bb3] group-hover:-translate-y-1">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-xs text-[#8f3ca8] mb-1">{step.title}</h4>
                  <p className="text-[10px] text-[#6f5f70] max-w-[120px]">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}