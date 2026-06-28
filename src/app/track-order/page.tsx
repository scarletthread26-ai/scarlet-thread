"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTrackOrder } from "@/hooks/use-orders";
import { Search, Loader2, Package, Check, MapPin, Truck, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get("number") || "";
  const initialContact = searchParams.get("contact") || "";

  const [orderNum, setOrderNum] = useState(initialNumber);
  const [contact, setContact] = useState(initialContact);
  const [searchTrigger, setSearchTrigger] = useState({ number: initialNumber, contact: initialContact });

  const { data: order, isLoading, error } = useTrackOrder(searchTrigger.number, searchTrigger.contact);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim() || !contact.trim()) return;
    setSearchTrigger({
      number: orderNum.trim(),
      contact: contact.trim(),
    });
  };

  useEffect(() => {
    if (initialNumber && initialContact) {
      setOrderNum(initialNumber);
      setContact(initialContact);
      setSearchTrigger({ number: initialNumber, contact: initialContact });
    }
  }, [initialNumber, initialContact]);

  // Determine timeline progress mapping
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  const isStepDone = (stepIdx: number) => {
    if (order?.status === "cancelled") return false;
    return currentStatusIndex >= stepIdx;
  };

  const isStepCurrent = (stepIdx: number) => {
    if (order?.status === "cancelled") return false;
    return currentStatusIndex === stepIdx;
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">
          Enter your order number and contact details to verify real-time embroidery progress and shipment status.
        </p>
      </div>

      {/* Lookup Form Card */}
      <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="orderNum" className="font-semibold text-slate-700 dark:text-slate-300">Order Number *</Label>
              <Input
                id="orderNum"
                required
                placeholder="ST-10001"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                className="rounded-lg border-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact" className="font-semibold text-slate-700 dark:text-slate-300">Email or Phone Number *</Label>
              <Input
                id="contact"
                required
                placeholder="you@example.com / +97150..."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="rounded-lg border-slate-300"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="rounded-lg font-bold shadow bg-primary hover:bg-primary/95 text-white gap-2 h-10">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Locate Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">
            {error instanceof Error ? error.message : "Failed to locate order. Please check details and try again."}
          </p>
        </div>
      )}

      {/* Order Status Display details */}
      {order && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200/40 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</div>
              <div className={cn(
                "text-base font-bold capitalize mt-1",
                order.status === "cancelled" ? "text-red-500" :
                order.status === "delivered" ? "text-green-600" : "text-primary"
              )}>
                {order.status}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Order Placed Date</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {format(new Date(order.created_at), "PPP")}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Est. Delivery Date</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {order.estimated_delivery_date 
                  ? format(new Date(order.estimated_delivery_date), "PPP")
                  : "Within 2-3 business days"}
              </div>
            </div>
          </div>

          {/* Cancelled Alert */}
          {order.status === "cancelled" && (
            <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Order Cancelled</h4>
                <p className="text-xs mt-0.5">This order has been cancelled and refunded. If you believe this is in error, contact support.</p>
              </div>
            </div>
          )}

          {/* Interactive Progress Timeline */}
          {order.status !== "cancelled" && (
            <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
              <CardContent className="p-6 md:p-8">
                <h3 className="font-bold text-base mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Delivery Milestones
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {/* Horizontal Line on Desktop */}
                  <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>

                  {[
                    { title: "Ordered", desc: "Order confirmation complete", icon: Check },
                    { title: "Processing", desc: "Embroidery design setup", icon: Loader2 },
                    { title: "Shipped", desc: "Dispatched from studio", icon: Truck },
                    { title: "Delivered", desc: "Received at doorstep", icon: MapPin },
                  ].map((step, idx) => {
                    const done = isStepDone(idx);
                    const current = isStepCurrent(idx);
                    const StepIcon = step.icon;

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 font-bold shrink-0",
                          done ? "border-primary bg-primary text-white" :
                          current ? "border-primary bg-white dark:bg-slate-900 text-primary animate-pulse" : "border-slate-200 bg-slate-50 text-slate-400"
                        )}>
                          {done ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className={cn("w-5 h-5", current && StepIcon === Loader2 ? "animate-spin" : "")} />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className={cn("text-sm font-bold", done || current ? "text-slate-800 dark:text-slate-100" : "text-slate-400")}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details & Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items Ordered */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Order Contents</h3>
              <div className="border border-slate-200/40 rounded-2xl bg-white dark:bg-slate-900 p-4 space-y-4 shadow-sm">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 rounded-lg overflow-hidden shrink-0">
                      <img src={item.product?.image_url || "/images/scarlet-gift1.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</h4>
                      <p className="text-xs text-muted-foreground">Quantity: {item.quantity} • Price: AED {item.unit_price}</p>
                      {item.personalization_data?.name && (
                        <p className="text-xs text-primary font-medium mt-0.5 italic">
                          Personalization: {item.personalization_data.name} ({item.personalization_data.fontStyle})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Destination</h3>
              <div className="border border-slate-200/40 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Delivery Info
                </h4>
                <div className="text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.address_line1}</p>
                  {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                  <p>ZIP: {order.shipping_address?.postal_code}</p>
                  <p className="pt-2 font-medium">Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
