import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { CtaBanner } from "@/components/organisms/cta-banner";
import { siteMetadata } from "@/lib/seo/metadata";

interface Value {
  num: string;
  title: string;
  desc: string;
}

interface Step {
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
    path: "/about",
    titleKey: "about.title",
    descriptionKey: "about.description",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const storyParagraphs = t.raw("story.paragraphs") as string[];
  const values = t.raw("mvv.values") as Value[];
  const steps = t.raw("philosophy.steps") as Step[];

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
        image="port-tugs.jpg"
        imageAlt="Tugboats at the port"
      />

      {/* Story */}
      <section className="py-[var(--section-y)]">
        <Container>
          <Reveal className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-[clamp(32px,5vw,56px)] items-start">
            <div className="flex items-center sm:items-start">
              <span className="font-extrabold tracking-[-0.03em] leading-none text-[clamp(38.4px,5.2vw,64px)] text-[var(--color-gold-500)]">
                {t("story.eyebrow")}
              </span>
            </div>
            <div>
              <span className="w-[40px] h-[1.5px] bg-[var(--color-gold-500)] mb-[24px] block" />
              <h2 className="font-display font-bold tracking-[-0.03em] text-[clamp(26px,3.2vw,48px)] leading-[1.1] m-0 mb-[clamp(28px,3.5vw,44px)]">
                {t("story.title")}
              </h2>

              {/* Lead paragraph — full width, slightly larger */}
              <p className="text-[clamp(16px,1.15vw,18px)] text-[var(--fg-muted)] leading-[1.7] mb-[clamp(32px,4vw,52px)]">
                {storyParagraphs[0]}
              </p>

              {/* Body paragraphs — two columns on sm+, each with a gold accent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(24px,3vw,48px)] gap-y-[32px]">
                {storyParagraphs.slice(1).map((p, i) => (
                  <div key={i}>
                    <span className="w-[40px] h-[1.5px] bg-[var(--color-gold-500)] block mb-[16px]" />
                    <p className="text-[15px] text-[var(--fg-muted)] leading-[1.65] m-0">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Vision */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)]">
        <Container>
          <Reveal>
            <div className="grid grid-cols-[200px_1fr] gap-[clamp(32px,5vw,56px)] items-start max-w-[720px]">
              <div className="flex items-center">
                <span className="font-extrabold tracking-[-0.03em] leading-none text-[clamp(38.4px,5.2vw,64px)] text-[var(--color-gold-500)]">
                  {t("mvv.visionLabel")}
                </span>
              </div>
              <div>
                <span className="w-[40px] h-[1.5px] bg-[var(--color-gold-500)] mb-[24px] block" />
                <p className="text-[17px] leading-[1.65] text-[var(--fg-muted)] m-0">
                  {t("mvv.visionText")}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-[var(--section-y)] bg-[var(--color-navy-900)]">
        <Container>
          <Reveal>
            <div className="grid grid-cols-[200px_1fr] gap-[clamp(32px,5vw,56px)] items-start max-w-[720px]">
              <div className="flex items-center">
                <span className="font-extrabold tracking-[-0.03em] leading-none text-[clamp(38.4px,5.2vw,64px)] text-[var(--color-gold-500)]">
                  {t("mvv.missionLabel")}
                </span>
              </div>
              <div>
                <span className="w-[40px] h-[1.5px] bg-[var(--color-gold-500)] mb-[24px] block" />
                <p className="text-[17px] leading-[1.65] text-white/80 m-0">
                  {t("mvv.missionText")}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-[var(--section-y)]">
        <Container>
          <Reveal className="grid grid-cols-[200px_1fr] gap-[clamp(32px,5vw,56px)] items-start mb-[clamp(48px,6vw,80px)]">
            <div className="flex items-center">
              <span className="font-extrabold tracking-[-0.03em] leading-none text-[clamp(38.4px,5.2vw,64px)] text-[var(--color-gold-500)]">
                {t("mvv.valuesLabel")}
              </span>
            </div>
            <div>
              <span className="w-[40px] h-[1.5px] bg-[var(--color-gold-500)] mb-[24px] block" />
              <h2 className="font-display font-bold tracking-[-0.03em] text-[clamp(40px,4.8vw,64px)] leading-[1.0] m-0">
                {/* {t("mvv.valuesTitle")} */}
              </h2>
            </div>
          </Reveal>
          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
            {values.map((v) => (
              <ValueCard key={v.num} {...v} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)]">
        <Container>
          <SectionHeader
            eyebrow={t("philosophy.eyebrow")}
            title={t("philosophy.title")}
            intro={t("philosophy.lede")}
          />
          <Reveal>
            {steps.map((s, i) => (
              <StepRow key={s.num} step={s} last={i === steps.length - 1} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBanner
        eyebrow={t("cta.eyebrow")}
        title={t("cta.title")}
        primary={{ label: t("cta.ctaPrimary"), href: "/contact" }}
      />
    </>
  );
}

function ValueCard({ num, title, desc }: Value) {
  return (
    <div className="rounded-[14px] p-[32px] bg-[var(--card)] border border-[var(--line)] transition-[border-color,transform] duration-[250ms] hover:border-[var(--color-navy-700)] hover:-translate-y-[2px]">
      {/* <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--fg-muted)] mb-[24px]">
        {num}
      </div> */}
      <h3 className="text-[clamp(22px,2vw,28px)] font-bold tracking-[-0.02em] leading-[1.2] mb-[12px]">
        {title}
      </h3>
      <p className="text-[15px] leading-[1.55] text-[var(--fg-muted)]">{desc}</p>
    </div>
  );
}

function StepRow({ step, last }: { step: Step; last: boolean }) {
  return (
    <div
      className={`grid grid-cols-[60px_1fr] lg:grid-cols-[100px_1fr_1fr] gap-[24px] lg:gap-[48px] py-[40px] border-t border-[var(--line)] items-start ${last ? "border-b border-[var(--line)]" : ""
        }`}
    >
      <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-[var(--color-gold-500)]">
        {step.num}
      </div>
      <h3 className="font-bold tracking-[-0.02em] text-[clamp(22px,2vw,28px)] leading-[1.2] m-0">
        {step.title}
      </h3>
      <div className="col-start-2 lg:col-start-3 text-[var(--fg-muted)] text-[15px] leading-[1.6]">
        {step.desc}
      </div>
    </div>
  );
}