import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { LinkArrow } from "@/components/atoms/link-arrow";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { FaqItem } from "@/components/molecules/faq-item";
import { Hero } from "@/components/organisms/hero";
import { Marquee } from "@/components/organisms/marquee";
import { ServiceTile } from "@/components/organisms/service-tile";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { CtaForm } from "@/components/organisms/cta-form";
import { ClientsMarquee } from "@/components/clients/ClientsMarquee";
import { JsonLd, organizationSchema } from "@/components/seo/json-ld";
import { sanityFetch } from "@/lib/sanity";
import { homeServicesQuery } from "@/lib/queries";

interface JsonServiceItem {
  anchor: string;
  image: string;
  imageAlt: string;
  title1: string;
  title2: string;
  desc: string;
}

interface SanityHomeCard {
  _id?: string;
  anchor: string;
  cardTitle: string;
  cardDesc: string;
  image?: string;
  imageAlt?: string;
  cardOrder: number;
}

interface HomeServiceCard {
  anchor: string;
  cardTitle: string;
  cardDesc: string;
  image: string;
  imageAlt: string;
  cardOrder: number;
}

interface FaqEntry {
  q: string;
  a: string;
}

interface TestimonialEntry {
  text: string;
  initials: string;
  name: string;
  role: string;
}

interface WhyUsCard {
  title: string;
  desc: string;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tags = t.raw("industries.tags") as string[];

  const jsonItems = t.raw("services.items") as JsonServiceItem[];

  // Build an anchor-keyed lookup so we can fill per-field gaps from JSON
  const jsonByAnchor = Object.fromEntries(
    jsonItems.map((s) => [s.anchor, s])
  );

  const sanityCards = await sanityFetch<SanityHomeCard>({
    query: homeServicesQuery,
    params: { locale },
    tags: ["service"],
  }).catch(() => [] as SanityHomeCard[]);

  const services: HomeServiceCard[] =
    sanityCards.length > 0
      ? sanityCards.map((s, i) => {
          const j = jsonByAnchor[s.anchor];
          return {
            anchor:    s.anchor,
            // GROQ already coalesces cardTitle→title and cardDesc→lede;
            // JSON is the final safety net for when Sanity docs have no content at all.
            cardTitle: s.cardTitle || j?.title1 || "",
            cardDesc:  s.cardDesc  || j?.desc   || "",
            image:     s.image    || (j ? `/img/${j.image}` : "crane-loading.jpg"),
            imageAlt:  s.imageAlt || j?.imageAlt || "",
            cardOrder: s.cardOrder ?? i + 1,
          };
        })
      : jsonItems.map((s, i) => ({
          anchor:    s.anchor,
          cardTitle: s.title1 + (s.title2 ? " " + s.title2 : ""),
          cardDesc:  s.desc,
          image:     `/img/${s.image}`,
          imageAlt:  s.imageAlt,
          cardOrder: i + 1,
        }));
  const anchors = t.raw("industries.anchors") as string[];
  const whyCards = t.raw("whyUs.cards") as WhyUsCard[];
  const testimonials = t.raw("testimonials.items") as TestimonialEntry[];
  const faqs = t.raw("faq.items") as FaqEntry[];

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <Hero />

