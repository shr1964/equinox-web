import type { Metadata } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/organisms/nav";
import { Footer } from "@/components/organisms/footer";
import { sanityFetch } from "@/lib/sanity";
import { navServicesQuery, type NavService } from "@/lib/queries";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { siteMetadata } from "@/lib/seo/metadata";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({ locale, path: "/" });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const navServices = await sanityFetch<NavService>({
    query: navServicesQuery,
    params: { locale },
    tags: ["service"],
  });

  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVars = `${inter.variable} ${jetbrains.variable} ${plexArabic.variable}`;
  const fontFamily =
    locale === "ar" ? "var(--font-arabic), var(--font-inter)" : "var(--font-inter)";

  return (
    <html lang={locale} dir={dir} className={fontVars} style={{ fontFamily }}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Providers locale={locale as Locale}>
            <LenisProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-[14px] focus:py-[10px] focus:rounded-full focus:bg-[var(--color-gold-500)] focus:text-[var(--color-navy-900)] focus:font-semibold focus:text-[13px]"
              >
                {locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
              </a>
              <Nav services={navServices} />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </LenisProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
