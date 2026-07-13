"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react"

const thumbImages = [
  "/images/forhimpage/scarlet-kinghoodie.png",
  "/images/forhimpage/scarlet-hoodie.png",
  "/images/forhimpage/scarlet-papahoodie.png",
  "/images/forhimpage/scarlet-amazinghoodie.png",
  "/images/forhimpage/scarlet-hubbyhoodie.png",
]

export function ProductGallery({ product }: { product?: any }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  


  // Mobile Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const images = product?.images || []
  const displayImages = images.length > 0
    ? images.map((img: any) => img.url)
    : thumbImages



  // Mobile Swipe handlers
  const minSwipeDistance = 50
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      setActiveIdx((prev) => (prev + 1) % displayImages.length)
    } else if (isRightSwipe) {
      setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }
  }

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % displayImages.length)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Image Row */}
      <div className="flex gap-4">
        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="w-[72px] hidden md:flex flex-col gap-3">
            <button 
              onClick={handlePrev}
              className="flex justify-center text-primary/45 hover:text-primary transition-colors py-1 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {displayImages.map((src: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-[72px] h-20 rounded-[10px] overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 bg-[#F5F0EA] ${
                  idx === activeIdx
                    ? "border-purple-600 shadow-md scale-[1.04]"
                    : "border-transparent hover:border-purple-400/50"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Product view ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </button>
            ))}

            <button 
              onClick={handleNext}
              className="flex justify-center text-primary/45 hover:text-primary transition-colors py-1 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Image Container */}
        <div 
          className="flex-1 relative h-[500px] rounded-[10px] overflow-hidden border border-black/5 shadow-sm bg-[#F5F0EA] group cursor-pointer select-none"
          onClick={() => setIsLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={displayImages[activeIdx] || "/images/scarlet-lovedgift1.png"}
            alt={product?.name || "Product Image"}
            fill
            unoptimized
            className="object-cover object-center"
            priority
          />

          {/* Bestseller Badge */}
          {product?.featured && (
            <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-md border border-primary/10 text-primary">
              <Star className="w-5 h-5 fill-current mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight">Best<br />seller</span>
            </div>
          )}

          {/* Image Counter Badge */}
          {/* {displayImages.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
              {activeIdx + 1} / {displayImages.length}
            </div>
          )} */}

          {/* Mobile Swipe indicators (dots) */}
          {/* {displayImages.length > 1 && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
              {displayImages.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIdx(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeIdx ? "bg-white w-4" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>

      {/* Mobile Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 snap-x no-scrollbar">
          {displayImages.map((src: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 rounded-[10px] overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 bg-[#F5F0EA] snap-start ${
                idx === activeIdx
                  ? "border-purple-600 shadow-md scale-[1.04]"
                  : "border-transparent hover:border-purple-400/50"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Product view ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-all cursor-pointer z-50"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          {displayImages.length > 1 && (
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {displayImages.length > 1 && (
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Big Image */}
          <div 
            className="relative w-[90vw] h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[activeIdx]}
              alt={product?.name || "Fullscreen view"}
              className="max-w-full max-h-full object-contain rounded-lg animate-in zoom-in-95 duration-200"
            />

            {/* Lightbox Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-sm font-bold font-mono">
              {activeIdx + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

