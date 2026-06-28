"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronUp, ChevronDown } from "lucide-react"


const thumbImages = [
  "/images/forhimpage/scarlet-kinghoodie.png",
  "/images/forhimpage/scarlet-hoodie.png",
  "/images/forhimpage/scarlet-papahoodie.png",
  "/images/forhimpage/scarlet-amazinghoodie.png",
  "/images/forhimpage/scarlet-hubbyhoodie.png",
]

export function ProductGallery({ product }: { product?: any }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const images = product?.images || [];
  const displayImages = images.length > 0
    ? images.map((img: any) => img.url)
    : thumbImages;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Image Row ── */}
      <div className="flex gap-4">
        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="w-[72px] hidden md:flex flex-col gap-3">
            <button className="flex justify-center text-primary/40 hover:text-primary transition-colors py-1">
              <ChevronUp className="w-5 h-5" />
            </button>

            {displayImages.map((src: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-[72px] h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 bg-[#F5F0EA] ${
                  idx === activeIdx
                    ? "border-primary shadow-md scale-[1.04]"
                    : "border-transparent hover:border-primary/30"
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

            <button className="flex justify-center text-primary/40 hover:text-primary transition-colors py-1">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Main Image */}
        <div className="flex-1 relative h-[500px] rounded-3xl overflow-hidden border border-black/5 shadow-sm bg-[#F5F0EA]">
          <Image
            src={displayImages[activeIdx] || "/images/scarlet-lovedgift1.png"}
            alt={product?.name || "Product Image"}
            fill
            unoptimized
            className="object-cover object-center transition-all duration-300"
            priority
          />

          {/* Bestseller Badge */}
          {product?.featured && (
            <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-md border border-primary/10 text-primary">
              <Star className="w-5 h-5 fill-current mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight">Best<br />seller</span>
            </div>
          )}

          {/* Mobile dots */}
          {displayImages.length > 1 && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayImages.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeIdx ? "bg-primary w-4" : "bg-primary/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
