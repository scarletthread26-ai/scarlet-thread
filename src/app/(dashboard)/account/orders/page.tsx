"use client";

import { useCustomerOrders } from "@/hooks/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShoppingBag, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CustomerOrdersHistoryPage() {
  const { data: orders, isLoading } = useCustomerOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          My Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review details, tracking logs, and customization specs of all your purchases.
        </p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-semibold text-slate-400">Loading order log...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Order number</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Price Paid</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                      <td className="py-4">
                        <Link 
                          href={`/account/orders/${order.id}`}
                          className="font-mono font-bold text-primary hover:underline text-sm"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-4 text-slate-600 dark:text-slate-400">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </td>
                      <td className="py-4 font-bold text-slate-800 dark:text-slate-200">
                        AED {parseFloat(order.total_amount.toString()).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <Badge className="capitalize font-semibold text-[10px]">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-primary gap-1">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">No orders found</h3>
              <p className="text-sm text-slate-400 mb-6">You haven't placed any embroidery orders yet.</p>
              <Link href="/products">
                <Button className="rounded-lg font-bold shadow bg-primary hover:bg-primary/95 text-white">
                  Shop Custom Embroidery
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
