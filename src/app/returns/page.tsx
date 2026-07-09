import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

const RETURNS_CONTENT = `
  <h2>1. Personalized and Custom Items</h2>
  <p>
    At The Scarlet Thread, each product is uniquely designed and custom embroidered based on the personalization details (names, initials, thread colors, and fonts) you select. 
    Because these items are custom crafted specifically for you, <strong>customized/personalized products are non-returnable and non-refundable</strong>, except in cases of damaged, defective, or incorrect items.
  </p>
  <p>
    We highly recommend reviewing your spelling, capitalization, selection of fonts, and thread colors carefully in the product configurator before submitting your order.
  </p>

  <h2>2. Manufacturing Defects or Personalization Errors</h2>
  <p>
    We take pride in our precision and premium quality control. If we make a mistake on our part, we will resolve it immediately. We will issue a free replacement or store credit if:
  </p>
  <ul>
    <li>
      The spelling of the name or monogram does not match the exact text entered when placing your order.
    </li>
    <li>
      The product delivered is physically defective, torn, or structurally damaged prior to courier delivery.
    </li>
    <li>
      An incorrect base product, color, or size was dispatched (different from your invoice).
    </li>
  </ul>

  <h2>3. Reporting a Problem (48-Hour Window)</h2>
  <p>
    If you receive a defective or incorrect order, please notify us within <strong>48 hours</strong> of receiving the package. To file a verification claim:
  </p>
  <ol>
    <li>
      Take clear photos of the defect, spelling mismatch, or incorrect item.
    </li>
    <li>
      Email the photos along with your order number to <strong>support@scarletthread.ae</strong> or send them via WhatsApp to <strong>+971 50 187 2337</strong>.
    </li>
    <li>
      Our support team will review your claim and respond within 24 hours to arrange your replacement shipment.
    </li>
  </ol>

  <h2>4. Replacements & Resolution</h2>
  <p>
    Once a claim is approved, we will prioritize your replacement order and ship it to you free of charge. You will not have to pay any extra delivery fees. 
    Depending on the circumstances, we may request that you return the incorrect/defective item to our courier partner during the exchange drop-off.
  </p>

  <h2>5. Order Cancellation</h2>
  <p>
    Because production setup begins shortly after order placement, <strong>order cancellation or modifications are allowed only before customization or production begins</strong>. Once design digitization, customization, or embroidery production starts, cancellations are no longer possible.
  </p>
`;

export default function ReturnPolicyPage() {
  return (
    <PolicyPageLayout
      slug="returns"
      title="Return & Refund Policy"
      description="Detailed guidelines regarding personalized order modifications, replacements for defective items, and return procedures."
      content={RETURNS_CONTENT}
    />
  );
}
