/**
 * TaxInvoice.tsx
 * Renders a full A4 Tax Invoice as a hidden div.
 * Call printDocument("scarlet-tax-invoice", ...) to print.
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
  status: string;
  payment_method?: string | null;
  payment_status?: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount?: number;
  total_amount: number;
  guest_email?: string | null;
  guest_phone?: string | null;
  shipping_address?: ShippingAddress | null;
  items?: OrderItem[];
}

interface TaxInvoiceProps {
  order: OrderData;
}

// Build a concise item description from product name + personalization
function buildItemDescription(item: OrderItem): string {
  const parts: string[] = [];
  if (item.product?.name) parts.push(item.product.name);
  const p = item.personalization_data;
  if (p) {
    if (p.color) parts.push(`Color: ${p.color}`);
    if (p.size) parts.push(`Size: ${p.size}`);
    if (p.name) parts.push(`Name: ${p.name}`);
    if (p.fontStyle) parts.push(`Font: ${p.fontStyle}`);
    if (p.fontColor) parts.push(`Thread Color: ${p.fontColor}`);
  }
  return parts.join(" | ");
}

function formatCurrency(amount: number): string {
  return `AED ${Number(amount).toFixed(2)}`;
}

export function TaxInvoice({ order }: TaxInvoiceProps) {
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

  const invoiceDate = order.created_at
    ? format(new Date(order.created_at), "MMM dd, yyyy")
    : "—";

  const items = order.items || [];
  const subtotal = Number(order.subtotal || 0);
  const shippingCost = Number(order.shipping_cost || 0);
  const discount = Number(order.discount_amount || 0);
  const total = Number(order.total_amount || 0);

  const paymentMethodLabel =
    order.payment_method
      ? order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)
      : "—";
  const paymentStatusLabel =
    order.payment_status
      ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)
      : "—";

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
      borderBottom: "3px solid #4b0082",
      paddingBottom: "16px",
      marginBottom: "20px",
    },
    logoArea: { display: "flex", flexDirection: "column" as const, gap: "2px" },
    logoText: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#4b0082",
      letterSpacing: "1px",
    },
    logoSub: { fontSize: "10px", color: "#888", marginTop: "2px" },
    invoiceTitle: { textAlign: "right" as const },
    invoiceTitleText: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#4b0082",
      letterSpacing: "1px",
    },
    invoiceMeta: { fontSize: "11px", color: "#555", marginTop: "4px", lineHeight: "1.6" },
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "20px",
    },
    box: {
      background: "#f9f7ff",
      border: "1px solid #e8e0f5",
      borderRadius: "8px",
      padding: "14px 16px",
    },
    boxLabel: {
      fontSize: "9px",
      fontWeight: "700",
      color: "#4b0082",
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      marginBottom: "8px",
    },
    boxName: { fontWeight: "700", fontSize: "13px", marginBottom: "4px" },
    boxLine: { fontSize: "12px", color: "#444", marginBottom: "2px" },
    payRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      background: "#f3f0fb",
      border: "1px solid #e0d8f5",
      borderRadius: "8px",
      padding: "12px 16px",
      marginBottom: "20px",
    },
    payLabel: { fontSize: "9px", fontWeight: "700", color: "#4b0082", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "4px" },
    payValue: { fontWeight: "600", fontSize: "13px" },
    payValueGreen: { fontWeight: "700", fontSize: "13px", color: "#16a34a" },
    table: { width: "100%", borderCollapse: "collapse" as const, marginBottom: "16px", fontSize: "12px" },
    th: {
      background: "#4b0082",
      color: "#fff",
      padding: "8px 10px",
      textAlign: "left" as const,
      fontWeight: "700",
      fontSize: "11px",
      letterSpacing: "0.5px",
    },
    thRight: {
      background: "#4b0082",
      color: "#fff",
      padding: "8px 10px",
      textAlign: "right" as const,
      fontWeight: "700",
      fontSize: "11px",
      letterSpacing: "0.5px",
    },
    td: { padding: "9px 10px", borderBottom: "1px solid #ede9f7", verticalAlign: "top" as const },
    tdRight: { padding: "9px 10px", borderBottom: "1px solid #ede9f7", textAlign: "right" as const, fontWeight: "600" },
    tdCenter: { padding: "9px 10px", borderBottom: "1px solid #ede9f7", textAlign: "center" as const },
    tdNum: { padding: "9px 10px", borderBottom: "1px solid #ede9f7", textAlign: "center" as const, color: "#666", fontSize: "11px" },
    trEven: { background: "#faf9ff" },
    totalsWrap: { display: "flex", justifyContent: "flex-end", marginBottom: "24px" },
    totalsBox: { width: "260px" },
    totalsRow: { display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: "12px", color: "#444" },
    totalsRowBold: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #4b0082", marginTop: "4px", fontWeight: "800", fontSize: "15px", color: "#4b0082" },
    discountRow: { display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: "12px", color: "#16a34a", fontWeight: "600" },
    footer: {
      borderTop: "1px dashed #d0c0e8",
      paddingTop: "16px",
      textAlign: "center" as const,
      fontSize: "11px",
      color: "#777",
      lineHeight: "1.6",
    },
    itemDesc: { fontWeight: "600", color: "#111" },
    itemVariant: { fontSize: "11px", color: "#777", marginTop: "2px" },
  };

  return (
    <div id="scarlet-tax-invoice" style={{ display: "none" }}>
      <div style={s.wrap}>
        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.logoArea}>
            <div style={s.logoText}>SCARLET THREAD</div>
            <div style={s.logoSub}>Premium Personalised Gifting · UAE</div>
          </div>
          <div style={s.invoiceTitle}>
            <div style={s.invoiceTitleText}>TAX INVOICE</div>
            <div style={s.invoiceMeta}>
              Invoice No: {order.order_number}
              <br />
              Date: {invoiceDate}
            </div>
          </div>
        </div>

        {/* ── Sold By / Deliver To ── */}
        <div style={s.twoCol}>
          <div style={s.box}>
            <div style={s.boxLabel}>Sold By</div>
            <div style={s.boxName}>Scarlet Thread</div>
            <div style={s.boxLine}>Premium Personalised Gifting</div>
            <div style={s.boxLine}>United Arab Emirates</div>
            <div style={s.boxLine}>hello@scarletthread.ae</div>
          </div>
          <div style={s.box}>
            <div style={s.boxLabel}>Deliver To / Bill To</div>
            <div style={s.boxName}>{customerName}</div>
            <div style={s.boxLine}>Phone: {customerPhone}</div>
            <div style={s.boxLine}>Email: {customerEmail}</div>
            {addressLines && <div style={s.boxLine}>Address: {addressLines}</div>}
          </div>
        </div>

        {/* ── Payment Info ── */}
        <div style={s.payRow}>
          <div>
            <div style={s.payLabel}>Payment Method</div>
            <div style={s.payValue}>{paymentMethodLabel}</div>
          </div>
          <div>
            <div style={s.payLabel}>Payment Status</div>
            <div style={order.payment_status === "paid" ? s.payValueGreen : s.payValue}>
              {paymentStatusLabel}
            </div>
          </div>
        </div>

        {/* ── Items Table ── */}
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, width: "36px" }}>S.NO</th>
              <th style={s.th}>Item Description</th>
              <th style={{ ...s.thRight, width: "48px" }}>QTY</th>
              <th style={{ ...s.thRight, width: "100px" }}>Unit Price</th>
              <th style={{ ...s.thRight, width: "110px" }}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const lineTotal = item.unit_price * item.quantity;
              const desc = buildItemDescription(item);
              const namePart = item.product?.name || "Product";
              const variantPart = desc.replace(namePart, "").replace(/^\s*\|\s*/, "");
              return (
                <tr key={item.id} style={idx % 2 === 1 ? s.trEven : {}}>
                  <td style={s.tdNum}>{idx + 1}</td>
                  <td style={s.td}>
                    <div style={s.itemDesc}>{namePart}</div>
                    {variantPart && <div style={s.itemVariant}>{variantPart}</div>}
                  </td>
                  <td style={s.tdCenter}>{item.quantity}</td>
                  <td style={s.tdRight}>{formatCurrency(item.unit_price)}</td>
                  <td style={s.tdRight}>{formatCurrency(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Totals ── */}
        <div style={s.totalsWrap}>
          <div style={s.totalsBox}>
            <div style={s.totalsRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={s.totalsRow}>
              <span>Delivery Fee</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            {discount > 0 && (
              <div style={s.discountRow}>
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div style={s.totalsRowBold}>
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={s.footer}>
          <div style={{ fontWeight: "700", color: "#4b0082", marginBottom: "4px" }}>
            Thank you for shopping with Scarlet Thread!
          </div>
          <div>This is a computer-generated tax invoice. No physical signature is required.</div>
          <div style={{ marginTop: "4px" }}>
            For queries, contact us at hello@scarletthread.ae
          </div>
        </div>
      </div>
    </div>
  );
}
