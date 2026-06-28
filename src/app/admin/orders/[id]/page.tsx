"use client";

import React, { useState, useEffect } from "react";
import { useOrderDetails, useUpdateOrderStatus } from "@/hooks/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { 
  Loader2, 
  ArrowLeft, 
  Printer, 
  MessageSquare, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  FileText,
  User
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  
  const { data: orderData, isLoading, refetch } = useOrderDetails(id);
  const order = orderData as any;
  const updateStatusMutation = useUpdateOrderStatus();

  // Status & Tracking update states
  const [status, setStatus] = useState("pending");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estDeliveryDate, setEstDeliveryDate] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCarrier(order.carrier || "");
      setTrackingNumber(order.tracking_number || "");
      setEstDeliveryDate(order.estimated_delivery_date ? order.estimated_delivery_date.split("T")[0] : "");
      setInternalNotes(order.notes || "");
    }
  }, [order]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status,
        carrier: carrier || undefined,
        tracking_number: trackingNumber || undefined,
        estimated_delivery_date: estDeliveryDate ? new Date(estDeliveryDate).toISOString() : undefined,
        notes: internalNotes || undefined,
      });
      refetch();
    } catch (err) {
      // toast alert handled by mutation hook
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading order metadata...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-700">Order Not Found</h2>
        <p className="text-slate-400 mt-2">The requested order ID does not exist in our database records.</p>
        <Link href="/admin/orders" className="inline-block mt-4 text-primary hover:underline">
          Go Back to List
        </Link>
      </div>
    );
  }

  // Construct WhatsApp Guidelines link
  const clientPhone = order.guest_phone || order.shipping_address?.phone || "";
  const cleanedPhone = clientPhone.replace(/[\s\-\+]/g, "");
  const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
    `Hello ${order.shipping_address?.full_name || "there"}, I'm contacting you from Scarlet Thread regarding order ${order.order_number}.\n\n` +
    `Current status: ${order.status.toUpperCase()}`
  )}`;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                {order.order_number}
              </h1>
              <Badge className="capitalize font-semibold">{order.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Placed on {format(new Date(order.created_at), "PPP p")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="rounded-lg h-9">
            <Printer className="w-4 h-4 mr-1.5" /> Print Invoice
          </Button>
          {cleanedPhone && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9 gap-1.5">
                <MessageSquare className="w-4 h-4" /> WhatsApp Buyer
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Ordered items</h3>
            </div>
            <CardContent className="p-6 divide-y">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-16 h-16 bg-slate-50 border rounded-lg overflow-hidden shrink-0">
                    <img src={item.product?.image_url || "/images/scarlet-gift1.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{item.product?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Quantity: {item.quantity} • Unit Price: AED {item.unit_price}</p>
                    
                    {/* Custom Personalization Specifications */}
                    {item.personalization_data && (
                      <div className="mt-2 text-xs border bg-purple-50/20 dark:bg-purple-950/5 border-purple-100 dark:border-purple-900/30 p-2.5 rounded-lg space-y-1">
                        <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">Customization Specs:</span>
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

              {/* Totals Summary */}
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

          {/* Timeline Tracking */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status History Timeline</h3>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {order.timeline?.map((log: any, idx: number) => (
                  <div key={log.id || idx} className="flex gap-4 items-start relative z-10">
                    <div className="w-7.5 h-7.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border-2 border-primary flex items-center justify-center shrink-0">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <Badge className="capitalize text-[10px] font-bold py-0.5 px-2">{log.status}</Badge>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{log.notes}</p>
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(log.created_at), "PPP p")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sidebar info/actions */}
        <div className="space-y-6">
          {/* Status update controller */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fulfillment & Actions</h3>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="orderStatus" className="font-semibold text-xs">Order Status *</Label>
                  <select
                    id="orderStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none h-10"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="carrier" className="font-semibold text-xs">Courier Carrier</Label>
                  <Input 
                    id="carrier" 
                    placeholder="Aramex, DHL" 
                    value={carrier} 
                    onChange={(e) => setCarrier(e.target.value)} 
                    className="rounded-lg h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tracking" className="font-semibold text-xs">Tracking Number</Label>
                  <Input 
                    id="tracking" 
                    placeholder="AWB-10023910" 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)} 
                    className="rounded-lg h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="estDelivery" className="font-semibold text-xs">Estimated Delivery</Label>
                  <Input 
                    id="estDelivery" 
                    type="date" 
                    value={estDeliveryDate} 
                    onChange={(e) => setEstDeliveryDate(e.target.value)} 
                    className="rounded-lg h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="font-semibold text-xs">Internal Notes</Label>
                  <textarea
                    id="notes"
                    placeholder="Add internal notes or production guidelines..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm p-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateStatusMutation.isPending}
                  className="w-full rounded-lg font-bold shadow bg-primary hover:bg-primary/95 text-white gap-2 h-10"
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Update fulfillment details"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Customer & Address Info */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Customer details</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Account info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950 text-primary flex items-center justify-center shadow-sm border border-purple-100">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block">
                    {order.shipping_address?.full_name || "Guest Checkout"}
                  </span>
                  <span className="text-xs text-muted-foreground">{order.guest_email || "No Account Registered"}</span>
                  {order.guest_phone && <span className="block text-xs text-muted-foreground mt-0.5">{order.guest_phone}</span>}
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Delivery Address */}
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
                  <p>Country: {order.shipping_address?.country}</p>
                  <p className="pt-1.5 font-medium">Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>

              {/* Billing Address */}
              {order.billing_address && (
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Billing Address
                  </h4>
                  <div className="text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{order.billing_address.full_name}</p>
                    <p>{order.billing_address.address_line1}</p>
                    {order.billing_address.address_line2 && <p>{order.billing_address.address_line2}</p>}
                    <p>{order.billing_address.city}, {order.billing_address.state}</p>
                    <p>ZIP: {order.billing_address.postal_code}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
