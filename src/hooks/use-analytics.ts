import { useQuery } from "@tanstack/react-query";

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
