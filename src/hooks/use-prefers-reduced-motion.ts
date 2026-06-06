import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe `prefers-reduced-motion` reader.
 *
 * Returns `false` on the server and during the client's first (hydration)
 * render, then the real preference afterwards. This keeps SSR markup and the
 * hydration pass in agreement: reading the media query eagerly during render
 * makes a reduced-motion client diverge from the server and throws a hydration
 * mismatch (both the counter's text and motion wrappers' inline styles).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}
