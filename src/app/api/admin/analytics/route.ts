import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock data for analytics
const mockRevenueData = [
  { date: "06-20", revenue: 1450, orders: 12 },
  { date: "06-21", revenue: 2100, orders: 15 },
  { date: "06-22", revenue: 1800, orders: 14 },
  { date: "06-23", revenue: 3200, orders: 22 },
  { date: "06-24", revenue: 2800, orders: 19 },
  { date: "06-25", revenue: 4100, orders: 28 },
  { date: "06-26", revenue: 3800, orders: 25 }
];

const mockCategoryData = [
  { name: "Gifts For Her", value: 45 },
  { name: "Gifts For Him", value: 30 },
  { name: "Kids & Babies", value: 25 }
];

const mockFunnelData = [
  { name: "Visitors", count: 1200 },
  { name: "Cart Adds", count: 480 },
  { name: "Checkout Steps", count: 220 },
  { name: "Successful Purchases", count: 135 }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    const supabase = await createClient();

    // In a production environment, we could fetch dates, group, and query.
    // For now we attempt a query, and handle custom returns.
    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at, total_amount, status")
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Standard group logic if data is present
    if (orders && orders.length > 0) {
      const grouped: { [key: string]: { date: string, revenue: number, orders: number } } = {};
      
      orders.forEach((o: any) => {
        const d = new Date(o.created_at).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
        if (!grouped[d]) {
          grouped[d] = { date: d, revenue: 0, orders: 0 };
        }
        grouped[d].revenue += o.total_amount;
        grouped[d].orders += 1;
      });

      return NextResponse.json({
        revenueData: Object.values(grouped),
        categoryData: mockCategoryData,
        funnelData: mockFunnelData
      });
    }

    return NextResponse.json({
      revenueData: mockRevenueData,
      categoryData: mockCategoryData,
      funnelData: mockFunnelData
    });
  } catch (error: any) {
    console.warn("Analytics fetch failed. Returning mock stats:", error.message || error);
    return NextResponse.json({
      revenueData: mockRevenueData,
      categoryData: mockCategoryData,
      funnelData: mockFunnelData
    });
  }
}
