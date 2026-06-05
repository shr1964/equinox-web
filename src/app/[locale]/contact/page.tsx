import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { ContactForm } from "@/components/organisms/contact-form";
import { siteMetadata } from "@/lib/seo/metadata";

interface DirectLine {
  label: string;
  phone: string;
  phoneHref: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({
    locale,
    path: "/contact",
    titleKey: "contact.title",
    descriptionKey: "contact.description",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contactPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const officeLines = t.raw("meta.office.lines") as string[];
  const hoursLines = t.raw("meta.hours.lines") as string[];
  const directs = t.raw("meta.direct.items") as DirectLine[];
  const services = t.raw("form.services") as string[];

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
        image="port-sunrise.jpg"
      />

      {/* Meta + Form */}
      <section className="py-[var(--section-y)]">
        <Container>
          <div className="grid grid-cols-1 min-[900px]:[grid-template-columns:1fr_1.4fr] gap-[24px] min-[900px]:gap-[clamp(48px,6vw,96px)]">
            <Reveal>
              <div className="flex flex-col gap-[32px]">
                <ContactBlock first heading={t("meta.office.h")}>
                  <p className="leading-[1.5]">
                    {officeLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < officeLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </ContactBlock>
                <ContactBlock heading={t("meta.general.h")}>
                  <p>
                    <a href={`tel:${t("meta.general.phoneHref")}`} dir="ltr">
                      {t("meta.general.phone")}
                    </a>
                  </p>
                  <p className="mt-[4px]">
                    <a href={`mailto:${t("meta.general.email")}`}>
                      {t("meta.general.email")}
                    </a>
                  </p>
                </ContactBlock>
                <ContactBlock heading={t("meta.whatsapp.h")}>
                  <p>
                    <a href={`https://wa.me/${t("meta.whatsapp.phoneHref")}`} dir="ltr">
                      {t("meta.whatsapp.phone")}
                    </a>
                  </p>
                  <p className="mt-[4px] text-[var(--fg-muted)] text-[13px]">
                    {t("meta.whatsapp.note")}
                  </p>
                </ContactBlock>
                <ContactBlock heading={t("meta.hours.h")}>
                  <p className="leading-[1.5]">
                    {hoursLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < hoursLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </ContactBlock>

                {/* Consultation CTA */}
                <div className="border-t border-[var(--line)] pt-[20px]">
                  <div className="rounded-[14px] bg-[var(--color-navy-900)] p-[clamp(24px,2.5vw,32px)] flex flex-col gap-[18px]">
                    <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-gold-500)]">
                      {t("cta.eyebrow")}
                    </span>
                    <h3 className="font-display font-bold tracking-[-0.02em] text-[clamp(22px,2.2vw,28px)] leading-[1.15] text-white m-0">
                      {t("cta.title")}
                    </h3>
                    <p className="text-[14px] leading-[1.65] text-white/70 m-0">
                      {t("cta.sub")}
                    </p>
                    <div className="pt-[2px] flex flex-col items-start gap-[10px]">
                      <Button
                        href="https://app.cal.eu/equinox/15min?overlayCalendar=true&layout=month_view&date=2026-05-26"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        withArrow
                      >
                        {t("cta.btn")}
                      </Button>
                      <span className="font-mono text-[11px] tracking-[0.1em] text-white/45">
                        {t("cta.note")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <ContactForm
                eyebrow={t("form.eyebrow")}
                title={t("form.title")}
                sub={t("form.sub")}
                labels={{
                  name: t("form.labels.name"),
                  company: t("form.labels.company"),
                  email: t("form.labels.email"),
                  phone: t("form.labels.phone"),
                  service: t("form.labels.service"),
                  route: t("form.labels.route"),
                  message: t("form.labels.message"),
                }}
                placeholders={{
                  name: t("form.placeholders.name"),
                  company: t("form.placeholders.company"),
                  email: t("form.placeholders.email"),
                  phone: t("form.placeholders.phone"),
                  route: t("form.placeholders.route"),
                  message: t("form.placeholders.message"),
                }}
                services={services}
                reply={t("form.reply")}
                submit={t("form.submit")}
                success={t("form.success")}
                error={t("form.error")}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Location */}
      <section className="py-[var(--section-y)] bg-[var(--bg-alt)] overflow-hidden">
        <Container>
          <SectionHeader
            eyebrow={t("map.eyebrow")}
            title={t("map.title")}
            intro={t("map.lede")}
          />

          {/* Address / coordinates strip — uses existing translation keys */}
          <Reveal className="flex flex-wrap justify-between items-start gap-x-[40px] gap-y-[12px] mb-[clamp(28px,4vw,44px)] pb-[clamp(24px,3vw,36px)] border-b border-[var(--line)]">
            <address className="not-italic">
              <span className="block font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)] mb-[6px]">
                {t("map.hq")}
              </span>
              <span className="text-[14px] text-[var(--fg)] leading-[1.7]">
                {t("map.address1")}
                <br />
                {t("map.address2")}
              </span>
            </address>
            <p className="font-mono text-[12px] text-[var(--fg-muted)] m-0 self-end" dir="ltr">
              {t("map.coords")}
            </p>
          </Reveal>

          {/*
            Map container — explicit responsive heights prevent the
            aspect-ratio + min-height overflow bug (21/8 × 320px = 840px fixed width).
            Width is always 100% of the container; height steps per breakpoint.
          */}
          <Reveal className="rounded-[14px] overflow-hidden w-full h-[220px] sm:h-[300px] min-[900px]:h-[380px] lg:h-[460px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1025.989722789409!2d31.366910793579645!3d30.12268987740197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145817944d3f2abf%3A0x214b2421b83f9fba!2sEquinox%20International!5e0!3m2!1sen!2seg!4v1779205141180!5m2!1sen!2seg"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("map.hq")}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function ContactBlock({
  heading,
  first,
  children,
}: {
  heading: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={first ? "" : "border-t border-[var(--line)] pt-[20px]"}>
      <h4 className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)] mb-[12px]">
        {heading}
      </h4>
      <div className="text-[16px] text-[var(--fg)] [&_a:hover]:text-[var(--color-gold-700)]">
        {children}
      </div>
    </div>
  );
}
