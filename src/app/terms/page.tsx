import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

const TERMS_CONTENT = `
  <h2>1. Overview and Acceptance of Terms</h2>
  <p>
    This website is operated by The Scarlet Thread. Throughout the site, the terms "we", "us" and "our" refer to The Scarlet Thread. 
    By accessing our website and purchasing products, you engage in our service and agree to be bound by the following terms and conditions. 
    Please read these Terms & Conditions carefully before navigating our storefront or submitting an order.
  </p>

  <h2>2. Personalization & Accuracy of User Inputs</h2>
  <p>
    Because we specialize in bespoke embroidery, we configure our machines directly based on the information provided in the product customization panels. 
  </p>
  <ul>
    <li>
      <strong>User Responsibility:</strong> You are solely responsible for ensuring that all spelling, initials, text alignment, fonts, colors, and notes are correct before confirming your order.
    </li>
    <li>
      <strong>Errors:</strong> We cannot modify embroidery details once production has started. The Scarlet Thread is not responsible for replacing or refunding items with incorrect text if the text matches your order configuration.
    </li>
  </ul>

  <h2>3. Product Color & Embroidery Variations</h2>
  <p>
    We endeavor to display product colors, fabrics, and thread colors as accurately as possible. 
    However, please note that:
  </p>
  <ul>
    <li>
      Computer and mobile screens display colors differently, and there may be slight color tone variations in the fabric or embroidery thread compared to screen mockups.
    </li>
    <li>
      Embroidery is a physical craft. Minor thread textures, stitching patterns, and slight alignment variations are normal characteristics of embroidered products and are not considered manufacturing defects.
    </li>
  </ul>

  <h2>4. Pricing, Payments, and Cash on Delivery (COD)</h2>
  <p>
    All prices listed on the website are in UAE Dirhams (AED) and are exclusive of delivery fees unless specified. 
    We accept online card payments (Visa, Mastercard, AMEX) and Apple Pay.
  </p>
  <p>
    For Cash on Delivery (COD) orders: COD is offered as a convenience for domestic UAE shipments. By choosing COD, you commit to accepting and paying for the custom item upon delivery. 
    Repeated refusals to accept COD shipments of customized items may lead to account suspension and denial of future service.
  </p>

  <h2>5. Intellectual Property & Custom Logo Submissions</h2>
  <p>
    All content, logos, icons, graphics, photography, and text on this website are the intellectual property of The Scarlet Thread. 
  </p>
  <p>
    When submitting custom designs, logo artwork, or specific vectors for embroidery, you warrant that you own the copyrights or have explicit permission to reproduce the design. 
    The Scarlet Thread reserves the right to reject custom design requests that violate copyright guidelines or contain offensive content.
  </p>

  <h2>6. Limitation of Liability</h2>
  <p>
    The Scarlet Thread will not be liable for any direct, indirect, incidental, or consequential damages resulting from website downtime, shipping delays caused by courier partners, custom clearance, weather conditions, or incorrect address inputs.
  </p>

  <h2>7. Governing Law</h2>
  <p>
    These Terms & Conditions and any separate agreements shall be governed by and construed in accordance with the laws of the United Arab Emirates.
  </p>
`;

export default function TermsAndConditionsPage() {
  return (
    <PolicyPageLayout
      slug="terms"
      title="Terms & Conditions"
      description="Guidelines governing website navigation, purchase agreements, and customized order parameters at The Scarlet Thread."
      content={TERMS_CONTENT}
    />
  );
}
