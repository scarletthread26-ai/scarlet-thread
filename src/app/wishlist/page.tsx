"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";

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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 sm:gap-6 max-sm:border-t max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 max-sm:bg-white dark:max-sm:bg-slate-900">
        {items.map((item, idx) => {
          const formattedProduct = {
            id: item.productId,
            name: item.name,
            price: item.price,
            compare_at_price: item.compareAtPrice,
            image: item.image,
            imagePlaceholder: item.name ? item.name.split(" ")[0] : "Item",
            rating: 4.9,
            reviews: 100,
            category: "Wishlist Item",
            slug: item.productId, // Wishlist doesn't store slug, fallback to ID
            bestSeller: false
          };

          return (
            <div 
              key={item.productId} 
              className={`h-full max-sm:border-b max-sm:border-slate-200/50 dark:max-sm:border-slate-800/80 ${idx % 2 === 0 ? "max-sm:border-r" : ""}`}
            >
              <ProductCard
                product={formattedProduct}
                className="max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
                customTopRightAction={
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    className="absolute top-3 right-3 max-sm:top-2 max-sm:right-2 p-1.5 bg-white/90 max-sm:bg-transparent max-sm:shadow-none dark:bg-slate-900/90 text-slate-500 hover:text-rose-600 rounded-full shadow-md flex items-center justify-center hover:scale-110 hover:bg-white transition-all active:scale-95 z-20"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
                  </button>
                }
                customActionButton={
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMoveToCart(item);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold py-2.5 h-9 shadow-sm flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer relative z-20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Move to Cart
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
