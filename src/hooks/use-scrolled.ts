"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` pixels (default 30 to
 * match the prototype's nav scroll state).
 */
export function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
