import { cn } from "@/lib/utils/cn";

/**
 * Max-width 1320px content container with the clamped horizontal padding
 * from the prototype (var(--pad-x) = clamp(24px, 4vw, 64px)).
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1320px]",
        "px-[var(--pad-x)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
