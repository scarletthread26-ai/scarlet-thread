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
      <strong>Dubai, Sharjah & Ajman:</strong> Next-day delivery (1 business day after dispatch). Flat rate of <strong>AED 20</strong>, or <strong>FREE</strong> for orders above AED 250.
    </li>
    <li>
      <strong>Abu Dhabi, Al Ain & Other Emirates:</strong> 2 business days after dispatch. Flat rate of <strong>AED 25</strong>, or <strong>FREE</strong> for orders above AED 250.
    </li>
    <li>
      <strong>Remote & Western Regions:</strong> 2 to 3 business days after dispatch. Flat rate of <strong>AED 35</strong>.
    </li>
  </ul>

  <h2>3. Free Storefront Pickup (Dubai Studio)</h2>
  <p>
    For clients who prefer to collect their orders directly, we offer free self-pickup at our Dubai studio. 
  </p>
  <p>
    To arrange a pickup, select the <strong>"Self-Pickup"</strong> option during checkout. We will email or text you a pickup notification with location details, maps, and studio hours once your order is crafted and packaged.
  </p>

  <h2>4. International & GCC Shipping</h2>
  <p>
    We currently ship custom orders to GCC countries (Saudi Arabia, Oman, Qatar, Bahrain, Kuwait) and selected global destinations. 
  </p>
  <ul>
    <li>
      <strong>GCC Shipping:</strong> 3 to 5 business days transit time. Rates start from AED 45 and are calculated at checkout based on package weight.
    </li>
    <li>
      <strong>Rest of the World:</strong> 5 to 9 business days transit time. Customs duties and taxes are the responsibility of the recipient.
    </li>
  </ul>

  <h2>5. Delivery Guidelines & Address Accuracy</h2>
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
