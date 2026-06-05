import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ArrowIcon } from "./arrow-icon";

interface LinkArrowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Underlined "Read more →" link with NE arrow. On hover the gap between
 * label and arrow widens from 8px to 12px and the bottom-border appears
 * (matches `.linkarrow` in the prototype).
 */
export function LinkArrow({ href, children, className }: LinkArrowProps) {
  const isInternal = href.startsWith("/");
  const classes = cn(
    "group inline-flex items-center gap-[8px] text-[14px] font-medium",
    "border-b border-b-transparent pb-[4px] transition-all duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
    "hover:border-b-current hover:gap-[12px]",
    "text-[var(--fg)]",
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      <ArrowIcon size={12} className="rtl:-scale-x-100" />
    </>
  );

  if (isInternal) {
    return (
      <Link href={href as never} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}
