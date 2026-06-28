import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  revenueData: Array<{ date: string; revenue: number; orders: number }>;
  categoryData: Array<{ name: string; value: number }>;
  funnelData: Array<{ name: string; count: number }>;
}

export interface ReportRow {
  date: string;
  order_number: string;
  customer: string;
  items_count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_status: string;
  status: string;
}

export function useAnalytics(range: string = "7d") {
  return useQuery<AnalyticsData>({
    queryKey: ["admin", "analytics", range],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error("Failed to fetch analytics data");
      return res.json();
    },
  });
}

export function useSalesReport() {
  return useQuery<ReportRow[]>({
    queryKey: ["admin", "reports", "sales"],
    queryFn: async () => {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch sales reports");
      return res.json();
    },
  });
}
