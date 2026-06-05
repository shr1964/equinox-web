import type { Variants, Transition } from "framer-motion";

/** Eased curve from the prototype (--ease-out: cubic-bezier(.2,.7,.2,1)). */
export const easeOutSoft: Transition["ease"] = [0.2, 0.7, 0.2, 1];

/** Section reveal — opacity 0→1, y 24→0, 0.9s. Matches .reveal in styles.css. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutSoft },
  },
};

/** Same reveal but for parents that orchestrate stagger. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0 },
  },
};

/** Child of staggerParent — translateY with reveal feel. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutSoft },
  },
};

/**
 * IntersectionObserver settings used by the prototype:
 * threshold: 0.12, rootMargin: '0px 0px -40px'.
 * Framer expects margin as a single string.
 */
export const revealViewport = {
  once: true,
  amount: 0.12 as const,
  margin: "0px 0px -40px",
};