      {/* MISSION */}
      <section className="py-[var(--section-y)]">
        <Container>
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[64px] items-end">
            <div>
              {/* <Eyebrow quiet className="mb-[24px]">
                {t("mission.eyebrow")}
              </Eyebrow> */}
              <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(36px,4.4vw,60px)] leading-[1.05] m-0">
                {t("mission.title1")}{" "}
                <span className="text-[var(--fg-muted)]">
                  {t("mission.title2")}
                </span>
              </h2>
            </div>
            <div>
              <p className="text-[clamp(17px,1.3vw,19px)] leading-[1.55] max-w-[60ch] text-[var(--fg-muted)] m-0">
                {t("mission.lede")}
              </p>
              <LinkArrow href="/about" className="mt-[24px]">
                {t("mission.link")}
              </LinkArrow>
            </div>
          </Reveal>
        </Container>
      </section>

      <Marquee items={services.map((s) => s.cardTitle)} />

      {/* SERVICES */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={t("services.eyebrow")}
            title={t("services.title")}
            intro={t("services.lede")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {services.map((s, i) => (
              <Reveal key={s.anchor} delay={i * 0.08}>
                <ServiceTile
                  num={String(i + 1).padStart(2, "0")}
                  href={`/services/${s.anchor}`}
                  image={s.image}
                  imageAlt={s.imageAlt}
                  title={s.cardTitle}
                  desc={s.cardDesc}
                  ctaLabel={tc("explore")}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-[64px] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-[32px]">
            <div className="font-medium tracking-[-0.02em] max-w-[22ch] leading-[1.1] text-[clamp(28px,3vw,40px)]">
              {t("services.outro1")}{" "}
              <span className="text-[var(--color-gold-700)]">
                {t("services.outro2")}
              </span>
            </div>
            <Button href="/contact" variant="primary" withArrow>
              {t("services.outroCta")}
            </Button>
          </div>
        </Container>
      </section>

      {/* INDUSTRIES SPLIT */}
      <section className="py-[var(--section-y-tight)]">
        <Container>
          <Reveal className="bg-[var(--color-navy-900)] text-white rounded-[14px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
            <div className="relative overflow-hidden">
              <Image
                src="/img/containers-ladder.jpg"
                alt="Containers stacked"
                fill
                sizes="(max-width: 1100px) 100vw, 50vw"
                className="object-cover scale-[1.05]"
              />
            </div>
            <div className="p-[clamp(40px,5vw,72px)] flex flex-col justify-between gap-[32px]">
              <div>
                <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(36px,4.4vw,60px)] leading-[1.05] max-w-[14ch] m-0">
                  {t("industries.title")}
                </h2>
                <p className="mt-[24px] text-[clamp(17px,1.3vw,19px)] leading-[1.55] text-white/[0.7]">
                  {t("industries.lede")}
                </p>
                <div className="flex flex-wrap gap-[10px] mt-[32px]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-[18px] py-[10px] rounded-full text-[13px] border border-white/[0.18] text-white/[0.85] transition-all duration-200 hover:border-[var(--color-gold-500)] hover:text-[var(--color-gold-500)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/[0.4] mb-[20px]">
                  {t("industries.anchorsLabel")}
                </div>
                <div className="flex flex-wrap gap-[12px] sm:gap-[24px] items-center text-white/[0.9] font-semibold tracking-[0.02em]">
                  {anchors.map((a, i) => (
                    <span key={a} className="inline-flex items-center gap-[12px] sm:gap-[24px]">
                      <span>{a}</span>
                      {i < anchors.length - 1 ? <span className="opacity-30">·</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* WHY US */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)]">
        <Container>
          <SectionHeader
            eyebrow={t("whyUs.eyebrow")}
            title={t("whyUs.title")}
            intro={t("whyUs.lede")}
          />
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {whyCards.map((c, i) => (
              <article
                key={i}
                className="group rounded-[14px] p-[32px] bg-[var(--card)] border border-[var(--line)] transition-[border-color,transform,box-shadow,background-color,color] duration-[300ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-[var(--color-gold-500)] hover:border-[var(--color-gold-500)] hover:text-white hover:-translate-y-[4px] hover:shadow-[0_16px_40px_-12px_rgba(204,16,32,0.35)]"
              >
                {/* <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--fg-muted)] mb-[24px] transition-[color,opacity] duration-[300ms] group-hover:text-white group-hover:opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </div> */}
                <h3 className="text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.01em] leading-[1.2] mb-[12px]">
                  {c.title}
                </h3>
                <p className="text-[15px] leading-[1.55] text-[var(--fg-muted)] transition-colors duration-[300ms] group-hover:text-white/[0.82]">
                  {c.desc}
                </p>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* REAL RESULT */}
      <section className="py-[var(--section-y)]">
        <Container>
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] lg:gap-[64px] items-center">
            <div>
              
              <h2 className="font-display font-medium tracking-[-0.025em] leading-none text-[clamp(40px,5vw,72px)] m-0">
                {t("realResult.title1")}{" "}
                <span className="text-[var(--color-gold-700)]">
                  {t("realResult.title2")}
                </span>
                <br />
                {t("realResult.title3")}{" "}
                <span className="text-[var(--color-gold-700)]">
                  {t("realResult.title4")}
                </span>
              </h2>
              <p className="mt-[28px] text-[clamp(17px,1.3vw,19px)] leading-[1.55] text-[var(--fg-muted)] max-w-[60ch]">
                {t("realResult.lede")}
              </p>
              <LinkArrow href="/clients" className="mt-[28px]">
                {t("realResult.link")}
              </LinkArrow>
            </div>
            <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[var(--color-navy-900)]">
              <Image
                src="/img/containers-ladder.jpg"
                alt="Container yard detail"
                fill
                sizes="(max-width: 1100px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,10,28,0.1), rgba(6,10,28,0.6))",
                }}
              />
              <div className="absolute inset-x-[32px] bottom-[32px] text-white flex justify-between items-end gap-[32px]">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.22em] uppercase opacity-60">
                    {t("realResult.corridorLabel")}
                  </div>
                  <div className="text-[22px] font-semibold mt-[8px]">
                    {t("realResult.corridorRoute")}
                  </div>
                </div>
                <div className="font-mono text-[12px] opacity-80 text-end leading-[1.6]">
                  <div>{t("realResult.corridorLat")}</div>
                  <div>{t("realResult.corridorLon")}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <ClientsMarquee
        eyebrow={t("clients.eyebrow")}
        viewAllLabel={t("clients.viewAll")}
        learnMoreLabel={t("clients.learnMore")}
      />

      {/* TESTIMONIALS */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
            {testimonials.map((q, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <article className="bg-[var(--card)] border border-[var(--line)] rounded-[14px] p-[32px] flex flex-col gap-[28px] h-full">
                  <svg
                    viewBox="0 0 26 18"
                    fill="currentColor"
                    className="w-[26px] h-[18px] text-[var(--color-gold-500)]"
                    aria-hidden="true"
                  >
                    <path d="M0 18V8.5C0 3.8 3.4 0 8.7 0v3.2C5.7 3.2 3.5 5.4 3.5 8.5h3.7V18H0Zm14.5 0V8.5c0-4.7 3.4-8.5 8.7-8.5v3.2c-3 0-5.2 2.2-5.2 5.3h3.7V18h-7.2Z" />
                  </svg>
                  <p className="text-[17px] leading-[1.45] tracking-[-0.005em] m-0">
                    {q.text}
                  </p>
                  <div className="flex items-center gap-[14px] mt-auto">
                    <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[var(--color-navy-700)] to-[var(--color-navy-500)] text-white inline-flex items-center justify-center font-semibold text-[14px] shrink-0">
                      {q.initials}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">{q.name}</div>
                      <div className="text-[13px] text-[var(--fg-muted)]">{q.role}</div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)]">
        <Container>
          <SectionHeader
            eyebrow={t("faq.eyebrow")}
            title={
              <>
                {t("faq.title1")}
                <br />
                {t("faq.title2")}
              </>
            }
            intro={t("faq.lede")}
            trailing={<LinkArrow href="/contact">{t("faq.link")}</LinkArrow>}
          />
          <Reveal className="border-t border-[var(--line)]">
            {faqs.map((f, i) => (
              <FaqItem key={i} question={f.q} answer={f.a} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* CTA FORM */}
      <section className="py-[var(--section-y)]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[64px] items-start">
            <Reveal className="min-w-0">
              {/* <Eyebrow quiet className="mb-[24px]">
                {t("ctaForm.eyebrow")}
              </Eyebrow> */}
              <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(36px,4.4vw,60px)] leading-[1.05] m-0">
                {t("ctaForm.title")}
              </h2>
              <p className="mt-[24px] text-[clamp(17px,1.3vw,19px)] leading-[1.55] text-[var(--fg-muted)] m-0">
                {t("ctaForm.lede")}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="min-w-0">
              <CtaForm
                eyebrow={t("ctaForm.eyebrow")}
                title={t("ctaForm.formTitle")}
                sub={t("ctaForm.formSub")}
                labels={{
                  name: t("ctaForm.labels.name"),
                  phone: t("ctaForm.labels.phone"),
                  email: t("ctaForm.labels.email"),
                  company: t("ctaForm.labels.company"),
                  description: t("ctaForm.labels.description"),
                }}
                placeholders={{
                  name: t("ctaForm.placeholders.name"),
                  phone: t("ctaForm.placeholders.phone"),
                  email: t("ctaForm.placeholders.email"),
                  company: t("ctaForm.placeholders.company"),
                  description: t("ctaForm.placeholders.description"),
                }}
                submit={t("ctaForm.submit")}
                success={t("ctaForm.success")}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CtaBanner
        eyebrow={t("cta.eyebrow")}
        title={
          <>
            {t("cta.title1")}
            <br />
            {t("cta.title2")}
          </>
        }
        sub={t("cta.sub")}
        primary={{ label: t("cta.ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("cta.ctaSecondary"), href: "/services" }}
      />
    </>
  );
}
