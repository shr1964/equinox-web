import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { siteMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity";
import { servicesQuery } from "@/lib/queries";

interface ServiceSection {
  anchor: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  title: string;
  lede: string;
  bullets: string[];
}

interface Stage {
  num: string;
  title: string;
  desc: string;
}

interface IndexItem {
  anchor: string;
  label: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({
    locale,
    path: "/services",
    titleKey: "services.title",
    descriptionKey: "services.description",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const sanitySections = await sanityFetch<ServiceSection>({
    query: servicesQuery,
    params: { locale },
    tags: ["service"],
  }).catch(() => [] as ServiceSection[]);

  const stages = t.raw("process.stages") as Stage[];
  // const indexItems = t.raw("index.items") as IndexItem[];

  // Use Sanity data when available; fall back to JSON translations
  const sections: ServiceSection[] = sanitySections.length > 0
    ? sanitySections
    : t.raw("sections") as ServiceSection[];

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
        image="crane-loading.jpg"
        imageAlt="Crane loading containers"
      />

      {/* Service anchor index */}
      {/* <section className="py-[clamp(56px,7vw,88px)]">
        <Container>
          <Reveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-y border-[var(--line)]">
            {indexItems.map((i, idx) => (
              <a
                key={i.anchor}
                href={`#${i.anchor}`}
                className={`px-[20px] py-[20px] font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--fg)] hover:text-[var(--color-navy-700)] transition-colors ${
                  idx < indexItems.length - 1 ? "border-e border-[var(--line)]" : ""
                }`}
              >
                {i.label}
              </a>
            ))}
          </Reveal>
        </Container>
      </section> */}

      {/* Alternating service sections */}
      {sections.map((s, idx) => {
        const imgSrc = s.image?.startsWith("http") ? s.image : `/img/${s.image}`;
        return (
          <section
            key={s.anchor}
            id={s.anchor}
            className={`py-[var(--section-y)] ${idx % 2 === 1 ? "bg-[var(--bg-alt)]" : ""}`}
          >
            <Container>
              <Reveal
                className={`grid grid-cols-1 lg:grid-cols-2 gap-[32px] lg:gap-[64px] items-stretch`}
              >
                <div className={`relative aspect-[4/5] rounded-[14px] overflow-hidden bg-[var(--color-navy-900)] ${s.reverse ? "lg:order-2" : ""}`}>
                  <Image
                    src={imgSrc}
                    alt={s.imageAlt || s.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  {/* <Eyebrow className="mb-[24px]">{s.eyebrow}</Eyebrow> */}
                  <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(36px,4vw,56px)] leading-[1.05] m-0">
                    {s.title}
                  </h2>
                  <p className="mt-[24px] text-[clamp(17px,1.3vw,19px)] leading-[1.55] text-[var(--fg-muted)] max-w-[60ch]">
                    {s.lede}
                  </p>
                  <ul className="mt-[32px] p-0 list-none flex flex-col gap-[14px] text-[15px]">
                    {(s.bullets || []).map((b, i) => (
                      <li key={i} className="flex gap-[16px]">
                        {/* <span className="text-[var(--color-gold-500)] font-mono text-[12px] shrink-0 pt-[4px]">
                          / {String(i + 1).padStart(2, "0")}
                        </span> */}
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Container>
          </section>
        );
      })}

      {/* Six-stage process on navy */}
      <section className="py-[var(--section-y)] bg-[var(--color-navy-900)] text-white">
        <Container>
          <SectionHeader
            eyebrow={t("process.eyebrow")}
            title={t("process.title")}
            intro={
              <span className="text-white/[0.7]">{t("process.lede")}</span>
            }
            onDark
            quiet={false}
          />
          <Reveal>
            {stages.map((s, i) => (
              <div
                key={s.num}
                className={`grid grid-cols-[60px_1fr] lg:grid-cols-[100px_1fr_1fr] gap-[24px] lg:gap-[48px] py-[40px] border-t border-white/[0.1] items-start ${
                  i === stages.length - 1 ? "border-b border-white/[0.1]" : ""
                }`}
              >
                
                <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-[var(--color-gold-500)]">
                  {s.num}
                </div>
                <h3 className="font-semibold tracking-[-0.01em] text-[clamp(22px,2vw,28px)] leading-[1.2] text-white m-0">
                  {s.title}
                </h3>
                <div className="col-start-2 lg:col-start-3 text-white/[0.65] text-[15px] leading-[1.6]">
                  {s.desc}
                </div>
              </div>
            ))}
          </Reveal>
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
