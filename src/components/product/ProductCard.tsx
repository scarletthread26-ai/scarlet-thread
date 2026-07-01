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
  const { addItem } = useCartStore()
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
    } catch (err) {
      console.error(err)
      toast.error("Failed to add product to cart")
    }
  }

  return (
    <Card className={cn("group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full", className)}>
      <Link href={href} className="flex flex-col h-full flex-1">
        
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl aspect-square w-full shadow-sm hover:shadow-lg transition-shadow duration-500 bg-[#FAFAFA]">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
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

          <div className="absolute inset-0 rounded-2xl border border-slate-900/5 dark:border-white/5 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <div className="bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200/50 shadow-sm">
                {discountPercent}% OFF
              </div>
            )}
            {product.bestSeller && (
              <div className="bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200/50 shadow-sm w-max">
                Best Seller
              </div>
            )}
          </div>

          {/* Wishlist/Custom Action */}
          {customTopRightAction ? customTopRightAction : (
            <button 
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 hover:bg-white transition-all active:scale-95 z-20"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart 
                className={cn(
                  "w-4 h-4 text-primary transition-all",
                  isWishlisted ? "fill-primary text-primary" : "hover:fill-primary"
                )} 
              />
            </button>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-grow justify-between">
          <div>
            {product.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">
                {product.category}
              </span>
            )}
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold">{product.rating || 4.9}</span>
              <span className="opacity-60">({product.reviews || 100})</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60">
            <div className="flex flex-wrap items-baseline gap-1.5 mb-3">
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                AED {product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-normal">
                    AED {product.compare_at_price}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
                    Save AED {(product.compare_at_price as number) - product.price}
                  </span>
                </>
              )}
            </div>

            <div className="w-full">
              {customActionButton ? customActionButton : (
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-9 rounded-xl text-xs font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer relative z-20",
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
