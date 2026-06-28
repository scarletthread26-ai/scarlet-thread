"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart } from "lucide-react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Verified Buyer",
    content: "The quality is amazing and the embroidery is perfect. My baby loves the towel!",
    rating: 5,
    avatar: "PS"
  },
  {
    id: 2,
    name: "Neha Kapoor",
    role: "Verified Buyer",
    content: "Such a cute and unique gift! Everyone at the baby shower loved it.",
    rating: 5,
    avatar: "NK"
  },
  {
    id: 3,
    name: "Rohit Verma",
    role: "Verified Buyer",
    content: "Super soft fabric and beautiful embroidery. Highly recommended!",
    rating: 5,
    avatar: "RV"
  }
]

export function TestimonialsKids() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Auto sliding effect
  React.useEffect(() => {
    if (!api) return

    const autoplay = setInterval(() => {
      api.scrollNext()
    }, 4000) // Slide every 4 seconds

    return () => clearInterval(autoplay)
  }, [api])

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden perspective-1000">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            What Parents Say
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 text-[#FF69B4] fill-transparent ml-2 drop-shadow-sm" />
            </motion.div>
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 60, damping: 15 }}
          className="relative px-4 md:px-12 max-w-5xl mx-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6 py-6">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                    className="h-full"
                  >
                    <Card className="rounded-[2rem] border border-[#FF69B4]/10 shadow-sm bg-background/40 h-full hover:shadow-[0_20px_40px_-15px_rgba(255,105,180,0.2)] transition-shadow duration-500 backdrop-blur-sm group">
                      <CardContent className="p-8 h-full flex flex-col relative overflow-hidden">
                        
                        {/* Decorative Background Element */}
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#FF69B4]/5 rounded-full blur-2xl group-hover:bg-[#FF69B4]/10 transition-colors duration-500" />
                        
                        {/* Decorative top border on hover */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-[#FF69B4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20"></div>

                        {/* Stars */}
                        <div className="flex gap-1.5 mb-6 relative z-10">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + (i * 0.1), type: "spring", stiffness: 300 }}
                            >
                              <Star
                                className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              />
                            </motion.div>
                          ))}
                        </div>

                        {/* Review */}
                        <p className="text-[15px] leading-relaxed text-foreground/80 flex-grow relative z-10 font-medium italic">
                          &quot;{testimonial.content}&quot;
                        </p>

                        {/* User */}
                        <div className="flex items-center gap-4 mt-8 relative z-10">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-[3px] border-background shadow-md group-hover:border-[#FF69B4]/20 transition-colors duration-300 flex items-center justify-center bg-[#FFF0F5] text-[#FF69B4] font-bold text-xl">
                            {testimonial.avatar}
                          </div>

                          <div>
                            <h4 className="font-bold text-[15px] text-foreground group-hover:text-[#FF69B4] transition-colors duration-300">
                              {testimonial.name}
                            </h4>
                            <p className="text-[13px] text-muted-foreground font-medium mt-0.5">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="border-[#FF69B4]/20 hover:bg-[#FFF0F5] hover:text-[#FF69B4] hover:scale-110 transition-transform duration-300 -left-12 w-10 h-10 shadow-sm" />
              <CarouselNext className="border-[#FF69B4]/20 hover:bg-[#FFF0F5] hover:text-[#FF69B4] hover:scale-110 transition-transform duration-300 -right-12 w-10 h-10 shadow-sm" />
            </div>
          </Carousel>
        </motion.div>

        {/* Dynamic Dots */}
        {count > 0 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`transition-all duration-500 rounded-full ${
                  current === index + 1 
                    ? "w-10 h-2.5 bg-gradient-to-r from-primary to-[#FF69B4] shadow-md" 
                    : "w-2.5 h-2.5 bg-[#FF69B4]/20 hover:bg-[#FF69B4]/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
