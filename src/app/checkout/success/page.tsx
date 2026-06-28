"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, MessageSquare, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { useSettings } from "@/hooks/use-settings";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const orderNum = searchParams.get("number") || "";
  const contact = searchParams.get("contact") || "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart upon arriving at success page
  useEffect(() => {
    const supabase = createClient();
    async function clean() {
      const { data: { user } } = await supabase.auth.getUser();
      clearCart(!!user);
    }
    clean();
  }, [clearCart]);

  useEffect(() => {
    if (!orderId && !orderNum) return;
    
    async function fetchOrder() {
      setLoading(true);
      try {
        // Retrieve order details via guest tracking endpoint
        const params = new URLSearchParams();
        if (orderNum) params.append("number", orderNum);
        if (contact) params.append("contact", contact);
        else if (orderId) params.append("number", orderId); // fallback
        
        const res = await fetch(`/api/orders/track?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, orderNum, contact]);

  // Construct WhatsApp redirect link for personalization guidelines
  const { data: settings } = useSettings();
  const rawNumber = settings?.whatsapp_number || "971501234567";
  const whatsappNumber = rawNumber.replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    `Hello Scarlet Thread, I've just placed order ${order?.order_number || orderNum || ""}.\n\n` +
    `Here are my customization preferences:\n` +
    (order?.items?.map((item: any, idx: number) => {
      const p = item.personalization_data;
      return `${idx + 1}. ${item.product?.name || "Product"}:${p?.name ? `\n   - Name: ${p.name}` : ""}${p?.fontStyle ? `\n   - Font: ${p.fontStyle}` : ""}${p?.fontColor ? `\n   - Thread: ${p.fontColor}` : ""}`;
    }).join("\n\n") || "")
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Fetching order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl text-center">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-heading font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for shopping with us. Your order has been registered and we've started preparing your custom gift.
        </p>

        {/* Order Identifier Box */}
        <div className="bg-slate-50 dark:bg-slate-950 border rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Order Number</div>
            <div className="text-lg font-bold text-primary font-mono">{order?.order_number || orderNum || "Processing..."}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Payment Status</div>
            <div className="text-sm font-semibold capitalize text-green-600">
              {order?.payment_status === "paid" ? "Paid (Stripe Sandbox)" : "Pending"}
            </div>
          </div>
          <Link
            href={`/track-order?number=${order?.order_number || orderNum}&contact=${encodeURIComponent(contact || order?.guest_email || "")}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
          >
            Track Status <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Dynamic Personalization Prompt */}
        <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-purple-900 dark:text-purple-300 text-sm md:text-base flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            WhatsApp Customization Review
          </h3>
          <p className="text-xs md:text-sm text-purple-700/80 dark:text-purple-400/80 mb-4 leading-relaxed">
            Since your order includes custom embroidery, you can send details or reference mockups directly to our design team on WhatsApp for final validation!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-purple-600 hover:bg-purple-700 text-white rounded-full w-full justify-center shadow-md font-semibold text-xs md:text-sm gap-2"
            )}
          >
            Share Preferences on WhatsApp
          </a>
        </div>

        {/* Items Summary */}
        {order?.items && order.items.length > 0 && (
          <div className="text-left border-t border-slate-100 dark:border-slate-800 pt-6 mb-8">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-800">
                    <img src={item.product?.image_url || "/images/scarlet-gift1.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{item.product?.name}</h4>
                    <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    AED {item.unit_price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>AED {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>AED {order.shipping_cost}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-AED {order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-slate-800 dark:text-slate-200 pt-2 border-t border-dashed">
                <span>Total Placed</span>
                <span>AED {order.total_amount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8")}
          >
            Continue Shopping
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full px-8 gap-2")}
          >
            <ShoppingBag className="w-4 h-4" /> Shop Custom Gifts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
