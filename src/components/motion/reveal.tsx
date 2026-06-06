"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { revealVariants, revealViewport, staggerParent } from "@/lib/motion/variants";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type RevealProps = Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> & {
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "ul";
};

/**
 * Drop-in wrapper for the prototype's `.reveal` class:
 * fades + translateY 24→0 on first viewport entry. Honours
 * prefers-reduced-motion (renders without motion variants).
 */
export function Reveal({
  delay = 0,
  as = "div",
  children,
  ...rest
}: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduce) {
    return <Component {...rest}>{children}</Component>;
  }

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={revealVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Parent that orchestrates stagger for its <Reveal /> children — used by
 * service tile grids, testimonials, etc. Matches the prototype's
 * data-delay="1|2|3" cascade (0.08s steps).
 */
export function Stagger({
  as = "div",
  children,
  ...rest
}: Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "viewport"> & {
  as?: "div" | "section" | "ul";
}) {
  const reduce = usePrefersReducedMotion();
  const Component = motion[as] as typeof motion.div;

  if (reduce) {
    return <Component {...rest}>{children}</Component>;
  }

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={staggerParent}
      {...rest}
    >
      {children}
    </Component>
  );
}
