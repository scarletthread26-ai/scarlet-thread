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

import { useTestimonials } from "@/hooks/use-cms"

const testimonials = [
  {
    id: "1",
    name: "Rahul Mehta",
    role: "Verified Buyer",
    content:
      "The hoodie I ordered for my wife is beyond perfect. The embroidery, quality and packaging everything was amazing!",
    avatar: "R",
  },
  {
    id: "2",
    name: "Neha Kapoor",
    role: "Verified Buyer",
    content:
      "She loved the personalized jewelry box. Thank you for making our anniversary so special!",
    avatar: "N",
  },
  {
    id: "4",
    name: "Ananya Sharma",
    role: "Verified Buyer",
    content:
      "Amazing product quality and very cute packaging. I will definitely order again.",
    avatar: "A",
  },
  {
    id: "5",
    name: "Priya Nair",
    role: "Verified Buyer",
    content:
      "The custom gift looked premium and exactly like I wanted. Loved the finishing.",
    avatar: "P",
  },
  {
    id: "6",
    name: "Meera Das",
    role: "Verified Buyer",
    content:
      "Fast delivery, beautiful personalization and perfect gift packaging.",
    avatar: "M",
  },
]

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const { data: dbTestimonials } = useTestimonials()

  const displayedTestimonials = React.useMemo(() => {
    if (!dbTestimonials || dbTestimonials.length === 0) {
      return testimonials
    }

    return dbTestimonials
      .filter((t) => t.is_active !== false)
      .map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role || "Verified Buyer",
        content: t.comment,
        avatar: t.avatar_url || t.name.charAt(0).toUpperCase(),
      }))
  }, [dbTestimonials])

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
    <section className="hidden md:block py-16 bg-secondary/30 overflow-hidden perspective-1000">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-heading font-bold flex items-center justify-center gap-2">
            What Our Customers Say
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 text-primary fill-transparent ml-2 drop-shadow-sm" />
            </motion.div>
          </h2>
          <p className="text-muted-foreground mt-2">
            Real stories from real customers
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 60, damping: 15 }}
          className="relative px-4 md:px-12"
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
              {displayedTestimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                    className="h-full"
                  >
                    <Card className="rounded-[2rem] border border-primary/10 shadow-sm bg-background/40 h-full hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.2)] transition-shadow duration-500 backdrop-blur-sm">
                      <CardContent className="p-8 h-full flex flex-col relative overflow-hidden group">
                        
                        {/* Decorative Background Element */}
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                        {/* Stars */}
                        <div className="flex gap-1.5 mb-6 relative z-10">
                          {[...Array(5)].map((_, i) => (
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
                        <p className="text-[15px] leading-relaxed text-foreground/80 flex-grow relative z-10 font-medium">
                          &quot;{testimonial.content}&quot;
                        </p>

                        {/* User */}
                        <div className="flex items-center gap-4 mt-8 relative z-10">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-[3px] border-background shadow-md group-hover:border-primary/20 transition-colors duration-300 flex items-center justify-center bg-primary/20 text-primary font-bold text-xl">
                            {testimonial.avatar.startsWith("http") || testimonial.avatar.startsWith("/") ? (
                              <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                            ) : (
                              testimonial.avatar
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-[15px] text-foreground group-hover:text-primary transition-colors duration-300">
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
              <CarouselPrevious className="border-primary/20 hover:bg-primary/5 hover:text-primary hover:scale-110 transition-transform duration-300 -left-12 w-10 h-10 shadow-sm" />
              <CarouselNext className="border-primary/20 hover:bg-primary/5 hover:text-primary hover:scale-110 transition-transform duration-300 -right-12 w-10 h-10 shadow-sm" />
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
                    ? "w-10 h-2.5 bg-gradient-to-r from-primary to-primary/80 shadow-md" 
                    : "w-2.5 h-2.5 bg-primary/20 hover:bg-primary/40"
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