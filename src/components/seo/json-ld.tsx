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

type CompanyInfoRow = {
  label: string;
  value: string;
  order: number;
  format?: "text" | "mono" | "tel";
  tel?: string;
};

type CompanySource = {
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  infoRows?: CompanyInfoRow[];
};

/**
 * Organization schema for the Company page, generated dynamically from the
 * Sanity `companyPage` document. The information-table rows carry a stable
 * `order` (1-7) that is identical across languages, so values are looked up by
 * order: 1 Company Name · 4 Registered Office · 5 Tax Registration ·
 * 6 Company Phone (format "tel") · 7 Markets of Operation. Any missing row
 * falls back to the canonical hardcoded values so the schema is always valid.
 */
export function companyOrganizationSchema(
  locale: string,
  company?: CompanySource | null,
) {
  const rows = company?.infoRows ?? [];
  const byOrder = (n: number) => rows.find((r) => r.order === n)?.value;
  const telRow = rows.find((r) => r.format === "tel");

  const name =
    byOrder(1) ||
    [company?.heroTitleLine1, company?.heroTitleLine2]
      .filter(Boolean)
      .join(" ")
      .replace(/\.\s*$/, "") ||
    "Equinox International for Import & Export";

  const addressValue =
    byOrder(4) ||
    "26 Mohamed Kamel Hussein St. · New Nozha · Cairo · Egypt";
  const taxValue = byOrder(5);
  const telephone = telRow?.tel || "+20226210080";
  const marketsValue = byOrder(7);

  // "26 … St. · New Nozha · Cairo · Egypt" → street / locality (country is fixed EG)
  const addressParts = addressValue.split("·").map((p) => p.trim());
  const streetAddress = addressParts[0] || addressValue;
  const addressLocality =
    addressParts.length > 1
      ? addressParts.slice(1, -1).join(", ")
      : undefined;

  // "Egypt · United Arab Emirates · Wider MENA" → ["EG", "AE"] best-effort
  const REGION_CODES: Record<string, string> = {
    egypt: "EG",
    مصر: "EG",
    "united arab emirates": "AE",
    "الإمارات العربية المتحدة": "AE",
  };
  const areaServed = marketsValue
    ? Array.from(
        new Set(
          marketsValue
            .split("·")
            .map((p) => REGION_CODES[p.trim().toLowerCase()] || REGION_CODES[p.trim()])
            .filter(Boolean),
        ),
      )
    : ["EG", "AE"];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    legalName: name,
    url: `${SITE_URL}/${locale}/company`,
    logo: `${SITE_URL}/img/logo.png`,
    image: `${SITE_URL}/og-cover.png`,
    ...(taxValue ? { taxID: taxValue } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress,
      ...(addressLocality ? { addressLocality } : {}),
      addressCountry: "EG",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone,
        contactType: "customer service",
        email: "info@equinoxint.net",
        areaServed: areaServed.length ? areaServed : ["EG", "AE"],
        availableLanguage: ["English", "Arabic"],
      },
    ],
    areaServed: areaServed.length ? areaServed : ["EG", "AE"],
    sameAs: [],
  };
}

export function breadcrumbSchema(
  locale: string,
  items: { label: string; path?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.path ? { item: `${SITE_URL}/${locale}${item.path}` } : {}),
    })),
  };
}
