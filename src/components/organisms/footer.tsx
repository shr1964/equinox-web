import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/atoms/container";
import { Logo } from "@/components/atoms/logo";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/clients", key: "clients" },
  { href: "/company", key: "company" },
  { href: "/contact", key: "contact" },
] as const;

const SERVICE_ANCHORS = [
  { hash: "ior", key: "ior" },
  { hash: "ddp", key: "ddp" },
  { hash: "freight", key: "freight" },
  { hash: "logistics", key: "logistics" },
  { hash: "compliance", key: "compliance" },
  { hash: "customs", key: "customs" },
  { hash: "warehousing", key: "warehousing" },
] as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[var(--color-navy-900)] text-white pt-[100px] pb-[40px]">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:1.4fr_1fr_1fr_1fr] gap-[40px] lg:gap-[56px] pb-[72px] border-b border-white/[0.1]">
          <div>
            <Logo />
            <p className="text-white/[0.7] text-[14px] leading-[1.6] mt-[24px] max-w-[32ch]">
              {t("about")}
            </p>
          </div>

          <FooterCol heading={t("headings.navigate")}>
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href as never} className="text-white/[0.75] hover:text-[var(--color-gold-500)] transition-colors duration-200">
                  {t(`navLinks.${link.key}`)}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol heading={t("headings.services")}>
            {SERVICE_ANCHORS.map((s) => (
              <li key={s.key}>
                <Link
                  href={`/services#${s.hash}` as never}
                  className="text-white/[0.75] hover:text-[var(--color-gold-500)] transition-colors duration-200"
                >
                  {t(`serviceLinks.${s.key}`)}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol heading={t("headings.contact")}>
            <li className="text-white/[0.75]">{t("contact.address1")}</li>
            <li className="text-white/[0.75]">{t("contact.address2")}</li>
            <li>
              <a href="tel:+20226210080" dir="ltr" className="text-white/[0.75] hover:text-[var(--color-gold-500)] transition-colors duration-200">
                {t("contact.phone")}
              </a>
            </li>
            <li>
              <a href="mailto:info@equinoxint.net" className="text-white/[0.75] hover:text-[var(--color-gold-500)] transition-colors duration-200">
                {t("contact.email")}
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-[16px] mt-[32px] text-[12px] text-white/[0.45] tracking-[0.02em]">
          <div>{t("copyright")}</div>
          <div className="flex gap-[24px]">
            <a href="#" className="text-white/[0.6] hover:text-white transition-colors">{t("legal.privacy")}</a>
            <a href="#" className="text-white/[0.6] hover:text-white transition-colors">{t("legal.terms")}</a>
            <a href="#" className="text-white/[0.6] hover:text-white transition-colors">{t("legal.compliance")}</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5 className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/[0.5] font-medium mt-0 mb-[22px]">
        {heading}
      </h5>
      <ul className="list-none p-0 m-0 flex flex-col gap-[12px] text-[14px]">
        {children}
      </ul>
    </div>
  );
}
