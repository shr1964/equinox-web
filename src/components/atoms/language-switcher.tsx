"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { Globe } from "lucide-react";

const NEXT: Record<Locale, Locale> = { en: "ar", ar: "en" };
const LABELS: Record<Locale, string> = { en: "EN", ar: "ع" };

export function LanguageSwitcher({ className }: { className?: string }) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const next = NEXT[active];

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${next === "ar" ? "Arabic" : "English"}`}
      style={{ color: "white" }}
      className={cn(
        "inline-flex items-center gap-[6px] rounded-full border border-white/[0.12]",
        "px-[12px] py-[6px] text-[11px] font-mono uppercase tracking-[0.22em]",
        "transition-colors hover:text-[var(--color-gold-400)] hover:border-white/25",
        className,
      )}
    >
      <Globe size={13} strokeWidth={1.5} className="shrink-0" />
      {LABELS[active]}
    </button>
  );
}
