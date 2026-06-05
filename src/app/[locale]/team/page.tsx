import { notFound } from "next/navigation";
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
import { teamMembersQuery } from "@/lib/queries";

interface Member {
  initials: string;
  tag: string;
  role: string;
  name: string;
  desc: string;
  phone: string;
  phoneHref: string;
  email: string;
  image?: string;
  imageAlt?: string;
}

interface StatRow {
  value: string;
  label: string;
}

interface Principle {
  num: string;
  title: string;
  desc: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({
    locale,
    path: "/team",
    titleKey: "team.title",
    descriptionKey: "team.description",
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  notFound(); // page hidden — client approval pending

  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "teamPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const sanityMembers = await sanityFetch<Member>({
    query: teamMembersQuery,
    params: { locale },
    tags: ["teamMember"],
  }).catch(() => [] as Member[]);

  const stats = t.raw("structure.stats") as StatRow[];
  const paragraphs = t.raw("structure.paragraphs") as string[];
  const principles = t.raw("culture.principles") as Principle[];

  // Use Sanity data when available; fall back to JSON translations
  const members: Member[] = sanityMembers.length > 0
    ? sanityMembers
    : t.raw("leadership.members") as Member[];

  return (
    <>
      <PageHead
        crumbs={[
          { label: nav("home"), href: "/" },
          { label: t("head.crumb") },
        ]}
        eyebrow={t("head.eyebrow")}
        title={
          <>
            {t("head.title1")}
            <br />
            {t("head.title2")}
          </>
        }
        sub={t("head.sub")}
        image="crane-msc.jpg"
      />

      {/* Leadership */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={t("leadership.eyebrow")}
            title={t("leadership.title")}
            intro={t("leadership.lede")}
          />
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {members.map((m) => (
              <article
                key={m.email}
                className="rounded-[14px] overflow-hidden bg-[var(--card)] border border-[var(--line)] transition-[border-color,transform] duration-[250ms] hover:border-[var(--color-navy-700)] hover:-translate-y-[2px]"
              >
                <div
                  className="aspect-[4/5] relative flex items-end justify-center overflow-hidden"
                  style={
                    m.image
                      ? undefined
                      : {
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(245,166,35,.18), transparent 60%), linear-gradient(135deg, var(--color-navy-800), var(--color-navy-700))",
                        }
                  }
                >
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.imageAlt || m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-thin text-[120px] text-white/[0.2] tracking-[-0.04em]"
                    >
                      {m.initials}
                    </span>
                  )}
                  <span className="absolute bottom-[16px] left-[16px] font-mono text-[10px] tracking-[0.22em] uppercase text-white/[0.5] z-[1]">
                    {m.tag}
                  </span>
                </div>
                <div className="p-[28px]">
                  <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold-500)] mb-[10px]">
                    {m.role}
                  </div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.01em] mb-[16px]">
                    {m.name}
                  </h3>
                  <p className="text-[15px] leading-[1.55] text-[var(--fg-muted)] mb-[18px]">
                    {m.desc}
                  </p>
                  <div className="text-[13px] text-[var(--fg-muted)] leading-[1.6]">
                    <div>
                      <a href={`tel:${m.phoneHref}`} dir="ltr" className="hover:text-[var(--color-navy-700)] hover:border-b hover:border-[var(--color-navy-700)]">
                        {m.phone}
                      </a>
                    </div>
                    <div>
                      <a href={`mailto:${m.email}`} className="hover:text-[var(--color-navy-700)]">
                        {m.email}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Structure */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)]">
        <Container>
          <Reveal className="grid grid-cols-1 lg:[grid-template-columns:0.8fr_1.2fr] gap-[24px] lg:gap-[clamp(48px,6vw,96px)]">
            <div>
              <Eyebrow quiet className="mb-[24px]">
                {t("structure.eyebrow")}
              </Eyebrow>
              <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(36px,4.4vw,60px)] leading-[1.05] max-w-[14ch] m-0">
                {t("structure.title")}
              </h2>
            </div>
            <div>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[var(--fg-muted)] leading-[1.6] mb-[18px] last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-[64px] p-[48px] rounded-[14px] bg-[var(--card)] border border-[var(--line)] grid grid-cols-2 lg:grid-cols-4 gap-[32px]">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-medium leading-none tracking-[-0.02em] text-[56px]">
                  {s.value}
                </div>
                <div className="font-mono uppercase text-[11px] tracking-[0.22em] mt-[8px] text-[var(--fg-muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Culture / Principles */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={t("culture.eyebrow")}
            title={t("culture.title")}
            intro={t("culture.lede")}
          />
          <Reveal>
            {principles.map((p, i) => (
              <div
                key={p.num}
                className={`grid grid-cols-[60px_1fr] lg:grid-cols-[100px_1fr_1fr] gap-[24px] lg:gap-[48px] py-[40px] border-t border-[var(--line)] items-start ${
                  i === principles.length - 1 ? "border-b border-[var(--line)]" : ""
                }`}
              >
                <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-[var(--color-gold-500)]">
                  {p.num}
                </div>
                <h3 className="font-semibold tracking-[-0.01em] text-[clamp(22px,2vw,28px)] leading-[1.2] m-0">
                  {p.title}
                </h3>
                <div className="col-start-2 lg:col-start-3 text-[var(--fg-muted)] text-[15px] leading-[1.6]">
                  {p.desc}
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
