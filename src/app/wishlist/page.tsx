"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { items, isLoading, toggleItem, fetchWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      const loggedIn = !!user;
      setIsAuthenticated(loggedIn);
      if (loggedIn) {
        await fetchWishlist(true);
      }
    }
    checkAuth();
  }, []);

  const handleMoveToCart = async (item: any) => {
    // Add to cart
    await addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      personalization: null // Wishlist products don't default with personalization, configured in cart/detail
    }, isAuthenticated);

    // Remove from wishlist
    await toggleItem(item, isAuthenticated);
  };

  const handleRemove = async (item: any) => {
    await toggleItem(item, isAuthenticated);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
        <span className="text-sm font-semibold text-slate-400">Loading your wishlist...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-purple-50 dark:bg-purple-950/40 rounded-full flex items-center justify-center mb-6 text-purple-600 border border-purple-100 dark:border-purple-900/50">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold mb-4 text-slate-800 dark:text-slate-100">Your Wishlist is Empty</h1>
        <p className="text-slate-400 mb-8 max-w-sm">Browse our premium custom collections and save your favorite designs here!</p>
        <Link 
          href="/" 
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-xl px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold"
          )}
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[60vh]">
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.productId}
            className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FDF8FF] border border-slate-100 dark:border-slate-850 mb-4 group">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                
                {/* Remove button overlay */}
                <button 
                  onClick={() => handleRemove(item)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-rose-600 rounded-full shadow-sm hover:scale-105 transition"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-purple-600 text-sm">
                    AED {item.price}
                  </span>
                  {item.compareAtPrice && item.compareAtPrice > item.price && (
                    <span className="text-xs text-slate-400 line-through">
                      AED {item.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-850 flex gap-2">
              <Button
                onClick={() => handleMoveToCart(item)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold py-2 shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Move to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
