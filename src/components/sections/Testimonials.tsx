"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [reviews, setReviews] = React.useState<any[]>([])
  const [isActive, setIsActive] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/google-reviews")
        if (res.ok) {
          const data = await res.json()
          const items = data.reviews || []
          setReviews(items)
          setIsActive(data.is_active !== false)
        }
      } catch (err) {
        console.warn("Failed to load Google reviews:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadReviews()
  }, [])

  React.useEffect(() => {
    if (!api) return

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
    }, 4500) // Slide every 4.5 seconds

    return () => clearInterval(autoplay)
  }, [api])

  if (isLoading || !isActive) {
    return null
  }

  // Hide if there are no reviews
  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-5 bg-white overflow-hidden perspective-1000">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-2 md:mb-10 flex flex-col items-center justify-center space-y-3"
        >


          <h2 className="text-[22px] md:text-3xl font-heading font-bold flex items-center justify-center gap-2">
            <span>Loved By Our <span className="text-primary">Customers</span></span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 mt-2 sm:mt-3">
            Read what our wonderful customers have to say about their experiences and our personalized gifts.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 60, damping: 15 }}
          className="relative md:px-12"
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
            <CarouselContent className="-ml-6 py-6 md:mx-1">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    className="h-full mx-2 md:mx-0 transition-transform duration-300 md:hover:-translate-y-3 md:hover:scale-[1.02]"
                  >
                    <Card className="rounded-[10px]  shadow-sm bg-background/50 h-full transition-shadow duration-500 backdrop-blur-sm relative group overflow-hidden">
                      <CardContent className="p-8 h-full flex flex-col justify-between">

                        <div>
                          {/* Stars */}
                          <div className="flex gap-1 mb-6 relative z-10">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200 dark:text-slate-800"
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Review Comment */}
                          <p className="text-[14px] leading-relaxed text-foreground/85 font-medium italic">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-2.5 mt-5 border-t border-slate-100 dark:border-slate-805/60 pt-4">
                          <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                            {review.avatar_url ? (
                              <img src={review.avatar_url} alt={review.name} className="w-full h-full object-cover" />
                            ) : (
                              review.name.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <h4 className="font-bold text-[14px] text-foreground">
                              {review.name}
                            </h4>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className=" hover:bg-primary/5 hover:text-primary hover:scale-110 transition-transform duration-300 -left-12 w-10 h-10 shadow-sm" />
              <CarouselNext className=" hover:bg-primary/5 hover:text-primary hover:scale-110 transition-transform duration-300 -right-12 w-10 h-10 shadow-sm" />
            </div>
          </Carousel>
        </motion.div>

        {/* Dynamic Dots */}
        {count > 0 && (
          <div className="hidden md:flex justify-center items-center gap-1 mt-2 md:mt-5">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`transition-all duration-500 rounded-full ${current === index + 1
                  ? "w-5 h-2 bg-gradient-to-r from-primary to-primary/80 shadow-md"
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