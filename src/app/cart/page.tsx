"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    getShippingFee,
    getGrandTotal,
    fetchCart,
    toggleSelectItem,
    toggleAllSelection
  } = useCartStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      const loggedIn = !!user;
      setIsAuthenticated(loggedIn);
      if (loggedIn) {
        await fetchCart(true);
      }
    }
    checkAuth();
  }, []);

  const handleRemoveItem = async (id: string) => {
    await removeItem(id, isAuthenticated);
  };

  const handleUpdateQuantity = async (id: string, qty: number) => {
    await updateQuantity(id, qty, isAuthenticated);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-purple-50 dark:bg-purple-950/40 rounded-full flex items-center justify-center mb-6 text-purple-600 border border-purple-100 dark:border-purple-900/50">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold mb-4 text-slate-800 dark:text-slate-100">Your Cart is Empty</h1>
        <p className="text-slate-400 mb-8 max-w-sm">Looks like you haven't added any personalized gifts to your bag yet.</p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-xl px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold"
          )}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const selectedItemsCount = items.filter(item => item.selected !== false).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Select All Bar */}
          <div className="px-5 py-3 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between select-none">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-650 dark:text-slate-350 cursor-pointer">
              <input
                type="checkbox"
                checked={items.every((item) => item.selected !== false)}
                onChange={(e) => toggleAllSelection(e.target.checked, isAuthenticated)}
                className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer transition-all"
              />
              Select All Products ({items.length})
            </label>
            {items.some(item => item.selected === false) && (
              <span className="text-xs font-bold text-purple-650 bg-purple-50 dark:bg-purple-950/20 px-3 py-1 rounded-xl border border-purple-100/50">
                {items.filter(item => item.selected !== false).length} Selected
              </span>
            )}
          </div>

          {items.map((item) => {
            const isChecked = item.selected !== false;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col sm:flex-row gap-6 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 md:p-6 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden transition-opacity duration-200",
                  !isChecked && "opacity-60"
                )}
              >
                <div className="flex items-center gap-4 shrink-0">
                  {/* Item Checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelectItem(item.id, isAuthenticated)}
                    className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer shrink-0"
                  />
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-[#FDF8FF] dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-850 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.name}</h3>
                        <p className="font-bold text-purple-600 mt-1">AED {item.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Personalization Details */}
                    {item.personalization && (
                      <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/60 dark:border-purple-900/30 rounded-xl p-3.5 mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                        {((item.personalization as any).color || (item.personalization as any).size) && (
                          <div className="pb-1.5 border-b border-purple-100/40 dark:border-purple-900/20 mb-1.5 flex gap-4 text-[10px] font-bold text-purple-900 dark:text-purple-300 uppercase">
                            {(item.personalization as any).color && <span>Color: <span className="text-slate-700 dark:text-slate-350">{(item.personalization as any).color}</span></span>}
                            {(item.personalization as any).size && <span>Size: <span className="text-slate-700 dark:text-slate-355">{(item.personalization as any).size}</span></span>}
                          </div>
                        )}
                        
                        {(item.personalization.name || item.personalization.customText) && (
                          <>
                            <span className="font-bold text-purple-950 dark:text-purple-300 block mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              Embroidery Details:
                            </span>
                            {item.personalization.name && <div>Name: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.name}</span></div>}
                            {item.personalization.customText && <div>Text: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.customText}</span></div>}
                            {item.personalization.fontStyle && <div>Font: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.fontStyle}</span></div>}
                            {item.personalization.fontColor && <div>Thread: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.fontColor}</span></div>}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
                      <button
                        className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 cursor-pointer"
                        disabled={item.quantity <= 1}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1 font-bold border-x border-slate-200 dark:border-slate-800 min-w-[2.5rem] text-center text-slate-800 dark:text-slate-200 text-sm font-mono">{item.quantity}</span>
                      <button
                        className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 cursor-pointer"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Subtotal: <span className="text-purple-600 font-extrabold">AED {item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-heading font-extrabold text-slate-800 dark:text-slate-100">Order Summary</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium font-bold">Subtotal ({selectedItemsCount} Selected)</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">AED {subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 font-medium font-bold">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-extrabold" : "font-extrabold text-slate-800 dark:text-slate-200"}>
                  {shipping === 0 ? "Free" : `AED ${shipping}`}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-lg">
                <span className="font-extrabold text-slate-800 dark:text-slate-100">Total</span>
                <span className="font-extrabold text-purple-600">AED {grandTotal}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {items.filter(item => item.selected !== false).length > 0 ? (
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full rounded-xl h-11 text-sm font-bold shadow-md bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
                  )}
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full rounded-xl h-11 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
