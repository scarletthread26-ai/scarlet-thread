"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Check, Ruler, Sparkles, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSettings } from "@/hooks/use-settings";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useProductReviews } from "@/hooks/use-reviews";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Navy Blue", hex: "#1A237E" },
  { name: "Black", hex: "#212121" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Maroon", hex: "#880E4F" },
  { name: "Beige", hex: "#D7CCC8" },
  { name: "Olive", hex: "#33691E" },
];

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
const FONTS = ["Classic Script", "Modern Block", "Vintage Serif", "Handwritten"];
const THREAD_COLORS = [
  { name: "Gold", hex: "#D4AF37" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Crimson Red", hex: "#DC143C" },
  { name: "Midnight Black", hex: "#000000" },
  { name: "Pure White", hex: "#FFFFFF" }
];

interface ProductConfiguratorProps {
  product?: any;
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const router = useRouter();

  // Standard product info fallbacks
  const prodId = product?.id || "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4";
  const { data: reviews = [] } = useProductReviews(String(prodId));
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : 0;
  const name = product?.name || "Personalized Hoodie";
  const price = product?.price || 149;
  const compareAtPrice = product?.compare_at_price || 199;
  const description = product?.description || "A premium embroidered apparel custom crafted to order.";
  const isPersonalized = product?.is_personalized ?? true;
  const image = product?.images?.[0]?.url || product?.image_url || "/images/forhimpage/scarlet-kinghoodie.png";
  const slug = product?.slug || "personalized-hoodie";

  const productColors = product?.colors || [];
  const productSizes = product?.sizes || [];

  const [activeColor, setActiveColor] = useState("");
  const [activeSize, setActiveSize] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (productColors && productColors.length > 0) {
      if (!productColors.some((c: any) => c.name === activeColor)) {
        setActiveColor(productColors[0].name);
      }
    } else {
      setActiveColor("");
    }
    if (productSizes && productSizes.length > 0) {
      if (!productSizes.includes(activeSize)) {
        const hasM = productSizes.includes("M");
        setActiveSize(hasM ? "M" : productSizes[0]);
      }
    } else {
      setActiveSize("");
    }
  }, [product, productColors, productSizes]);

  // Personalization states
  const [customName, setCustomName] = useState("");
  const [customText, setCustomText] = useState("");
  const [fontStyle, setFontStyle] = useState("Classic Script");
  const [fontColor, setFontColor] = useState("Gold");

  const { addItem, setDrawerOpen } = useCartStore();
  const { toggleItem } = useWishlistStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((item) => item.productId === String(prodId)));
  }, [wishlistItems, prodId]);
  const { data: settings } = useSettings();

  const handleWhatsAppChat = () => {
    const rawPhone = settings?.whatsapp_number || "971501872337";
    const cleanedPhone = rawPhone.replace(/\D/g, "");

    let text = `Hello! I would like to inquire about personalizing and ordering the product: *${name}* (Price: AED ${price}).`;
    if (customName) text += `\n- Name/Initials: ${customName}`;
    if (customText) text += `\n- Text/Date: ${customText}`;
    text += `\n- Color: ${activeColor}`;
    text += `\n- Size: ${activeSize}`;
    text += `\n- Font Style: ${fontStyle}`;
    text += `\n- Thread Color: ${fontColor}`;

    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, []);

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;
    setIsAdding(true);
    try {
      const personalizationData = (activeColor || activeSize) ? {
        ...(activeColor ? { color: activeColor } : {}),
        ...(activeSize ? { size: activeSize } : {})
      } : null;

      const cartItem = {
        productId: prodId,
        name,
        price: price,
        quantity: 1,
        image,
        personalization: personalizationData
      };

      await addItem(cartItem, isAuthenticated);

      // Toast notification
      toast.success(`✓ ${name} added to your cart.`);

      setIsAdding(false);
      setIsAdded(true);

      // Slide open Mini Cart Drawer
      setTimeout(() => {
        setDrawerOpen(true);
      }, 250);

      // Reset button text after 1.5 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);

    } catch (err) {
      setIsAdding(false);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your wishlist.");
      return;
    }
    const wishlistItem = {
      productId: prodId,
      name,
      price,
      compareAtPrice,
      image,
      slug,
      stockStatus: product?.stock_status || "in_stock"
    };
    await toggleItem(wishlistItem, true);
  };

  const discountPercent = compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col space-y-3">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
          <h1 className="text-[22px] md:text-3xl font-heading font-bold text-black">{name}</h1>
          <button
            onClick={handleWishlistToggle}
            className="text-purple-600 hover:scale-110 transition-transform p-1 bg-purple-50 dark:bg-purple-950/30 rounded-full border border-purple-100 dark:border-purple-900/50"
            title="Toggle Wishlist"
          >
          </button>
        </div>

        {/* Ratings */}
        {totalReviewsCount > 0 ? (
          <div className="flex items-center gap-3 text-sm ">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => {
                const starVal = i + 1;
                const isFilled = starVal <= Math.round(averageRating);
                return (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4 fill-current",
                      isFilled ? "text-amber-500" : "text-slate-300 dark:text-slate-750 fill-none"
                    )}
                  />
                );
              })}
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">{averageRating.toFixed(1)}</span>
            <span className="text-slate-400 font-medium">({totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"})</span>
          </div>
        ) : null}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[10px] border border-slate-100 dark:border-slate-800/60 w-full">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</span>
          <span className="text-3xl font-extrabold text-purple-600">
            AED {price}
          </span>
        </div>
        {compareAtPrice > price && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm text-slate-400 line-through">AED {compareAtPrice}</span>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 rounded-md">
              {discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</h3>
          <p className="text-slate-650 dark:text-slate-355 text-sm leading-relaxed font-medium">
            {description}
          </p>
        </div>
      )}

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

      {/* Options Row */}
      {(productColors.length > 0 || productSizes.length > 0) && (
        <div className="flex flex-col gap-5">
          {/* Color Selection */}
          {productColors.length > 0 && (
            <div>
              <Label className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2.5 block">
                Color: <span className="text-purple-650 font-normal">{activeColor}</span>
              </Label>
              <div className="flex flex-wrap gap-2.5">
                {productColors.map((color: any) => {
                  const isActive = color.name === activeColor;
                  const isWhite = color.hex === "#FFFFFF" || color.hex?.toLowerCase() === "#ffffff";
                  return (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() => setActiveColor(color.name)}
                      style={{ backgroundColor: color.hex }}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer shadow-sm hover:scale-105",
                        isActive
                          ? "border-slate-800 ring-2 ring-slate-100 dark:ring-slate-900"
                          : "border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {isActive && (
                        <Check
                          className={cn(
                            "w-4 h-4 stroke-[3]",
                            isWhite ? "text-slate-800" : "text-white"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {productSizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Size: <span className="text-purple-650 font-normal">{activeSize}</span>
                </Label>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {productSizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setActiveSize(size)}
                    className={cn(
                      "min-w-[48px] h-10 px-3.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer",
                      size === activeSize
                        ? "border-purple-600 bg-purple-50/40 dark:bg-purple-950/20 text-purple-750 dark:text-purple-400 shadow-sm"
                        : "border-slate-200 text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          disabled={isAdding || isAdded}
          className="flex-1 min-h-[48px] sm:min-h-[56px] text-sm font-bold text-purple-700 border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 rounded-[10px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-purple-700" />
              Adding...
            </>
          ) : isAdded ? (
            "✓ Added"
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          onClick={handleBuyNow}
          className="flex-1 min-h-[48px] sm:min-h-[56px] text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] text-white rounded-[10px] shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0"
        >
          Buy It Now
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
