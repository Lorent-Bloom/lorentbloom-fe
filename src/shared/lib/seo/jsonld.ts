import { BRAND } from "@shared/config/brand";

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BRAND.domain}/#organization`,
    name: BRAND.name,
    url: BRAND.domain,
    logo: `${BRAND.domain}/logo.png`,
    email: BRAND.email,
    ...(BRAND.phone ? { telephone: BRAND.phone } : {}),
    ...(BRAND.socialProfiles.length > 0
      ? { sameAs: BRAND.socialProfiles }
      : {}),
    foundingDate: BRAND.foundingDate,
    areaServed: {
      "@type": "Country",
      name: BRAND.serviceArea.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: BRAND.email,
      availableLanguage: ["English", "Russian", "Romanian"],
    },
  };
}

export function getWebSiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BRAND.domain}/#website`,
    name: BRAND.name,
    url: BRAND.domain,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND.domain}/${locale}/product-search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface ProductJsonLdInput {
  name: string;
  description: string;
  image: string;
  url: string;
  sku: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock";
  ratingValue?: number;
  reviewCount?: number;
}

export function getProductJsonLd(product: ProductJsonLdInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
      seller: {
        "@type": "Organization",
        name: BRAND.name,
      },
    },
  };

  if (product.ratingValue && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

interface BreadcrumbJsonLdItem {
  name: string;
  url?: string;
}

export function getBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
