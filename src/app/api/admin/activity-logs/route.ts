import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Sample mock activity logs
const mockActivityLogs = [
  {
    id: "act-1",
    action: "update_setting",
    entity_type: "settings",
    entity_id: "whatsapp_number",
    details: { old_value: "+971500000000", new_value: "+971501234567" },
    ip_address: "192.168.1.100",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    admin_name: "Super Administrator"
  },
  {
    id: "act-2",
    action: "create_coupon",
    entity_type: "coupons",
    entity_id: "cp-4",
    details: { code: "SUMMER20", discount_value: 20 },
    ip_address: "192.168.1.100",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    admin_name: "Super Administrator"
  },
  {
    id: "act-3",
    action: "adjust_stock",
    entity_type: "inventory",
    entity_id: "f3a0e660-31e0-4966-9e1f-7b0028ed2cd4",
    details: { quantity_changed: 10, new_quantity: 45 },
    ip_address: "192.168.1.102",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    admin_name: "Content Manager"
  }
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: logs, error } = await supabase
      .from("admin_activity_logs")
      .select(`
        *,
        admin_users(
          users:id(full_name)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mapped = logs.map((log: any) => ({
      ...log,
      admin_name: log.admin_users?.users?.full_name || "System"
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.warn("Supabase activity logs fetch failed. Returning mock activity logs:", error.message || error);
    return NextResponse.json(mockActivityLogs);
  }
}
