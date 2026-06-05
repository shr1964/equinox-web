import { cn } from "@/lib/utils/cn";

interface StatProps {
  /** Pre-formatted display value or any React node (e.g. <CountUp />). */
  value: React.ReactNode;
  label: React.ReactNode;
  /** Show a small superscript (typically "+") after the value. */
  suffix?: React.ReactNode;
  /** Render on a dark background — switches colours appropriately. */
  onDark?: boolean;
  className?: string;
}

/**
 * Single hero/page stat with a large display value, optional gold "+"
 * superscript, and a mono-cap label below. Used by the hero, the team page,
 * and the clients page. Maps to `.stat` / `.stat__value` / `.stat__label`.
 */
export function Stat({ value, label, suffix, onDark = false, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "font-display font-medium leading-none tracking-[-0.02em]",
          "text-[clamp(36px,4.4vw,56px)]",
          onDark ? "text-white" : "text-[var(--fg)]",
        )}
      >
        {value}
        {suffix ? (
          <sup className="text-[0.5em] font-medium text-[var(--color-gold-500)] align-super ms-[2px]">
            {suffix}
          </sup>
        ) : null}
      </div>
      <div
        className={cn(
          "font-mono uppercase text-[11px] tracking-[0.22em] mt-3",
          onDark ? "text-white/[0.5]" : "text-[var(--fg-muted)]",
        )}
      >
        {label}
      </div>
    </div>
  );
}
