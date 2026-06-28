import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all user profiles
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) throw usersError;

    // Fetch orders count and spent totals for each customer profile
    const customersWithStats = await Promise.all(
      users.map(async (user: any) => {
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total_amount")
          .eq("user_id", user.id);

        if (ordersError) throw ordersError;

        const count = orders?.length || 0;
        const totalSpent = orders?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0;

        return {
          ...user,
          orders_count: count,
          total_spent: totalSpent,
        };
      })
    );

    return NextResponse.json(customersWithStats);
  } catch (error: any) {
    console.error("GET admin customers failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Failed to load customers" }, { status: 500 });
  }
}
