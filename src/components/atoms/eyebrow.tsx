import { cn } from "@/lib/utils/cn";

interface EyebrowProps {
  children: React.ReactNode;
  /** Quiet variant uses muted-ink colour instead of brand gold. */
  quiet?: boolean;
  /** Forces light colours regardless of theme — used over dark imagery. */
  onDark?: boolean;
  /** Apply a text shadow for legibility on photographic backgrounds. */
  withShadow?: boolean;
  as?: "div" | "span" | "p";
  className?: string;
}

/**
 * Mono-cap label preceded by a colored bullet. The prototype uses these on
 * every section header (`.eyebrow`, `.eyebrow--quiet`). Matches the original
 * dimensions: 12px, 0.22em tracking, uppercase, 6px bullet, 10px gap.
 */
export function Eyebrow({
  children,
  quiet = false,
  onDark = false,
  withShadow = false,
  as: Tag = "div",
  className,
}: EyebrowProps) {
  const dotColor = quiet
    ? onDark
      ? "before:bg-white/[0.5]"
      : "before:bg-[var(--fg-muted)]"
    : "before:bg-[var(--color-gold-500)]";

  const textColor = quiet
    ? onDark
      ? "text-white/[0.5]"
      : "text-[var(--fg-muted)]"
    : "text-[var(--color-gold-500)]";

  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-[10px] font-mono font-medium text-[12px] tracking-[0.22em] uppercase",
        "before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:inline-block",
        dotColor,
        textColor,
        withShadow && "[text-shadow:0_2px_10px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
