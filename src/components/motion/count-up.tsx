"use client";

import {
  motion,
  useInView,
  useMotionValue,
  animate,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  /** Number of decimal places — matches prototype's data-decimals. */
  decimals?: number;
  /** Duration in seconds — prototype uses 1.6s. */
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 → `to` once the element scrolls into view.
 * Reproduces app.js's animated counter (ease-out cubic, 1600ms).
 *
 * Reduced-motion users see the final value immediately, but we initialise
 * `display` from the resolved-motion-preference value to avoid a cascading
 * setState from inside an effect.
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
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    reduce ? to.toFixed(decimals) : (0).toFixed(decimals),
  );

  useEffect(() => {
    if (reduce) return;
    const unsub = value.on("change", (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsub;
  }, [value, decimals, reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(value, to, {
      duration,
      // Ease-out cubic — equivalent to prototype's `1 - (1 - t)^3`.
      ease: [0.215, 0.61, 0.355, 1] satisfies Transition["ease"],
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, value]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
