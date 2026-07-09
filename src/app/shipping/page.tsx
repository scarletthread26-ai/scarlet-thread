import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

const SHIPPING_CONTENT = `
  <h2>1. Order Customization & Processing Time</h2>
  <p>
    At The Scarlet Thread, every item is custom embroidered and made to order. Our master designers inspect, digitize, and carefully stitch each customized design. 
    Because of this personalized craft, we require a processing lead time of <strong>1 to 2 business days</strong> to prepare your items before dispatch.
  </p>
  <p>
    If you place an order on a weekend or public holiday, production will begin on the next business day. Please note that during high-volume holiday seasons (such as Eid, Christmas, or Valentine's Day), production times may extend by an additional day.
  </p>

  <h2>2. UAE Domestic Shipping Rates & Delivery Time</h2>
  <p>
    Once your custom item is completed, we dispatch it via our trusted courier partners. Our shipping timelines and fees across the United Arab Emirates are structured as follows:
  </p>
  <ul>
    <li>
      <strong>Flat Rate Shipping:</strong> Flat rate of <strong>AED 18</strong> for all deliveries within the UAE.
    </li>
    <li>
      <strong>Free Shipping:</strong> Automatically applied to all orders with a subtotal of <strong>AED 200</strong> or above.
    </li>
    <li>
      <strong>Delivery Timeline:</strong> Standard delivery takes <strong>1 to 2 business days</strong> after production dispatch (across all Emirates including Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah).
    </li>
  </ul>

  <h2>3. Delivery Guidelines & Address Accuracy</h2>
  <p>
    To ensure seamless courier delivery, please provide a complete and accurate delivery address, including flat/villa number, street name, community name, city, and a reachable mobile phone number. 
  </p>
  <p>
    Couriers will call or WhatsApp you before delivery to coordinate the exact drop-off window. The Scarlet Thread is not responsible for shipment delays resulting from incorrect address inputs or failure to answer the courier's phone calls.
  </p>
`;

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      slug="shipping"
      title="Shipping & Delivery Policy"
      description="Details on production times, delivery rates, and courier dispatch timelines across the UAE and GCC."
      content={SHIPPING_CONTENT}
    />
  );
}
