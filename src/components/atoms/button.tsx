"use client";

import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ArrowIcon } from "./arrow-icon";

type Variant = "primary" | "ghost" | "outline" | "dark";

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  /** Render the north-east arrow inside the pill (translates on hover). */
  withArrow?: boolean;
  className?: string;
}

type AsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type AsButton = CommonProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export type ButtonProps = AsLink | AsButton;

/**
 * The pill-shaped CTA used across the prototype (`.btn` + variants). On
 * hover, .btn--primary and .btn--dark lift -1px and the arrow translates
 * (+2px, -2px). RTL flips the arrow horizontally so the visual reading
 * direction stays consistent.
 */
const base =
  "inline-flex items-center gap-[12px] px-[22px] py-[14px] rounded-full text-[14px] font-semibold tracking-[0.01em] whitespace-nowrap transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] relative cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-gold-500)] text-[var(--color-on-accent)] hover:bg-[var(--color-gold-400)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-pill)]",
  ghost:
    "bg-white/[0.06] text-white border border-white/[0.16] hover:bg-white/[0.12]",
  outline:
    "bg-transparent border border-[var(--line)] text-[var(--fg)] hover:border-[var(--color-navy-700)] hover:text-[var(--color-navy-700)]",
  dark: "bg-[var(--color-navy-900)] text-white hover:bg-[var(--color-navy-700)] hover:-translate-y-[1px]",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { children, variant = "primary", withArrow, className } = props;
    const classes = cn(base, variants[variant], "group", className);
    // Inline style ensures primary button text colour is always driven by
    // the CSS variable, overriding any Tailwind utility specificity issues.
    const colorStyle = variant === "primary"
      ? { color: "var(--color-on-accent)" } as React.CSSProperties
      : undefined;

    const inner = (
      <>
        <span>{children}</span>
        {withArrow ? (
          <span className="inline-flex w-4 h-4 transition-transform duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[2px] rtl:group-hover:translate-x-0">
            <ArrowIcon />
          </span>
        ) : null}
      </>
    );

    if ("href" in props && props.href) {
      const isInternal = props.href.startsWith("/") || props.href.startsWith("#");
      if (isInternal && !props.href.startsWith("#")) {
        return (
          <Link
            href={props.href as never}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={classes}
            style={colorStyle}
          >
            {inner}
          </Link>
        );
      }
      return (
        <a
          href={props.href}
          target={props.target}
          rel={props.rel}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          style={colorStyle}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={props.type ?? "button"}
        onClick={props.onClick}
        disabled={props.disabled}
        className={classes}
        style={colorStyle}
      >
        {inner}
      </button>
    );
  },
);
