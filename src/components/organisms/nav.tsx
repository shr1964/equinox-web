"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/atoms/container";
import { Logo } from "@/components/atoms/logo";
import { Button } from "@/components/atoms/button";
import { LanguageSwitcher } from "@/components/atoms/language-switcher";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils/cn";
import type { NavService } from "@/lib/queries";

/**
 * Display-label overrides for the services dropdown.
 * Keyed by Sanity anchor slug. When a match is found the short label is shown
 * instead of the full Sanity title. Falls back to service.title when the
 * anchor is not listed here, so new services surface without code changes.
 */
const NAV_SERVICE_LABELS: Record<string, string> = {
  ior:         "IOR & EOR",
  ddp:         "DDP",
  freight:     "Freight Forwarding",
  logistics:   "Logistics & Supply Chain",
  compliance:  "Trade Compliance",
  customs:     "Customs Clearance",
  warehousing: "Warehousing",
};

/** Optional long-form tooltip shown on hover (title attribute). */
const NAV_SERVICE_TOOLTIPS: Record<string, string> = {
  ior: "Importer of Record & Exporter of Record",
};

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/clients", key: "clients" },
  { href: "/company", key: "company" },
] as const;

export function Nav({ services = [] }: { services?: NavService[] }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const scrolled = useScrolled(30);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const [navH, setNavH] = useState(72);

  // Keep navH in sync with actual header height so the mobile overlay aligns flush
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setNavH(el.offsetHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scrolled]);

  // Lock body scroll + bind escape while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close mobile services accordion when the mobile menu closes
  useEffect(() => {
    if (!open) setMobileServicesOpen(false);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const hasServices = services.length > 0;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
          "border-b border-white/[0.06] backdrop-blur-[20px] backdrop-saturate-150",
          scrolled
            ? "py-[12px] bg-[rgba(6,10,28,0.92)]"
            : "py-[18px] bg-[rgba(6,10,28,0.65)]",
        )}
      >
        <Container className="flex items-center justify-between gap-[32px]">
          <Link href="/" aria-label="Equinox International" className="shrink-0">
            <Logo />
          </Link>

          {/* color:white on nav so <a color:inherit> picks up white through the parent chain */}
          <nav className="hidden lg:flex" aria-label="Primary" style={{ color: "white" }}>
            <ul className="flex items-center gap-[32px] m-0 p-0 list-none">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  {link.key === "services" && hasServices ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <Link
                        href={link.href as never}
                        className={cn(
                          "inline-flex items-center gap-[4px] relative text-[14px] font-medium transition-colors duration-200",
                          isActive(link.href)
                            ? "text-[var(--color-gold-500)] after:content-[''] after:absolute after:inset-x-0 after:-bottom-[8px] after:h-px after:bg-[var(--color-gold-500)]"
                            : "hover:text-[var(--color-gold-400)]",
                        )}
                      >
                        {t(link.key)}
                        <motion.span
                          animate={{ rotate: dropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <ChevronDown size={13} strokeWidth={2.5} />
                        </motion.span>
                      </Link>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute top-[calc(100%+14px)] left-0 min-w-[220px] rounded-[10px] border border-white/[0.08] bg-[rgba(6,10,28,0.97)] backdrop-blur-[20px] py-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                          >
                            {services.map((service) => (
                              <Link
                                key={service.anchor}
                                href={`/services/${service.anchor}` as never}
                                onClick={() => setDropdownOpen(false)}
                                title={NAV_SERVICE_TOOLTIPS[service.anchor]}
                                className="block px-[16px] py-[10px] text-[13px] font-medium text-white/75 hover:text-[var(--color-gold-400)] hover:bg-white/[0.05] transition-colors duration-150"
                              >
                                {NAV_SERVICE_LABELS[service.anchor] ?? service.title}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href as never}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "relative text-[14px] font-medium transition-colors duration-200",
                        isActive(link.href)
                          ? "text-[var(--color-gold-500)] after:content-[''] after:absolute after:inset-x-0 after:-bottom-[8px] after:h-px after:bg-[var(--color-gold-500)]"
                          : "hover:text-[var(--color-gold-400)]",
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-[12px]">
            <LanguageSwitcher />
            <Button href="/contact" variant="primary" withArrow>
              {t("contact")}
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? tc("closeMenu") : tc("openMenu")}
            aria-expanded={open}
            aria-controls={menuId}
            className="lg:hidden inline-flex items-center justify-center w-[40px] h-[40px]"
            style={{ color: "white" }}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </Container>
      </header>

      {/* Mobile overlay is a sibling of <header>, not a child, so the header's
          backdrop-filter stacking context cannot interfere with the overlay's background. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-[49] overflow-y-auto"
            style={{ top: navH, backgroundColor: "rgba(6,10,28,0.98)", color: "white" }}
          >
            <Container className="flex flex-col min-h-full pt-[40px] pb-[40px] gap-[12px]">
              <ul className="flex flex-col gap-[8px] m-0 p-0 list-none">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    {link.key === "services" && hasServices ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((o) => !o)}
                          className="w-full flex items-center justify-between py-[14px] text-[22px] font-medium text-left"
                          style={{
                            color: isActive(link.href)
                              ? "var(--color-gold-500)"
                              : "white",
                          }}
                        >
                          <span>{t(link.key)}</span>
                          <motion.span
                            animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center"
                          >
                            <ChevronDown size={20} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden m-0 p-0 list-none border-l-2 border-[var(--color-gold-500)]/30 ml-[4px] pl-[16px] mb-[6px]"
                            >
                              {services.map((service) => (
                                <li key={service.anchor}>
                                  <Link
                                    href={`/services/${service.anchor}` as never}
                                    onClick={() => setOpen(false)}
                                    title={NAV_SERVICE_TOOLTIPS[service.anchor]}
                                    className="block py-[10px] text-[16px] font-medium text-white/65 hover:text-[var(--color-gold-400)] transition-colors duration-150"
                                  >
                                    {NAV_SERVICE_LABELS[service.anchor] ?? service.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href as never}
                        onClick={() => setOpen(false)}
                        className="block py-[14px] text-[22px] font-medium"
                        style={{
                          color: isActive(link.href)
                            ? "var(--color-gold-500)"
                            : "white",
                        }}
                      >
                        {t(link.key)}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-[16px]">
                <div className="flex items-center gap-[10px]">
                  <LanguageSwitcher />
                </div>
                <Button href="/contact" variant="primary" withArrow className="w-full justify-between">
                  {t("contact")}
                </Button>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
