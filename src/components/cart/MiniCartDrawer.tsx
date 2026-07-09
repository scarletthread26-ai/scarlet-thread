"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function MiniCartDrawer() {
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    getTotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    freeShippingMin,
    toggleSelectItem,
    toggleAllSelection
  } = useCartStore();

  // Handle client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, []);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!mounted) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const selectedItemsCount = items.filter(item => item.selected !== false).reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = getTotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();

  const handleCheckout = () => {
    if (items.filter(item => item.selected !== false).length === 0) {
      return;
    }
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] cursor-pointer"
        />
      )}

      {isDrawerOpen && (
        <motion.div
          key="cart-drawer-container"
          ref={drawerRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          className="fixed inset-y-0 right-0 z-[1000] h-full w-full sm:max-w-[380px] md:max-w-[440px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-650" />
              <h2 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
                Shopping Cart
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800/80 font-mono">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-455 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Select All Sub-header */}
          {items.length > 0 && (
            <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between select-none">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={items.every((item) => item.selected !== false)}
                  onChange={(e) => toggleAllSelection(e.target.checked, isAuthenticated)}
                  className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-750 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer transition-colors"
                />
                Select All ({items.length})
              </label>
              {items.some(item => item.selected === false) && (
                <span className="text-[10px] text-purple-650 dark:text-purple-400 font-extrabold bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-md border border-purple-100/50 dark:border-purple-900/30">
                  {items.filter(item => item.selected !== false).length} Selected
                </span>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 rounded-full flex items-center justify-center text-purple-600 shadow-inner">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-700 dark:text-slate-355 text-sm">Your cart is empty</h3>
                  <p className="text-slate-455 text-xs max-w-[220px]">
                    Add some beautiful custom embroidered gifts to get started!
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="mt-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-750 px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const color = item.personalization?.color;
                const size = item.personalization?.size;
                const isChecked = item.selected !== false;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 transition-opacity duration-200",
                      !isChecked && "opacity-60"
                    )}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center shrink-0 pr-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectItem(item.id, isAuthenticated)}
                        className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-750 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-18 h-18 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 relative">
                      <img
                        src={item.image || "/images/scarlet-lovedgift1.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col min-w-0 justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id, isAuthenticated)}
                            className="text-slate-400 hover:text-red-500 transition p-0.5 cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Color & Size personalization */}
                        {(color || size) && (
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[11px] font-bold text-slate-400">
                            {color && (
                              <span className="flex items-center gap-1">
                                Color: <span className="text-slate-600 dark:text-slate-350">{color}</span>
                              </span>
                            )}
                            {color && size && <span>•</span>}
                            {size && (
                              <span className="flex items-center gap-1">
                                Size: <span className="text-slate-600 dark:text-slate-350">{size}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="font-extrabold text-sm text-purple-600">
                          AED {item.price * item.quantity}
                        </span>

                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, isAuthenticated)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, isAuthenticated)}
                            className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer Summary */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-5 bg-slate-50/30 dark:bg-slate-950/20 space-y-4">
              <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal ({selectedItemsCount} Selected)</span>
                  <span className="text-slate-800 dark:text-slate-100">AED {subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-AED {discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-extrabold">FREE</span>
                    ) : (
                      `AED ${shipping}`
                    )}
                  </span>
                </div>

                {shipping > 0 && subtotal > 0 && (
                  <p className="text-[10px] text-slate-450 font-medium leading-none">
                    Add <span className="font-bold text-purple-650">AED {freeShippingMin - subtotal}</span> more for Free Shipping!
                  </p>
                )}

                <div className="h-px bg-slate-200/60 dark:bg-slate-800/80 my-2 border-dashed" />

                <div className="flex justify-between text-sm text-slate-850 dark:text-slate-100 font-extrabold pt-1">
                  <span>Total Amount</span>
                  <span className="text-base text-purple-600 font-extrabold">AED {grandTotal}</span>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={handleCheckout}
                  disabled={items.filter(item => item.selected !== false).length === 0}
                  className="w-full h-12 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full h-12 text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
