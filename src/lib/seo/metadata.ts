import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://equinoxint.net";

/**
 * The single canonical OG/Twitter share image.
 * Stored at public/og-cover.png (1893 × 945 — ~2:1, above the 1200 × 630 minimum).
 * metadataBase resolves the leading slash to an absolute URL automatically.
 */
const OG_IMAGE = {
  url: "/og-cover.png",
  width: 1893,
  height: 945,
  alt: "Equinox International — Moving business beyond borders.",
  type: "image/png",
} as const;

export async function siteMetadata({
  locale,
  path,
  titleKey,
  descriptionKey,
  title: titleOverride,
  description: descriptionOverride,
  ogTitle,
  ogDescription,
}: {
  locale: string;
  path: string;
  titleKey?: string;
  descriptionKey?: string;
  /** Explicit values (e.g. from Sanity) — take precedence over the i18n keys. */
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });

  const title = titleOverride ?? (titleKey ? t(titleKey) : t("home.title"));
  const description =
    descriptionOverride ??
    (descriptionKey ? t(descriptionKey) : t("home.description"));
  const ogTitleResolved = ogTitle ?? title;
  const ogDescriptionResolved = ogDescription ?? description;

  const canonical = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path === "/" ? "" : path}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${
    path === "/" ? "" : path
  }`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: ogTitleResolved,
      description: ogDescriptionResolved,
      siteName: "Equinox International",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitleResolved,
      description: ogDescriptionResolved,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  };
}
