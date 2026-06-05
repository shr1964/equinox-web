import { cn } from "@/lib/utils/cn";

interface TagProps {
  children: React.ReactNode;
  /** Light variant — used in client cards on the clients page. */
  variant?: "on-dark" | "light";
  className?: string;
}

/**
 * Pill-shaped label used by the industries-split tag list and elsewhere.
 * Hover state switches the border + text to gold (matches `.tag:hover`).
 */
export function Tag({ children, variant = "on-dark", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-[18px] py-[10px] rounded-full text-[13px] transition-all duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
        variant === "on-dark"
          ? "border border-white/[0.18] text-white/[0.85] hover:border-[var(--color-gold-500)] hover:text-[var(--color-gold-500)]"
          : "border border-[var(--line)] text-[var(--fg-muted)] px-[12px] py-[6px] text-[11px]",
        className,
      )}
    >
      {children}
    </span>
  );
}
