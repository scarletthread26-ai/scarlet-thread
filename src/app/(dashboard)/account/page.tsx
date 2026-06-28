"use client";

import { useEffect, useState } from "react";
import { useCustomerOrders } from "@/hooks/use-orders";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShoppingBag, Heart, Calendar, ArrowRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function CustomerDashboardIndex() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const { data: orders, isLoading } = useCustomerOrders();
  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (prof) {
          setProfile(prof);
        }
      }
    }
    loadProfile();
  }, []);

  const recentOrders = orders?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Welcome back, {profile?.full_name || "Shopper"}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is a quick overview of your customized embroidery orders and profile settings.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Orders Placed</span>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{orders?.length || 0}</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Link href="/account/wishlist" className="block group">
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-primary/40 transition duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">Saved Favourites</span>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{wishlistItems?.length || 0}</div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition duration-200">
                <Heart className="w-5 h-5 fill-red-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-primary" /> Profile Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <span className="block text-xs text-muted-foreground font-semibold">Full Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {profile?.full_name || "Not set"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground font-semibold">Phone Contact</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {profile?.phone || "Not set"}
              </span>
            </div>
          </div>
          <Link href="/account/profile">
            <Button variant="outline" size="sm" className="rounded-lg text-xs mt-2">
              Edit Account Info
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Orders List */}
      <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Recent Orders</h3>
          {orders && orders.length > 3 && (
            <Link href="/account/orders" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="font-mono font-bold text-primary hover:underline block text-sm"
                    >
                      {order.order_number}
                    </Link>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Placed on {format(new Date(order.created_at), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="capitalize font-semibold text-[10px]">
                      {order.status}
                    </Badge>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      AED {parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No orders registered yet.</p>
              <Link href="/products" className="text-xs text-primary hover:underline font-semibold mt-2 inline-block">
                Start shopping personalized gifts
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
