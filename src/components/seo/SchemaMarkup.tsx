export function SchemaMarkup({ schemaData }: { schemaData: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

// Pre-defined Schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Scarlet Thread",
  url: "https://thescarletthread.ae",
  logo: "https://thescarletthread.ae/logo.png",
  description: "Personalized luxury gifts. Embroidered and made with love.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+971-50-1234567",
    contactType: "customer service"
  },
  sameAs: [
    "https://instagram.com/thescarletthread",
    "https://facebook.com/thescarletthread"
  ]
}

export const generateProductSchema = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: product.image,
  description: product.description,
  sku: product.sku,
  offers: {
    "@type": "Offer",
    url: `https://thescarletthread.ae/product/${product.slug || product.id}`,
    priceCurrency: "AED",
    price: product.price,
    itemCondition: "https://schema.org/NewCondition",
    availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  },
  aggregateRating: product.rating ? {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewCount
  } : undefined
})
