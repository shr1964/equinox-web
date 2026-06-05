import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://equinoxint.net";

/**
 * Root layout — minimal shell required by Next.js App Router.
 * The real layout (fonts, nav, footer, providers) lives in [locale]/layout.tsx.
 *
 * This export provides a last-resort metadata fallback so that any route
 * not covered by a locale layout still emits correct OG/Twitter tags.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Equinox International — Import, Export & Global Logistics",
    template: "%s — Equinox International",
  },
  description:
    "A specialist import and export agency for companies that need to move goods globally without procedural friction. We carry the licenses, manage the customs, and deliver on schedule.",
  openGraph: {
    siteName: "Equinox International",
    type: "website",
    images: [
      {
        url: "/og-cover.png",
        width: 1893,
        height: 945,
        alt: "Equinox International — Moving business beyond borders.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
