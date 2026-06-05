"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image, { type ImageProps } from "next/image";
import { useRef } from "react";

type ParallaxImageProps = Omit<ImageProps, "ref"> & {
  /**
   * Strength of the parallax effect. Prototype hero uses 0.18 (translate3d
   * by scrollY * 0.18). Values 0.1–0.3 feel right for hero images.
   */
  strength?: number;
  className?: string;
};

/**
 * Hero background image with vertical parallax tied to page scroll.
 * Reproduces the prototype's `heroBg.style.transform = translate3d(0, y*0.18, 0) scale(1.06)`.
 */
export function ParallaxImage({
  strength = 0.18,
  className,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  // Translate the image by scrollY * strength, capped at a reasonable range
  // so it doesn't keep drifting forever on long pages.
  const y = useTransform(scrollY, (s) => (reduce ? 0 : s * strength));

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, scale: 1.06, willChange: "transform" }}
    >
      <Image alt={alt} {...imageProps} />
    </motion.div>
  );
}
