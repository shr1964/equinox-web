import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/atoms/container";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/molecules/section-header";
import { PageHead } from "@/components/organisms/page-head";
import { PrimaryCTAButton } from "@/components/ui/PrimaryCTAButton";
import { JsonLd, companyOrganizationSchema } from "@/components/seo/json-ld";
import { siteMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity";
import { companyPageQuery, type CompanyPageData } from "@/lib/queries";

interface LegalRow {
  k: string;
  v: string;
  mono?: boolean;
  tel?: string;
}

/** Normalized shape the page renders, sourced from Sanity or the i18n JSON. */
interface CompanyContent {
  crumb: string;
  eyebrow: string;
  title1: string;
  title2: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  legalEyebrow: string;
  legalTitle: string;
  legalLede: string;
  rows: LegalRow[];
}

async function getCompany(locale: string): Promise<CompanyPageData | null> {
  const docs = await sanityFetch<CompanyPageData>({
    query: companyPageQuery,
    params: { locale },
    tags: ["companyPage"],
  });
  return docs[0] ?? null;
}

/** Merge Sanity data over the i18n JSON so the page renders even before seeding. */
async function getContent(locale: string): Promise<{
  content: CompanyContent;
  company: CompanyPageData | null;
}> {
  const t = await getTranslations({ locale, namespace: "companyPage" });
  const jsonRows = t.raw("legal.rows") as LegalRow[];
  const company = await getCompany(locale);

  const rows: LegalRow[] =
    company?.infoRows && company.infoRows.length > 0
      ? company.infoRows.map((r) => ({
          k: r.label,
          v: r.value,
          mono: r.format === "mono",
          tel: r.format === "tel" ? r.tel : undefined,
        }))
      : jsonRows;

  return {
    company,
    content: {
      crumb: company?.heroCrumb ?? t("head.crumb"),
      eyebrow: company?.heroEyebrow ?? t("head.eyebrow"),
      title1: company?.heroTitleLine1 ?? t("head.title1"),
      title2: company?.heroTitleLine2 ?? t("head.title2"),
      sub: company?.heroSub ?? t("head.sub"),
      ctaPrimary: company?.heroCtaPrimary ?? t("head.ctaPrimary"),
      ctaSecondary: company?.heroCtaSecondary ?? t("head.ctaSecondary"),
      heroImage: company?.heroImage || "ship-aerial.jpg",
      legalEyebrow: company?.sectionEyebrow ?? t("legal.eyebrow"),
      legalTitle: company?.title ?? t("legal.title"),
      legalLede: company?.description ?? t("legal.lede"),
      rows,
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const company = await getCompany(locale);
  return siteMetadata({
    locale,
    path: "/company",
    titleKey: "company.title",
    descriptionKey: "company.description",
    title: company?.metaTitle,
    description: company?.metaDescription,
    ogTitle: company?.ogTitle,
    ogDescription: company?.ogDescription,
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const nav = await getTranslations({ locale, namespace: "nav" });
  const { content, company } = await getContent(locale);
  const legalRows = content.rows;

  return (
    <>
      <JsonLd data={companyOrganizationSchema(locale, company)} />
      <PageHead
        crumbs={[
          { label: nav("home"), href: "/" },
          { label: content.crumb },
        ]}
        eyebrow={content.eyebrow}
        title={
          <>
            {content.title1}
            <br />
            {content.title2}
          </>
        }
        sub={content.sub}
        image={content.heroImage}
      >
        <div className="mt-[36px] flex gap-[12px] flex-wrap">
          <PrimaryCTAButton>{content.ctaPrimary}</PrimaryCTAButton>
          <Button href="/contact" variant="ghost">
            {content.ctaSecondary}
          </Button>
        </div>
      </PageHead>

      {/* Legal & Corporate Identity */}
      <section className="py-[var(--section-y)]">
        <Container>
          <SectionHeader
            eyebrow={content.legalEyebrow}
            title={content.legalTitle}
            intro={content.legalLede}
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
