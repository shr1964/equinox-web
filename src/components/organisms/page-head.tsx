import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";

interface PageHeadProps {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  image: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

/**
 * Interior-page hero (the prototype's `.pagehead`): dark navy background
 * with photographic image + layered overlays, breadcrumbs in mono caps,
 * gold eyebrow, large display title (max 18ch), white-on-photo sub text.
 */
export async function PageHead({
  crumbs,
  eyebrow,
  title,
  sub,
  image,
  imageAlt = "",
  children,
}: PageHeadProps) {
  const locale = await getLocale();
  const ldItems = crumbs.map((c) => ({
    label: c.label,
    path: c.href ?? "",
  }));

  return (
    <section className="bg-[var(--color-navy-900)] text-white relative overflow-hidden pt-[clamp(140px,22vh,240px)] pb-[clamp(80px,12vh,140px)]">
      <JsonLd data={breadcrumbSchema(locale, ldItems)} />
      <div className="absolute inset-0 z-0">
        <Image
          src={image.startsWith("http") ? image : `/img/${image}`}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,20,55,0.42) 0%, rgba(6,10,28,0.78) 100%), linear-gradient(90deg, rgba(6,10,28,0.5) 0%, rgba(6,10,28,0.1) 70%)",
          }}
        />
      </div>
      <Container className="relative z-[1]">
        <Reveal>
        
          {/* <Eyebrow withShadow className="mb-[24px]">
            {eyebrow}
          </Eyebrow> */}
          <h1
            className="font-display font-normal max-w-[18ch] text-[clamp(44px,6vw,84px)] leading-none tracking-[-0.025em] text-white m-0"
            style={{ textShadow: "0 4px 24px rgba(0, 0, 0, 0.4)" }}
          >
            {title}
          </h1>
          {sub ? (
            <p
              className="mt-[28px] max-w-[60ch] text-white/[0.88] text-[clamp(16px,1.2vw,18px)] leading-[1.6]"
              style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)" }}
            >
              {sub}
            </p>
          ) : null}
          {children}

          <nav
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/[0.7] mb-[32px]  mt-6 font-bold"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}
            aria-label="Breadcrumb"
          >
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.href ? (
                  <Link href={c.href as never} className="text-white/[0.85] hover:text-white ">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 ? (
                  <span className="mx-[12px] text-white/[0.4]">/</span>
                ) : null}
              </span>
            ))}
          </nav>
        </Reveal>
      </Container>
    </section>
  );
}
