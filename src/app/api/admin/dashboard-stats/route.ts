import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch actual low stock products based on threshold and tracking flag
    const { data: lowStockProducts = [] } = await supabase
      .from("products")
      .select("id, name, sku, stock_quantity, low_stock_threshold")
      .eq("track_inventory", true)
      .eq("is_active", true);

    const actualLowStock = (lowStockProducts || []).filter(
      (p: any) => p.stock_quantity <= (p.low_stock_threshold ?? 5)
    );
    
    const mockPayload = {
      stats: {
        revenue: 45680.0,
        ordersCount: 312,
        customersCount: 840,
        lowStockCount: actualLowStock.length,
        revenueTrend: { value: 14.5, isPositive: true },
        ordersTrend: { value: 8.2, isPositive: true },
        customersTrend: { value: 12.0, isPositive: true },
        lowStockTrend: { value: 0, isPositive: false },
      },
      revenueHistory: [
        { name: "Mon", revenue: 4200, orders: 28 },
        { name: "Tue", revenue: 5100, orders: 35 },
        { name: "Wed", revenue: 4800, orders: 32 },
        { name: "Thu", revenue: 6200, orders: 42 },
        { name: "Fri", revenue: 7500, orders: 51 },
        { name: "Sat", revenue: 9100, orders: 62 },
        { name: "Sun", revenue: 8780, orders: 62 },
      ],
      recentOrders: [
        { id: "1", order_number: "ST-10042", customer: "Amna Al-Mansoori", date: "Just now", amount: 489.0, status: "pending" },
        { id: "2", order_number: "ST-10041", customer: "Zainab Rashid", date: "15 mins ago", amount: 1499.0, status: "processing" },
        { id: "3", order_number: "ST-10040", customer: "John Smith", date: "1 hour ago", amount: 899.0, status: "shipped" },
        { id: "4", order_number: "ST-10039", customer: "Fatima Hassan", date: "3 hours ago", amount: 699.0, status: "delivered" },
        { id: "5", order_number: "ST-10038", customer: "Tareq Ghaoui", date: "5 hours ago", amount: 1299.0, status: "cancelled" },
      ],
      topProducts: [
        { id: "1", name: "Personalized Hooded Towel", sales: 124, revenue: 11147.6, image: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=150&q=80" },
        { id: "2", name: "Mama Heart Hoodie", sales: 98, revenue: 14690.2, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=150&q=80" },
        { id: "3", name: "Bride Cosmetic Pouch", sales: 76, revenue: 5312.4, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=150&q=80" },
      ],
      lowStockProducts: actualLowStock.slice(0, 5).map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "N/A",
        stock: p.stock_quantity,
      })),
    };

    return NextResponse.json(mockPayload);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
