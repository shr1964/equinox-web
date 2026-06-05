import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { PrimaryCTAButton } from "@/components/ui/PrimaryCTAButton";
import { siteMetadata } from "@/lib/seo/metadata";

interface LegalRow {
  k: string;
  v: string;
  mono?: boolean;
  tel?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return siteMetadata({
    locale,
    path: "/company",
    titleKey: "company.title",
    descriptionKey: "company.description",
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "companyPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const legalRows = t.raw("legal.rows") as LegalRow[];

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
        image="ship-aerial.jpg"
      >
        <div className="mt-[36px] flex gap-[12px] flex-wrap">
          <PrimaryCTAButton>{t("head.ctaPrimary")}</PrimaryCTAButton>
          <Button href="/contact" variant="ghost">
            {t("head.ctaSecondary")}
          </Button>
        </div>
      </PageHead>

      {/* Legal & Corporate Identity */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={t("legal.eyebrow")}
            title={t("legal.title")}
            intro={t("legal.lede")}
          />
          <Reveal className="rounded-[14px] bg-[var(--card)] border border-[var(--line)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <tbody>
                  {legalRows.map((r) => (
                    <tr key={r.k}>
                      <th className="text-start py-[22px] px-[20px] border-b border-[var(--line)] font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)] w-[280px] align-top">
                        {r.k}
                      </th>
                      <td className="text-start py-[22px] px-[20px] border-b border-[var(--line)] text-[15px]">
                        {r.tel ? (
                          <a href={`tel:${r.tel}`} dir="ltr" className="border-b border-[var(--line)] pb-[2px]">
                            {r.v}
                          </a>
                        ) : r.mono ? (
                          <span className="font-mono">{r.v}</span>
                        ) : (
                          <strong>{r.v}</strong>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
