"use client"

import { useProducts } from "@/hooks/use-products"
import { useMemo, useState, useEffect } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function useProductCard(product: any) {
  const { addItem } = useCartStore()
  const { toggleItem } = useWishlistStore()
  const wishlistItems = useWishlistStore((state) => state.items)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (product.id) {
      setIsWishlisted(wishlistItems.some((item) => item.productId === String(product.id)))
    }
  }, [wishlistItems, product.id])

  const hasDiscount = !!(product.compare_at_price && product.compare_at_price > product.price)
  const discountPercent = hasDiscount
    ? Math.round((((product.compare_at_price as number) - product.price) / (product.compare_at_price as number)) * 100)
    : 0

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.id) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error("Please sign in to add items to your wishlist."); return }
    await toggleItem({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      compareAtPrice: product.compare_at_price || null,
      image: product.image || "/images/scarlet-lovedgift1.png",
      slug: product.slug || String(product.id),
      stockStatus: "in_stock"
    }, true)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.id) return
    try {
      await addItem({ productId: String(product.id), name: product.name, price: product.price, quantity: 1, image: product.image || "/images/scarlet-lovedgift1.png", personalization: null }, false)
      const shortName = product.name.length > 25 ? product.name.substring(0, 25) + "..." : product.name
      toast.success(`${shortName} added to cart!`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to add product to cart")
    }
  }

  return { isWishlisted, hasDiscount, discountPercent, handleWishlistToggle, handleAddToCart }
}

/* ─── Mobile: vertical card (2-col grid) ─── */
function MobileProductCard({ product }: { product: any }) {
  const href = `/product/${product.slug || product.id}`
  const { isWishlisted, hasDiscount, discountPercent, handleWishlistToggle } = useProductCard(product)

  return (
    <Link href={href} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
      {/* ── Image ── */}
      <div className="relative w-full aspect-square bg-[#F7F7F7]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]">No image</div>
        )}

        {/* Discount badge — orange pill, top-left of image */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-[#ff6a00] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-[5px] leading-none tracking-wide">
            {discountPercent}% OFF
          </span>
        )}
        {product.bestSeller && !hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-[#1e293b] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-[5px] leading-none tracking-wide">
            HOT
          </span>
        )}

        {/* Heart — top-right, plain circle */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              isWishlisted ? "fill-[#4a0b70] text-[#4a0b70]" : "fill-none text-slate-400 stroke-[1.8]"
            )}
          />
        </button>
      </div>

      {/* ── Details ── */}
      <div className="px-2.5 pt-2 pb-3 flex flex-col gap-[5px]">
        {/* Category */}
        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest truncate leading-none">
          {product.category || "CATEGORY"}
        </span>

        {/* Product name — uppercase like in screenshot */}
        <h3 className="font-bold text-[11px] text-[#1a1a1a] line-clamp-2 leading-[1.3] uppercase tracking-wide">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-[2px]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-[#fbbf24] text-[#fbbf24]" />
          ))}
          <span className="text-[9px] text-slate-500 ml-1 font-semibold">{product.rating || "4.9"}</span>
          <span className="text-[9px] text-slate-400">({product.reviews || 100})</span>
        </div>

        {/* Price + strikethrough on SAME line */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-extrabold text-[13px] text-[#1a1a1a] leading-tight">
            AED {product.price}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-slate-400 line-through leading-none">
              AED {product.compare_at_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ─── Desktop: horizontal card ─── */
function HorizontalProductCard({ product }: { product: any }) {
  const href = `/product/${product.slug || product.id}`
  const { isWishlisted, hasDiscount, discountPercent, handleWishlistToggle, handleAddToCart } = useProductCard(product)

  return (
    <Link
      href={href}
      className="group flex gap-4 bg-white border border-slate-200/80 rounded-[12px] p-4 hover:shadow-md transition-shadow relative w-full h-full overflow-hidden"
    >
      {/* Left Column: Image with Badge */}
      <div className="relative shrink-0 w-[120px] sm:w-[140px]">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-white text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-red-50">
            {discountPercent}% OFF
          </span>
        )}
        {product.bestSeller && !hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            HOT
          </span>
        )}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F9FAFB]">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-contain mix-blend-multiply" sizes="(max-width: 640px) 120px, 140px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] italic">No image</div>
          )}
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="flex-1 flex flex-col pt-0.5">
        <div className="flex justify-between items-start h-6 mb-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate pt-1">
            {product.category || "CATEGORY"}
          </span>
          <button
            onClick={handleWishlistToggle}
            className="w-8 h-8 shrink-0 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#4a0b70] hover:bg-purple-50 transition-colors bg-white -mt-1 shadow-sm"
          >
            <Heart className={cn("w-4 h-4 transition-colors", isWishlisted && "fill-[#4a0b70] text-[#4a0b70]")} />
          </button>
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-[15px] text-[#1e293b] line-clamp-2 leading-snug group-hover:text-[#4a0b70] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-500">
            <div className="flex text-[#fbbf24]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-slate-700 ml-0.5">{product.rating || "4.9"}</span>
            <span className="opacity-60">({product.reviews || 100})</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            <span className="font-extrabold text-[#0f172a] text-[16px]">AED {product.price}</span>
            {hasDiscount ? (
              <span className="text-[11px] text-slate-400 line-through">AED {product.compare_at_price}</span>
            ) : (
              <span className="text-[11px] text-transparent select-none">-</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-[10px] shrink-0 bg-[#4a0b70] text-white flex items-center justify-center hover:bg-[#34074f] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedBanner() {
  const { data: dbProducts, isLoading } = useProducts()

  const bestSellers = useMemo(() => {
    if (!dbProducts) return []
    const filtered = dbProducts.filter((p) => p.best_seller === true)
    const displayProducts = filtered.length > 0 ? filtered : [...dbProducts]
    return displayProducts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
  }, [dbProducts])

  if (isLoading) return null

  const products = bestSellers.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    compare_at_price: product.compare_at_price,
    image: product.images?.[0]?.url || "",
    category: product.categories?.name || "Gifts For Him",
    slug: product.slug,
    bestSeller: product.best_seller,
    rating: 4.9,
    reviews: 100
  }))

  return (
    <section className="py-6 md:py-16 bg-[#faf8fc] border-y border-border/40">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-left md:text-center mb-6 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-start md:justify-center gap-3">
            Best <span className="text-[#4a0b70]">Sellers</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl md:mx-auto">
            Our most loved products, carefully curated for you.
          </p>
        </div>

        {/* Mobile: 2-col vertical card grid */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {products.map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Desktop: horizontal cards */}
        <div className="hidden md:block relative max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {products.map((p) => (
              <HorizontalProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


