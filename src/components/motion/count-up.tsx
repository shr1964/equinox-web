"use client";

import {
  motion,
  useInView,
  useMotionValue,
  animate,
  type Transition,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface CountUpProps {
  to: number;
  /** Number of decimal places — matches prototype's data-decimals. */
  decimals?: number;
  /** Duration in seconds — prototype uses 1.6s. */
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 → `to` once the element scrolls into view (ease-out cubic, 1.6s).
 *
 * Reduced-motion users see the final value immediately. The displayed value is
 * derived during render — never set from an effect for the reduced case — so the
 * component is hydration-safe and free of cascading effect renders.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const value = useMotionValue(0);
  const reduce = usePrefersReducedMotion();
  // Animated readout. Starts at "0" so SSR and the client's first render agree.
  const [animated, setAnimated] = useState(() => (0).toFixed(decimals));

  useEffect(() => {
    const unsubscribe = value.on("change", (v) =>
      setAnimated(v.toFixed(decimals)),
    );
    return unsubscribe;
  }, [value, decimals]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(value, to, {
      duration,
      // Ease-out cubic — equivalent to prototype's `1 - (1 - t)^3`.
      ease: [0.215, 0.61, 0.355, 1] satisfies Transition["ease"],
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, value]);

  // Reduced-motion users get the final value directly; everyone else sees the
  // animated readout tick up.
  const display = reduce ? to.toFixed(decimals) : animated;

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
