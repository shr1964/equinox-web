import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { ClientsGrid } from "@/components/clients/ClientsGrid";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { siteMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity";
import { clientsQuery } from "@/lib/queries";

interface Metric {
  value: string;
  suffix?: string;
  label: string;
  isCounter?: boolean;
}

interface ClientCard {
  num: string;
  name: string;
  desc: string;
  tags: string[];
}

interface SanityClient {
  _id: string;
  num: string;
  name: string;
  desc: string;
  tags: string[];
  market: string;
  sector: string;
  order: number;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({
    locale,
    path: "/clients",
    titleKey: "clients.title",
    descriptionKey: "clients.description",
  });
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "clientsPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const sanityClients = await sanityFetch<SanityClient>({
    query: clientsQuery,
    params: { locale },
    tags: ["client"],
  }).catch(() => [] as SanityClient[]);

  const metrics = t.raw("metrics") as Metric[];

  const items: ClientCard[] = sanityClients.length > 0
    ? sanityClients.map((c) => ({
        num: c.num || "",
        name: c.name,
        desc: c.desc || "",
        tags: c.tags || [],
      }))
    : (t.raw("portfolio.items") as ClientCard[]);

  return (
    <>
      <PageHead
        crumbs={[
          { label: nav("home"), href: "/" },
          { label: t("head.crumb") },
        ]}
        eyebrow={t("head.eyebrow")}
        title={t("head.title")}
        sub={t("head.sub")}
        image="port-day.jpg"
      />

      {/* Key metrics */}
      <section className="py-[clamp(56px,7vw,88px)]">
        <Container>
          <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[32px] py-[48px] border-y border-[var(--line)]">
            {metrics.map((m, i) => (
              <div key={i}>
                <div className="font-display font-medium leading-none tracking-[-0.02em] text-[clamp(36px,4.4vw,56px)]">
                  {m.isCounter ? <CountUp to={Number(m.value)} /> : m.value}
                  {m.suffix ? (
                    <sup className="text-[0.5em] font-medium text-[var(--color-gold-500)] align-super ms-[2px]">
                      {m.suffix}
                    </sup>
                  ) : null}
                </div>
                <div className="font-mono uppercase text-[11px] tracking-[0.22em] mt-[12px] text-[var(--fg-muted)]">
                  {m.label}
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Portfolio */}
      <section className="py-[var(--section-y)]" style={{ paddingTop: "clamp(48px,6vw,72px)" }}>
        <Container>
          <SectionHeader
            eyebrow={t("portfolio.eyebrow")}
            title={t("portfolio.title")}
            intro={t("portfolio.lede")}
          />
          <ClientsGrid items={items} />
        </Container>
      </section>

      <CtaBanner
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        sub={t("cta.sub")}
        primary={{ label: t("cta.ctaPrimary"), href: "/contact" }}
      />
    </>
  );
}

