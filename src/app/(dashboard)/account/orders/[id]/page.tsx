"use client";

import React from "react";
import { useOrderDetails } from "@/hooks/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Loader2, 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  Calendar, 
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerOrderDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { data: order, isLoading } = useOrderDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading order log details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-700">Order Not Found</h2>
        <p className="text-slate-400 mt-2">The requested order was not found on your profile history.</p>
        <Link href="/account/orders" className="inline-block mt-4 text-primary hover:underline">
          Go Back to List
        </Link>
      </div>
    );
  }

  // Determine timeline progress mapping
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);

  const isStepDone = (stepIdx: number) => {
    if (order.status === "cancelled") return false;
    return currentStatusIndex >= stepIdx;
  };

  const isStepCurrent = (stepIdx: number) => {
    if (order.status === "cancelled") return false;
    return currentStatusIndex === stepIdx;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Link href="/account/orders">
          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">
              {order.order_number}
            </h1>
            <Badge className="capitalize font-semibold">{order.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Placed on {format(new Date(order.created_at), "PPP p")}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      {order.status !== "cancelled" && (
        <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-primary" /> Delivery Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {/* Horizontal Line on Desktop */}
              <div className="hidden sm:block absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>

              {[
                { title: "Ordered", desc: "Confirmed", icon: CheckCircle2 },
                { title: "Processing", desc: "In Production", icon: Loader2 },
                { title: "Shipped", desc: "In Transit", icon: Truck },
                { title: "Delivered", desc: "Received", icon: MapPin },
              ].map((step, idx) => {
                const done = isStepDone(idx);
                const current = isStepCurrent(idx);
                const StepIcon = step.icon;

                return (
                  <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3 relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 shrink-0",
                      done ? "border-primary bg-primary text-white" :
                      current ? "border-primary bg-white dark:bg-slate-900 text-primary animate-pulse" : "border-slate-200 bg-slate-50 text-slate-400"
                    )}>
                      <StepIcon className={cn("w-5 h-5", current && StepIcon === Loader2 ? "animate-spin" : "")} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className={cn("text-xs sm:text-sm font-bold", done || current ? "text-slate-800 dark:text-slate-100" : "text-slate-400")}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Details and Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items Ordered */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Order Items Summary</h3>
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            <CardContent className="p-6 divide-y">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-14 h-14 bg-slate-50 border rounded-lg overflow-hidden shrink-0">
                    <img src={item.product?.image_url || "/images/scarlet-gift1.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Quantity: {item.quantity} • Price: AED {item.unit_price}</p>
                    
                    {/* Custom Personalization details */}
                    {item.personalization_data && (
                      <div className="mt-2 text-xs border bg-purple-50/10 dark:bg-purple-950/5 border-purple-100 dark:border-purple-900/20 p-2.5 rounded-lg space-y-1">
                        <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">My Customizations:</span>
                        {item.personalization_data.name && (
                          <div>Name to embroider: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.personalization_data.name}</span></div>
                        )}
                        {item.personalization_data.fontStyle && (
                          <div>Selected Font: <span className="text-muted-foreground">{item.personalization_data.fontStyle}</span></div>
                        )}
                        {item.personalization_data.fontColor && (
                          <div>Thread Color: <span className="text-muted-foreground">{item.personalization_data.fontColor}</span></div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    AED {(item.unit_price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Price summary */}
              <div className="pt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AED {order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AED {order.shipping_cost}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-AED {order.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-slate-800 dark:text-slate-200 pt-2 border-t">
                  <span>Grand Total</span>
                  <span className="text-primary text-lg">AED {order.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Delivery Details</h3>
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </h4>
                <div className="text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.address_line1}</p>
                  {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                  <p>ZIP: {order.shipping_address?.postal_code}</p>
                  <p className="pt-1.5 font-medium">Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>

              {order.carrier && (
                <>
                  <hr className="border-slate-100 dark:border-slate-800" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Shipment Info
                    </h4>
                    <div className="text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                      <p>Courier: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.carrier}</span></p>
                      <p>Tracking: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.tracking_number}</span></p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
