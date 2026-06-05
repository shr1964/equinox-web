import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://equinoxint.net";

const PATHS = ["", "/about", "/services", "/clients", "/company", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => {
      const url = `${SITE_URL}/${locale}${path}`;
      const languages: Record<string, string> = {};
      for (const l of routing.locales) {
        languages[l] = `${SITE_URL}/${l}${path}`;
      }
      return {
        url,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1 : 0.8,
        alternates: { languages },
      };
    }),
  );
}
