"use client";

import { useMessages } from "next-intl";

function Dot() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-[var(--color-gold-500)] shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

interface MarqueeProps {
  /** Service titles from Sanity. Falls back to i18n items when omitted. */
  items?: string[];
}

export function Marquee({ items: propItems }: MarqueeProps) {
  const messages = useMessages() as Record<string, unknown>;
  const i18nItems =
    (messages?.home as { marquee?: { items?: string[] } })?.marquee?.items ?? [];

  const items = propItems && propItems.length > 0 ? propItems : i18nItems;

  if (!items.length) return null;

  // Duplicate the list so the CSS keyframe (translate3d 0 → -50%) loops
  // seamlessly. Each item carries its own trailing gap as padding-right —
  // NOT as flex `gap` — so -50% of the total track width equals exactly
  // one full period and the loop seam is invisible.
  const doubled = [...items, ...items];

  return (
    <section
      aria-label="Services marquee"
      className="overflow-hidden border-y border-[var(--line)] py-[28px]"
    >
      {/* Animated track — hidden from assistive tech to avoid doubled content */}
      <div
        aria-hidden="true"
        className="eq-marquee-track flex whitespace-nowrap [animation:eq-marquee_20s_linear_infinite] will-change-transform"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[40px] pr-[80px] font-display font-medium tracking-[-0.02em] text-[clamp(32px,5vw,72px)] text-[var(--fg)]"
          >
            {item}
            <Dot />
          </span>
        ))}
      </div>

      {/* Static accessible list — rendered once, visible only to screen readers */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
