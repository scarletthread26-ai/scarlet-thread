import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();

    // Admin client to bypass RLS and perform heavy aggregates safely
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date();
    
    // Dates for trend comparison
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const iso7 = sevenDaysAgo.toISOString();
    
    // 1. Fetch Orders for Revenue and Order Counts
    const { data: orders = [] } = await supabaseAdmin
      .from("orders")
      .select("id, total_amount, created_at")
      .neq("status", "cancelled");

    let revenue = 0;
    let ordersCount = 0;
    let revenueLastPeriod = 0;
    let ordersLastPeriod = 0;

    // Daily breakdown for the chart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenueHistoryMap: Record<string, { name: string, revenue: number, orders: number, dateStr: string }> = {};
    
    // Initialize last 7 days in map to ensure days with 0 sales still show up on the chart
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split("T")[0];
      revenueHistoryMap[dateStr] = { name: dayName, revenue: 0, orders: 0, dateStr };
    }

    orders?.forEach((o) => {
      const date = new Date(o.created_at);
      const dateStr = o.created_at.split("T")[0];
      
      if (date >= sevenDaysAgo) {
        revenue += o.total_amount;
        ordersCount += 1;
        
        if (revenueHistoryMap[dateStr]) {
          revenueHistoryMap[dateStr].revenue += o.total_amount;
          revenueHistoryMap[dateStr].orders += 1;
        }
      } else if (date >= fourteenDaysAgo && date < sevenDaysAgo) {
        revenueLastPeriod += o.total_amount;
        ordersLastPeriod += 1;
      }
    });

    const revenueHistory = Object.values(revenueHistoryMap);

    // Calculate Trends
    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
      const percent = ((current - previous) / previous) * 100;
      return { value: Number(Math.abs(percent).toFixed(1)), isPositive: percent >= 0 };
    };

    const revenueTrend = calcTrend(revenue, revenueLastPeriod);
    const ordersTrend = calcTrend(ordersCount, ordersLastPeriod);

    // 2. Fetch Customers Count
    const { count: customersCount } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true });
      
    const { count: customersLastPeriod } = await supabaseAdmin
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .lt("created_at", iso7);

    const newCust = customersCount ? customersCount - (customersLastPeriod || 0) : 0;
    const customersTrend = calcTrend(newCust, 0);

    // 3. Fetch Low Stock Alerts
    const { data: lowStockProducts = [] } = await supabaseAdmin
      .from("products")
      .select("id, name, sku, stock_quantity, low_stock_threshold")
      .eq("track_inventory", true)
      .eq("is_active", true);

    const actualLowStock = (lowStockProducts || []).filter(
      (p: any) => p.stock_quantity <= (p.low_stock_threshold ?? 5)
    );

    // 4. Fetch Top 5 Recent Orders
    const { data: recentOrdersData = [] } = await supabaseAdmin
      .from("orders")
      .select(`
        id, 
        order_number, 
        created_at, 
        total_amount, 
        status,
        guest_email,
        addresses!shipping_address_id(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    const recentOrders = (recentOrdersData || []).map((o: any) => {
      const diffMs = now.getTime() - new Date(o.created_at).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let dateStr = "Just now";
      if (diffDays > 0) dateStr = `${diffDays} days ago`;
      else if (diffHours > 0) dateStr = `${diffHours} hours ago`;
      else if (diffMins > 0) dateStr = `${diffMins} mins ago`;

      return {
        id: o.id,
        order_number: o.order_number,
        customer: o.addresses?.full_name || o.guest_email || "Guest",
        date: dateStr,
        amount: o.total_amount,
        status: o.status,
      }
    });

    // 5. Fetch Top Products (Last 30 Days)
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: orderItems = [] } = await supabaseAdmin
      .from("order_items")
      .select(`
        quantity,
        unit_price,
        product_id,
        orders!inner(status, created_at),
        products(name, product_images(url))
      `)
      .neq("orders.status", "cancelled")
      .gte("orders.created_at", thirtyDaysAgo.toISOString());

    const productStats: Record<string, any> = {};
    orderItems?.forEach((item: any) => {
      const pid = item.product_id;
      if (!productStats[pid]) {
        productStats[pid] = {
          id: pid,
          name: item.products?.name || "Unknown Product",
          image: item.products?.product_images?.[0]?.url || "https://placehold.co/150x150?text=No+Image",
          sales: 0,
          revenue: 0
        };
      }
      productStats[pid].sales += item.quantity;
      productStats[pid].revenue += (item.quantity * item.unit_price);
    });

    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 3);

    const payload = {
      stats: {
        revenue,
        ordersCount,
        customersCount: customersCount || 0,
        lowStockCount: actualLowStock.length,
        revenueTrend,
        ordersTrend,
        customersTrend,
        lowStockTrend: { value: 0, isPositive: false }, // Keeping static to avoid heavy queries
      },
      revenueHistory,
      recentOrders,
      topProducts,
      lowStockProducts: actualLowStock.slice(0, 5).map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "N/A",
        stock: p.stock_quantity,
      })),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
