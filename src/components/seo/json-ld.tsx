interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders a JSON-LD script tag. Server component — emits to the static
 * HTML so crawlers can read it without executing JS.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://equinoxint.net";

export function organizationSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Equinox International for Import & Export",
    legalName: "Equinox International for Import & Export",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/img/logo.png`,
    image: `${SITE_URL}/og-cover.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "26 Mohamed Kamel Hussein St.",
      addressLocality: "New Nozha, Cairo",
      addressCountry: "EG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+20-2-2621-0080",
        contactType: "customer service",
        email: "info@equinoxint.net",
        areaServed: ["EG", "AE"],
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: [],
  };
}

export function breadcrumbSchema(
  locale: string,
  items: { label: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}
