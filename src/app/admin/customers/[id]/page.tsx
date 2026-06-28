"use client";

import React from "react";
import { useCustomerDetails } from "@/hooks/use-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { data: customer, isLoading } = useCustomerDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading customer profile...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-700">Customer Not Found</h2>
        <p className="text-slate-400 mt-2">The requested customer ID does not exist in our system.</p>
        <Link href="/admin/customers" className="inline-block mt-4 text-primary hover:underline">
          Go Back to List
        </Link>
      </div>
    );
  }

  const orderCount = customer.orders?.length || 0;
  const totalSpent = customer.orders?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Link href="/admin/customers">
          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Customer Profile
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Member since {format(new Date(customer.created_at), "PPP")}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Orders</span>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{orderCount}</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Value Placed</span>
              <div className="text-2xl font-extrabold text-primary">AED {totalSpent.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Account Status</span>
              <div className="text-lg font-bold text-green-600 mt-1 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div> Active
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/40 rounded-xl text-green-500">
              <User className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal info & Addresses */}
        <div className="space-y-6">
          {/* Profile metadata */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 text-primary rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white dark:border-slate-900 shadow-md">
                  {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-3">
                  {customer.full_name || "Unnamed Customer"}
                </h3>
                <span className="text-xs text-muted-foreground mt-0.5">Registered Profile</span>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
                {customer.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{customer.id.substring(0, 8)}... (Supabase Auth ID)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined on {format(new Date(customer.created_at), "PPP")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Addresses */}
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Addresses</h3>
            </div>
            <CardContent className="p-6">
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-6">
                  {customer.addresses.map((address: any) => (
                    <div key={address.id} className="text-xs sm:text-sm border-b pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase tracking-wider">
                        {address.title || "Address"}
                      </span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-2">{address.full_name}</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-slate-600 dark:text-slate-400">{address.address_line2}</p>}
                      <p className="text-slate-600 dark:text-slate-400">{address.city}, {address.state}</p>
                      <p className="text-slate-600 dark:text-slate-400">Postal Code: {address.postal_code}</p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium pt-1.5">Phone: {address.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No saved addresses on record.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-4 border-b">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">Orders History</h3>
            </div>
            <CardContent className="p-6">
              {customer.orders && customer.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Order Num</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Total Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customer.orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                          <td className="py-3.5">
                            <Link 
                              href={`/admin/orders/${order.id}`}
                              className="font-mono font-bold text-primary hover:underline"
                            >
                              {order.order_number}
                            </Link>
                          </td>
                          <td className="py-3.5 text-slate-600 dark:text-slate-400">
                            {format(new Date(order.created_at), "MMM dd, yyyy")}
                          </td>
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                            AED {parseFloat(order.total_amount).toFixed(2)}
                          </td>
                          <td className="py-3.5">
                            <Badge className="capitalize font-semibold text-[10px]">
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No orders placed by this customer yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
