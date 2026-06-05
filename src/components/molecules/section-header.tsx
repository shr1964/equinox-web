import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  trailing?: React.ReactNode;
  quiet?: boolean;
  onDark?: boolean;
  className?: string;
}

/**
 * Two-column section header (the prototype's `.shead`): heading on the left,
 * lede + optional CTA on the right. Collapses to a single column under 1100px.
 */
export function SectionHeader({
  title,
  intro,
  trailing,
  onDark = false,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[64px] items-end",
        "mb-[clamp(48px,6vw,80px)]",
        className,
      )}
    >
      <div>
        {/* <Eyebrow quiet={quiet} onDark={onDark} className="mb-[24px]">
          {eyebrow}
        </Eyebrow> */}
        <h2 className="font-display font-bold tracking-[-0.03em] text-[clamp(40px,4.8vw,64px)] leading-[1.0] m-0">
          {title}
        </h2>
      </div>
      {intro || trailing ? (
        <div>
          {intro ? (
            <p
              className={cn(
                "text-[clamp(17px,1.3vw,19px)] leading-[1.55] max-w-[60ch] m-0",
                onDark ? "text-white/[0.7]" : "text-[var(--fg-muted)]",
              )}
            >
              {intro}
            </p>
          ) : null}
          {trailing ? <div className="mt-[24px]">{trailing}</div> : null}
        </div>
      ) : null}
    </Reveal>
  );
}
