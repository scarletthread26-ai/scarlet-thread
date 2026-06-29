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

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [reviews, setReviews] = React.useState<any[]>([])
  const [avgRating, setAvgRating] = React.useState<string>("5.0")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/google-reviews")
        if (res.ok) {
          const data = await res.json()
          const items = data.reviews || []
          setReviews(items)
          if (items.length > 0) {
            const avg = (items.reduce((sum: number, r: any) => sum + r.rating, 0) / items.length).toFixed(1)
            setAvgRating(avg)
          }
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

  if (isLoading) {
    return null
  }

  // Enforce minimum 4 reviews to display
  if (reviews.length < 4) {
    return null
  }

  return (
    <section className="py-16 bg-secondary/20 overflow-hidden perspective-1000">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-10 flex flex-col items-center justify-center space-y-3"
        >
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full shadow-sm">
            {/* Google G Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-xs font-bold text-slate-705 dark:text-slate-200 tracking-wide uppercase">
              Google Customer Reviews
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-2">
            <span>Loved By Our Customers</span>
            <Heart className="w-5 h-5 text-primary fill-primary/10 animate-pulse ml-1" />
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">{avgRating}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-sm text-muted-foreground font-medium">
              Excellent rating based on {reviews.length} customer reviews
            </span>
          </div>
        </motion.div>

        {/* Carousel */}
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
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                    className="h-full"
                  >
                    <Card className="rounded-[2rem] border border-primary/10 shadow-sm bg-background/50 h-full hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.15)] transition-shadow duration-500 backdrop-blur-sm relative group overflow-hidden">
                      <CardContent className="p-8 h-full flex flex-col justify-between">
                        
                        <div>
                          {/* Stars & Source G Icon */}
                          <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-200 dark:text-slate-800"
                                  }`}
                                />
                              ))}
                            </div>
                            
                            {/* Small G Circle */}
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Review Comment */}
                          <p className="text-[14px] leading-relaxed text-foreground/85 font-medium italic">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-3.5 mt-8 border-t border-slate-100 dark:border-slate-805/60 pt-4">
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
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">
                                {review.role}
                              </span>
                            </div>
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