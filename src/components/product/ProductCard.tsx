"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface Product {
  id: string | number
  name: string
  price: number
  compare_at_price?: number | null
  image?: string
  imagePlaceholder?: string
  rating?: number
  reviews?: number
  category?: string
  slug?: string
  bestSeller?: boolean
}

export interface ProductCardProps {
  product: Product
  className?: string
  /** Optional override for the Add to Cart button background */
  buttonClassName?: string
  customTopRightAction?: React.ReactNode
  customActionButton?: React.ReactNode
}

export function ProductCard({ product, className, buttonClassName, customTopRightAction, customActionButton }: ProductCardProps) {
  const href = `/product/${product.slug || product.id}`
  const { addItem, setDrawerOpen } = useCartStore()
  const { toggleItem } = useWishlistStore()
  const wishlistItems = useWishlistStore((state) => state.items)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  React.useEffect(() => {
    if (product.id) {
      setIsWishlisted(wishlistItems.some((item) => item.productId === String(product.id)))
    }
  }, [wishlistItems, product.id])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.id) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please sign in to add items to your wishlist.")
      return
    }

    const wishlistItem = {
      productId: String(product.id),
      name: product.name,
      price: product.price,
      compareAtPrice: product.compare_at_price || null,
      image: product.image || "/images/scarlet-lovedgift1.png",
      slug: product.slug || String(product.id),
      stockStatus: "in_stock"
    }

    await toggleItem(wishlistItem, true)
  }

  const hasDiscount = !!(product.compare_at_price && product.compare_at_price > product.price)
  const discountPercent = hasDiscount
    ? Math.round((((product.compare_at_price as number) - product.price) / (product.compare_at_price as number)) * 100)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.id) return

    const cartItem = {
      productId: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || "/images/scarlet-lovedgift1.png",
      personalization: null
    }

    try {
      await addItem(cartItem, false)
      const shortName = product.name.length > 25 ? product.name.substring(0, 25) + "..." : product.name
      toast.success(`${shortName} added to cart!`)
      
      // Auto open drawer
      setTimeout(() => {
        setDrawerOpen(true)
      }, 250)
    } catch (err) {
      console.error(err)
      toast.error("Failed to add product to cart")
    }
  }

  return (
    <Card className={cn("group bg-white dark:bg-slate-900 max-sm:rounded-[16px] sm:rounded-[10px] border border-slate-200/50 dark:border-slate-800/80 shadow-sm sm:hover:shadow-md sm:hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full", className)}>
      <Link href={href} className="flex flex-col h-full flex-1">
        
        {/* Image Container */}
        <div className="relative overflow-hidden max-sm:rounded-t-[16px] sm:rounded-t-[10px] aspect-square w-full duration-500 bg-[#FAFAFA]">
          <div className="absolute inset-0 transition-transform duration-700 sm:group-hover:scale-105">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6 bg-white">
                <span className="font-heading italic text-xl text-primary font-medium">
                  {product.imagePlaceholder || "Gift"}
                </span>
              </div>
            )}
          </div>

          <div className="absolute inset-0 max-sm:rounded-t-[16px] sm:rounded-t-[10px] border border-slate-900/5 dark:border-white/5 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <div className="bg-[#ff6b00] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {discountPercent}% OFF
              </div>
            )}
            {product.bestSeller && (
              <div className="bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200/50 shadow-sm w-max">
                Best Seller
              </div>
            )}
          </div>

          {/* Wishlist/Custom Action */}
          {customTopRightAction ? customTopRightAction : (
            <button 
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-all active:scale-95 z-20"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart 
                className={cn(
                  "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all",
                  isWishlisted ? "fill-primary text-primary" : "text-slate-400 sm:hover:text-primary"
                )} 
              />
            </button>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-3 sm:p-4 flex flex-col flex-grow justify-between bg-white max-sm:rounded-b-[16px] sm:rounded-b-[10px] dark:bg-slate-900">
          <div>
            {product.category && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8b92a5] mb-1 block">
                {product.category}
              </span>
            )}
            <h3 className="font-bold text-[11px] sm:text-sm uppercase text-[#1a1f36] dark:text-slate-100 line-clamp-1 sm:line-clamp-2 min-h-[1rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {product.reviews && product.reviews > 0 ? (
              <div className="flex items-center gap-1 mt-1 max-sm:mt-0.5 text-[11px] max-sm:text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => {
                    const starVal = i + 1;
                    const isFilled = starVal <= Math.round(product.rating || 0);
                    return (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 fill-current",
                          isFilled ? "text-yellow-400" : "text-slate-350 dark:text-slate-650 fill-none"
                        )} 
                      />
                    );
                  })}
                </div>
                <span className="font-semibold">{(product.rating || 0).toFixed(1)}</span>
                <span className="opacity-60">({product.reviews})</span>
              </div>
            ) : null}
          </div>

          <div className="mt-2.5 sm:border-t sm:pt-3 border-slate-50 dark:border-slate-800/60 mt-auto">
            <div className="flex flex-wrap items-center gap-1.5 sm:mb-2">
              <span className="text-[13px] sm:text-base font-extrabold text-[#1a1f36] dark:text-slate-100">
                AED {product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-[11px] sm:text-sm text-[#8b92a5] line-through font-medium">
                    AED {product.compare_at_price}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded max-sm:hidden">
                    Save AED {(product.compare_at_price as number) - product.price}
                  </span>
                </>
              )}
            </div>

            <div className="w-full max-sm:hidden">
              {customActionButton ? customActionButton : (
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-13 rounded-[10px] text-xs font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer relative z-20",
                    buttonClassName || "bg-primary hover:bg-primary/90 text-white"
                  )}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
