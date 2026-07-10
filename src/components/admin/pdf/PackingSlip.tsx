/**
 * PackingSlip.tsx
 * Renders a warehouse-friendly Packing & Fulfillment Checklist as a hidden div.
 * Call printDocument("scarlet-packing-slip", ...) to print.
 * NO pricing or tax information is shown.
 */

import { format } from "date-fns";

interface PersonalizationData {
  color?: string;
  size?: string;
  name?: string;
  fontStyle?: string;
  fontColor?: string;
  [key: string]: string | undefined;
}

interface OrderItem {
  id: string;
  product?: { name?: string; sku?: string };
  quantity: number;
  unit_price: number;
  personalization_data?: PersonalizationData | null;
}

interface ShippingAddress {
  full_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface OrderData {
  order_number: string;
  created_at: string;
  carrier?: string | null;
  tracking_number?: string | null;
  estimated_delivery_date?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  shipping_address?: ShippingAddress | null;
  items?: OrderItem[];
}

interface PackingSlipProps {
  order: OrderData;
}

function buildPackingDescription(item: OrderItem): { name: string; details: string[] } {
  const name = item.product?.name || "Product";
  const details: string[] = [];
  const p = item.personalization_data;
  if (p) {
    if (p.color) details.push(`Color: ${p.color}`);
    if (p.size) details.push(`Size: ${p.size}`);
    if (p.name) details.push(`Embroidery Name: ${p.name}`);
    if (p.fontStyle) details.push(`Font: ${p.fontStyle}`);
    if (p.fontColor) details.push(`Thread Color: ${p.fontColor}`);
  }
  return { name, details };
}

export function PackingSlip({ order }: PackingSlipProps) {
  const addr = order.shipping_address;
  const customerName = addr?.full_name || "Customer";
  const customerPhone = order.guest_phone || addr?.phone || "—";
  const customerEmail = order.guest_email || "—";

  const addressLines = [
    addr?.address_line1,
    addr?.address_line2,
    addr?.city && addr?.state ? `${addr.city}, ${addr.state}` : addr?.city || addr?.state,
    addr?.postal_code,
    addr?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const orderDate = order.created_at
    ? format(new Date(order.created_at), "MMM dd, yyyy")
    : "—";

  const deliveryDate = order.estimated_delivery_date
    ? format(new Date(order.estimated_delivery_date), "MMM dd, yyyy")
    : "—";

  const items = order.items || [];

  const s: Record<string, React.CSSProperties> = {
    wrap: {
      fontFamily: "'Segoe UI', Arial, sans-serif",
      color: "#111",
      background: "#fff",
      padding: "24px",
      maxWidth: "780px",
      margin: "0 auto",
      fontSize: "13px",
      lineHeight: "1.5",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderBottom: "3px solid #111",
      paddingBottom: "14px",
      marginBottom: "20px",
    },
    logoArea: { display: "flex", flexDirection: "column" as const, gap: "2px" },
    logoText: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#111",
      letterSpacing: "1px",
    },
    logoSub: { fontSize: "10px", color: "#888", marginTop: "2px", textTransform: "uppercase" as const, letterSpacing: "0.5px" },
    slipTitle: { textAlign: "right" as const },
    slipTitleText: { fontSize: "18px", fontWeight: "800", color: "#111", letterSpacing: "0.5px" },
    slipSub: { fontSize: "10px", color: "#555", marginTop: "4px", fontStyle: "italic" },
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    },
    box: {
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "12px 14px",
    },
    boxLabel: {
      fontSize: "9px",
      fontWeight: "700",
      color: "#111",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      marginBottom: "8px",
      borderBottom: "1px solid #eee",
      paddingBottom: "6px",
    },
    boxRow: { display: "flex", gap: "6px", marginBottom: "4px", fontSize: "12px" },
    boxRowLabel: { fontWeight: "700", minWidth: "100px", color: "#555", fontSize: "11px" },
    boxRowValue: { color: "#111" },
    boxName: { fontWeight: "700", fontSize: "13px", marginBottom: "6px" },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginBottom: "16px",
      fontSize: "12px",
    },
    th: {
      background: "#111",
      color: "#fff",
      padding: "8px 10px",
      textAlign: "left" as const,
      fontWeight: "700",
      fontSize: "11px",
      letterSpacing: "0.5px",
    },
    thCenter: {
      background: "#111",
      color: "#fff",
      padding: "8px 10px",
      textAlign: "center" as const,
      fontWeight: "700",
      fontSize: "11px",
      letterSpacing: "0.5px",
      width: "52px",
    },
    td: { padding: "10px 10px", borderBottom: "1px solid #e5e5e5", verticalAlign: "middle" as const },
    tdCenter: { padding: "10px 10px", borderBottom: "1px solid #e5e5e5", textAlign: "center" as const, fontWeight: "700", fontSize: "14px" },
    checkbox: {
      display: "inline-block",
      width: "18px",
      height: "18px",
      border: "1.5px solid #555",
      borderRadius: "3px",
      verticalAlign: "middle" as const,
    },
    itemName: { fontWeight: "600", color: "#111", marginBottom: "2px" },
    itemDetail: { fontSize: "11px", color: "#666", lineHeight: "1.5" },
    itemSku: { fontSize: "10px", color: "#aaa", marginTop: "2px", fontStyle: "italic" },
    trEven: { background: "#fafafa" },
    footer: {
      borderTop: "1px dashed #bbb",
      paddingTop: "14px",
      textAlign: "center" as const,
      fontSize: "11px",
      color: "#666",
      lineHeight: "1.7",
    },
    footerHighlight: { fontWeight: "700", color: "#111" },
  };

  return (
    <div id="scarlet-packing-slip" style={{ display: "none" }}>
      <div style={s.wrap}>
        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.logoArea}>
            <div style={s.logoText}>SCARLET THREAD</div>
            <div style={s.logoSub}>Packing &amp; Fulfillment Checklist</div>
          </div>
          <div style={s.slipTitle}>
            <div style={s.slipTitleText}>ORDER CHECKLIST</div>
            <div style={s.slipSub}>Please verify items before packing</div>
          </div>
        </div>

        {/* ── Order Details / Deliver To ── */}
        <div style={s.twoCol}>
          <div style={s.box}>
            <div style={s.boxLabel}>Order Details</div>
            <div style={s.boxRow}>
              <span style={s.boxRowLabel}>Order Number:</span>
              <span style={{ ...s.boxRowValue, fontWeight: "700", color: "#4b0082" }}>{order.order_number}</span>
            </div>
            <div style={s.boxRow}>
              <span style={s.boxRowLabel}>Order Date:</span>
              <span style={s.boxRowValue}>{orderDate}</span>
            </div>
            {order.carrier && (
              <div style={s.boxRow}>
                <span style={s.boxRowLabel}>Carrier:</span>
                <span style={s.boxRowValue}>{order.carrier}</span>
              </div>
            )}
            {order.tracking_number && (
              <div style={s.boxRow}>
                <span style={s.boxRowLabel}>Tracking:</span>
                <span style={s.boxRowValue}>{order.tracking_number}</span>
              </div>
            )}
            <div style={s.boxRow}>
              <span style={s.boxRowLabel}>Est. Delivery:</span>
              <span style={s.boxRowValue}>{deliveryDate}</span>
            </div>
          </div>
          <div style={s.box}>
            <div style={s.boxLabel}>Deliver To</div>
            <div style={s.boxName}>{customerName}</div>
            <div style={s.boxRow}>
              <span style={s.boxRowLabel}>Phone:</span>
              <span style={s.boxRowValue}>{customerPhone}</span>
            </div>
            <div style={s.boxRow}>
              <span style={s.boxRowLabel}>Email:</span>
              <span style={s.boxRowValue}>{customerEmail}</span>
            </div>
            {addressLines && (
              <div style={s.boxRow}>
                <span style={s.boxRowLabel}>Address:</span>
                <span style={s.boxRowValue}>{addressLines}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Items Table ── */}
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.thCenter, width: "52px" }}>Packed</th>
              <th style={s.th}>Item Description</th>
              <th style={{ ...s.th, width: "80px" }}>SKU</th>
              <th style={{ ...s.thCenter, width: "52px" }}>QTY</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const { name, details } = buildPackingDescription(item);
              return (
                <tr key={item.id} style={idx % 2 === 1 ? s.trEven : {}}>
                  <td style={{ ...s.td, textAlign: "center" as const }}>
                    <span style={s.checkbox} />
                  </td>
                  <td style={s.td}>
                    <div style={s.itemName}>{name}</div>
                    {details.length > 0 && (
                      <div style={s.itemDetail}>{details.join(" · ")}</div>
                    )}
                    {item.product?.sku && (
                      <div style={s.itemSku}>SKU: {item.product.sku}</div>
                    )}
                  </td>
                  <td style={{ ...s.td, fontSize: "11px", color: "#888" }}>
                    {item.product?.sku || "—"}
                  </td>
                  <td style={s.tdCenter}>{item.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Footer ── */}
        <div style={s.footer}>
          <div>
            <span style={s.footerHighlight}>Thank you for shopping with Scarlet Thread.</span>
          </div>
          <div>Packing slip contains <strong>NO price info</strong>. Detailed invoice is packed inside.</div>
          <div style={{ marginTop: "4px" }}>
            Order #{order.order_number} · Printed on {format(new Date(), "MMM dd, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
}
