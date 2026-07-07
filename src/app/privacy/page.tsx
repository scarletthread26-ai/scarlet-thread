import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

const PRIVACY_CONTENT = `
  <h2>1. Information We Collect</h2>
  <p>
    To process your orders and provide customer support, we collect specific details when you visit our storefront or place an order. Please note that customization/personalization details are discussed and collected manually with you via WhatsApp, while shipping addresses and payment processing are handled securely on this website:
  </p>
  <ul>
    <li>
      <strong>Identity & Contact Details:</strong> Your name, email address, phone number, and delivery/billing address.
    </li>
    <li>
      <strong>Payment Information:</strong> Transaction identifiers and payment status. Credit/debit card numbers are processed directly by our secure payment gateways and are never stored on our servers.
    </li>
    <li>
      <strong>Device & Usage Data:</strong> IP address, browser type, operating system, and anonymous cookies to track shopping cart items and website behavior.
    </li>
  </ul>

  <h2>2. How We Use Your Information</h2>
  <p>
    We use the collected information for the following business purposes:
  </p>
  <ul>
    <li>
      To craft, digitize, and embroider your personalized items based on your customization choices shared with us via WhatsApp.
    </li>
    <li>
      To manage, ship, and coordinate courier delivery of your orders, including order tracking updates.
    </li>
    <li>
      To process payment transactions and secure checkout flows.
    </li>
    <li>
      To send customer service notifications, respond to support inquiries, or update you on order progress.
    </li>
    <li>
      With your consent, to send you newsletters or promotional offers about new collections.
    </li>
  </ul>

  <h2>3. Information Sharing and Third Parties</h2>
  <p>
    We value your trust. We do not sell, trade, or rent your personal information to marketing firms or third parties. We only share details with trusted service partners to fulfill your orders:
  </p>
  <ul>
    <li>
      <strong>Courier & Shipping Partners:</strong> Fulfilling delivery requires sharing your name, delivery address, community guidelines, and phone number with shipping couriers.
    </li>
    <li>
      <strong>Payment Processors:</strong> Transactions are routed through encrypted payment gateways for secure authorization.
    </li>
    <li>
      <strong>Cloud Providers:</strong> We store orders, shipping addresses, and transaction configurations in secure, encrypted Supabase databases.
    </li>
  </ul>

  <h2>4. Data Retention & Safety</h2>
  <p>
    We retain your order histories as long as necessary to complete your order, manage transaction records, and coordinate customer service. Customized/personalized products are non-returnable and non-refundable (except for damaged, defective, or incorrect items), and order cancellations are allowed only before customization or production begins.
    Our databases employ SSL encryption, row-level database security, and industry-standard security protocols to prevent unauthorized access.
  </p>

  <h2>5. Your Rights and Preferences</h2>
  <p>
    You have the right to request access to the personal data we store, request edits to correct errors, or ask that we delete your personal information from our databases. 
    You can exercise these rights or request newsletter opt-outs by emailing us at <strong>support@scarletthread.ae</strong>.
  </p>
`;

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      slug="privacy"
      title="Privacy Policy"
      description="Understanding how we protect your personal coordinates and personalization details at The Scarlet Thread."
      content={PRIVACY_CONTENT}
    />
  );
}
