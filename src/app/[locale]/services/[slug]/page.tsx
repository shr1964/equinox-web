import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHead } from "@/components/organisms/page-head";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { sanityFetch } from "@/lib/sanity";
import { serviceBySlugQuery } from "@/lib/queries";

interface ServiceDetail {
  _id?: string;
  anchor: string;
  eyebrow?: string;
  title: string;
  cardLine1?: string;
  cardLine2?: string;
  shortDesc?: string;
  lede?: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  order?: number;
}

// Called once per parent locale by Next.js — returns only the [slug] segment
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  const services = await sanityFetch<{ anchor: string }>({
    query: `*[_type == "service" && language == $locale] | order(order asc) { "anchor": anchor.current }`,
    params: { locale },
    tags: ["service"],
  }).catch(() => [] as { anchor: string }[]);

  if (services.length > 0) {
    return services.filter((s) => s.anchor).map((s) => ({ slug: s.anchor }));
  }

  // Fallback to the seven known service slugs when Sanity isn't connected
  return [
    { slug: "ior" },
    { slug: "ddp" },
    { slug: "freight" },
    { slug: "logistics" },
    { slug: "compliance" },
    { slug: "customs" },
    { slug: "warehousing" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const [service] = await sanityFetch<ServiceDetail>({
    query: serviceBySlugQuery,
    params: { locale, slug },
    tags: ["service"],
  }).catch(() => [] as ServiceDetail[]);

  if (!service) {
    const t = await getTranslations({ locale, namespace: "servicesPage" });
    const fallback = (t.raw("sections") as ServiceDetail[]).find(
      (s) => s.anchor === slug
    );
    if (fallback) {
      return {
        title: `${fallback.title} — Equinox International`,
        description: fallback.lede?.substring(0, 160) ?? "",
      };
    }
    return { title: "Service — Equinox International" };
  }

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://equinoxint.net";

  return {
    title: `${service.title} — Equinox International`,
    description: service.lede?.substring(0, 160) ?? "",
    alternates: {
      canonical: `${SITE_URL}/${locale}/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} — Equinox International`,
      description: service.lede?.substring(0, 160) ?? "",
      images: service.image
        ? [{ url: service.image, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const navT = await getTranslations({ locale, namespace: "nav" });

  const sanityServices = await sanityFetch<ServiceDetail>({
    query: serviceBySlugQuery,
    params: { locale, slug },
    tags: ["service"],
  }).catch(() => [] as ServiceDetail[]);

  // Sanity first; fall back to JSON translations
  let service: ServiceDetail | null = sanityServices[0] ?? null;

  if (!service) {
    const fallbackSections = t.raw("sections") as ServiceDetail[];
    service = fallbackSections.find((s) => s.anchor === slug) ?? null;
  }

  if (!service) {
    notFound();
  }

  const imgSrc = service.image
    ? service.image.startsWith("http")
      ? service.image
      : `/img/${service.image}`
    : "/img/crane-loading.jpg";

  return (
    <>
      <PageHead
        crumbs={[
          { label: navT("home"), href: "/" },
          { label: navT("services"), href: "/services" },
          { label: service.title },
        ]}
        eyebrow={
          service.eyebrow ??
          `${navT("services")} — ${String(service.order ?? 1).padStart(2, "0")}`
        }
        title={service.title}
        sub={service.lede}
        image={imgSrc}
        imageAlt={service.imageAlt ?? service.title}
      />

      {/* Features */}
      {(service.bullets?.length ?? 0) > 0 && (
        <section className="py-[var(--section-y)]">
          <Container>
            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[80px] items-start">
              <div>
                <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(32px,3.5vw,48px)] leading-[1.05] m-0">
                  {t("detail.featuresTitle")}
                </h2>
                <ul className="mt-[40px] p-0 list-none flex flex-col gap-0">
                  {service.bullets!.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-[18px] py-[20px] border-b border-[var(--line)] last:border-b-0"
                    >
                      <span
                        aria-hidden="true"
                        className="shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-gold-500)] mt-[10px]"
                      />
                      <span className="text-[17px] leading-[1.6]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-[4/5] rounded-[14px] overflow-hidden bg-[var(--color-navy-900)] lg:sticky lg:top-[120px]">
                <Image
                  src={imgSrc}
                  alt={service.imageAlt ?? service.title}
                  fill
                  sizes="(max-width: 1100px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, rgba(6,10,28,0.6) 100%)",
                  }}
                />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <CtaBanner
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        sub={t("cta.sub")}
        primary={{ label: t("cta.ctaPrimary"), href: "/contact" }}
      />
    </>
  );
}
