"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Check, Ruler, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSettings } from "@/hooks/use-settings";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const COLORS = [
  { name: "Navy Blue", hex: "#1A237E" },
  { name: "Black",     hex: "#212121" },
  { name: "Grey",      hex: "#9E9E9E" },
  { name: "White",     hex: "#FFFFFF" },
  { name: "Maroon",    hex: "#880E4F" },
  { name: "Beige",     hex: "#D7CCC8" },
  { name: "Olive",     hex: "#33691E" },
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
  const name = product?.name || "Personalized Hoodie";
  const price = product?.price || 149;
  const compareAtPrice = product?.compare_at_price || 199;
  const description = product?.description || "A premium embroidered apparel custom crafted to order.";
  const isPersonalized = product?.is_personalized ?? true;
  const image = product?.images?.[0]?.url || product?.image_url || "/images/forhimpage/scarlet-kinghoodie.png";
  const slug = product?.slug || "personalized-hoodie";

  const [activeColor, setActiveColor] = useState("Navy Blue");
  const [activeSize, setActiveSize] = useState("M");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Personalization states
  const [customName, setCustomName] = useState("");
  const [customText, setCustomText] = useState("");
  const [fontStyle, setFontStyle] = useState("Classic Script");
  const [fontColor, setFontColor] = useState("Gold");

  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { data: settings } = useSettings();

  const handleWhatsAppChat = () => {
    const rawPhone = settings?.whatsapp_number || "919876543210";
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
    const personalizationData = isPersonalized ? {
      name: customName || undefined,
      customText: customText || undefined,
      fontStyle,
      fontColor
    } : null;

    const cartItem = {
      productId: prodId,
      name,
      price: price + (isPersonalized ? (product?.personalization_price || 15) : 0),
      quantity: 1,
      image,
      personalization: personalizationData
    };

    await addItem(cartItem, isAuthenticated);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlistToggle = async () => {
    const wishlistItem = {
      productId: prodId,
      name,
      price,
      compareAtPrice,
      image,
      slug,
      stockStatus: product?.stock_status || "in_stock"
    };
    await toggleItem(wishlistItem, isAuthenticated);
  };

  const discountPercent = compareAtPrice > price 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0;

  return (
    <div className="flex flex-col pt-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100">{name}</h1>
          <button
            onClick={handleWishlistToggle}
            className="text-purple-600 hover:scale-110 transition-transform p-1 bg-purple-50 dark:bg-purple-950/30 rounded-full border border-purple-100 dark:border-purple-900/50"
            title="Toggle Wishlist"
          >
            <Heart className={`w-5.5 h-5.5 transition-all ${isInWishlist(prodId) ? "fill-purple-600" : ""}`} />
          </button>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-3 text-sm mt-3">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-300">4.9</span>
          <span className="text-slate-400 font-medium">(256 reviews)</span>
          <span className="text-slate-300">|</span>
          <span className="text-purple-600 font-bold text-xs bg-purple-50 dark:bg-purple-950/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Custom Handcrafted
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 max-w-sm">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</span>
          <span className="text-3xl font-extrabold text-purple-600">
            AED {price + (isPersonalized ? (product?.personalization_price || 15) : 0)}
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
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {description}
      </p>

      <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

      {/* Options Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Selection */}
        <div>
          <Label className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2.5 block">
            Color: <span className="text-purple-600 font-normal">{activeColor}</span>
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((color) => {
              const isActive = color.name === activeColor;
              const isWhite = color.hex === "#FFFFFF";
              return (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => setActiveColor(color.name)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isActive
                      ? "border-purple-600 ring-2 ring-purple-100 scale-105"
                      : "border-slate-200 hover:border-purple-300"
                  }`}
                >
                  {isActive && (
                    <Check
                      className={`w-4 h-4 ${isWhite ? "text-slate-800" : "text-white"}`}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <Label className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Size: <span className="text-purple-600 font-normal">{activeSize}</span>
            </Label>
            <button className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline">
              <Ruler className="w-3 h-3" /> Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                className={`min-w-[42px] h-8 px-2 rounded-xl border text-xs font-bold transition-all ${
                  size === activeSize
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 shadow-sm"
                    : "border-slate-200 text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personalization Section */}
      {isPersonalized && (
        <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/80 dark:border-purple-900/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-purple-950 dark:text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Custom Embroidery Details (+AED {product?.personalization_price || 15})
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Name / Initials</Label>
                <Input
                  id="customName"
                  placeholder="e.g. Papa, Sarah, ST"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customText" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Text / Date</Label>
                <Input
                  id="customText"
                  placeholder="e.g. Est. 2026, Love always"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fontStyle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Embroidery Font</Label>
                <select
                  id="fontStyle"
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium focus-visible:outline-none"
                >
                  {FONTS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Thread Color</Label>
                <div className="flex items-center gap-2 h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950">
                  <div className="flex gap-1.5 flex-1 items-center">
                    {THREAD_COLORS.map((tc) => {
                      const isSelected = tc.name === fontColor;
                      return (
                        <button
                          type="button"
                          key={tc.name}
                          onClick={() => setFontColor(tc.name)}
                          title={tc.name}
                          style={{ backgroundColor: tc.hex }}
                          className={`w-5 h-5 rounded-full border border-slate-300 transition-all ${
                            isSelected ? "ring-2 ring-purple-500 scale-110" : "opacity-80 hover:opacity-100"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{fontColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isPersonalized ? (
        <Button
          onClick={handleWhatsAppChat}
          className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.416 1.46 5.561 0 10.093-4.52 10.097-10.078a9.92 9.92 0 0 0-2.92-7.147 9.925 9.925 0 0 0-7.15-2.92c-5.568 0-10.096 4.528-10.1 10.086-.001 1.916.5 3.784 1.454 5.397L1.92 21.18l4.727-1.258zM16.56 13.55c-.27-.135-1.602-.79-1.85-.88-.248-.09-.43-.135-.61.135-.18.27-.7 1.85-.858 2.03-.158.18-.316.2-.586.065-2.73-1.36-4.509-4.17-5.239-5.43-.2-.34.2-.315.572-1.055.063-.13.03-.245-.015-.335-.045-.09-.43-1.035-.59-1.42-.15-.375-.315-.325-.43-.33-.11-.005-.24-.005-.37-.005-.13 0-.34.05-.52.25-.18.2-.68.665-.68 1.625s.7 1.89.8 2.03c.1.14 1.38 2.11 3.35 2.96.47.2.83.32 1.12.41.47.15.9.13 1.24.08.38-.057 1.602-.655 1.827-1.285.225-.63.225-1.17.158-1.285-.068-.11-.248-.15-.518-.285z"/>
          </svg>
          Chat to Personalise & Order
        </Button>
      ) : (
        <div className="flex gap-4 pt-2 w-full">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 h-12 text-sm font-bold text-purple-600 border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            className="flex-1 h-12 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            Buy It Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
