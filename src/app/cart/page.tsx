"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useValidateCoupon } from "@/hooks/use-coupons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function CartPage() {
  const { 
    items, 
    coupon, 
    removeItem, 
    updateQuantity, 
    getTotal, 
    getDiscountAmount, 
    getShippingFee, 
    getGrandTotal,
    applyCoupon,
    removeCoupon,
    fetchCart
  } = useCartStore();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const validateCouponMutation = useValidateCoupon();

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    try {
      const validatedCoupon = await validateCouponMutation.mutateAsync({
        code: couponCodeInput.trim(),
        subtotal: getTotal()
      });
      applyCoupon(validatedCoupon);
      setCouponCodeInput("");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply coupon");
    }
  };

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
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
        Shopping Cart
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 md:p-6 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
              <div className="w-full sm:w-28 h-28 bg-[#FDF8FF] rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-850">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Personalization Details */}
                  {item.personalization && (
                    <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/60 dark:border-purple-900/30 rounded-xl p-3.5 mt-3 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-purple-950 dark:text-purple-300 block mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        Embroidery Details:
                      </span>
                      {item.personalization.name && <div>Name: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.name}</span></div>}
                      {item.personalization.customText && <div>Text: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.customText}</span></div>}
                      {item.personalization.fontStyle && <div>Font: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.fontStyle}</span></div>}
                      {item.personalization.fontColor && <div>Thread: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.personalization.fontColor}</span></div>}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50 dark:border-slate-850">
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <button 
                      className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 font-bold border-x border-slate-200 dark:border-slate-800 min-w-[2.5rem] text-center text-slate-800 dark:text-slate-200 text-sm">{item.quantity}</span>
                    <button 
                      className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
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
          ))}
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-heading font-extrabold text-slate-800 dark:text-slate-100">Order Summary</h2>
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Enter Coupon Code"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="pl-9 rounded-xl border-slate-250 dark:border-slate-800 focus:border-purple-500 uppercase font-mono tracking-wider text-xs h-10"
                    disabled={validateCouponMutation.isPending}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={validateCouponMutation.isPending || !couponCodeInput}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold px-4 h-10"
                >
                  Apply
                </Button>
              </div>
            </form>

            {/* Display applied coupon */}
            {coupon && (
              <div className="flex justify-between items-center bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <div className="font-semibold text-emerald-800 dark:text-emerald-350">
                    <span className="font-mono">{coupon.code}</span> Applied!
                  </div>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-full text-emerald-700"
                  title="Remove Coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">AED {subtotal}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">Discount</span>
                  <span>-AED {discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-bold" : "font-bold text-slate-800 dark:text-slate-200"}>
                  {shipping === 0 ? "Free" : `AED ${shipping}`}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-lg">
                <span className="font-extrabold text-slate-800 dark:text-slate-100">Total</span>
                <span className="font-extrabold text-purple-600">AED {grandTotal}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Link
                href="/checkout"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full rounded-xl h-11 text-sm font-bold shadow-md bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
                )}
              >
                Proceed to Checkout
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Secure 256-bit SSL encrypted transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
