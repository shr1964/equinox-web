"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useId } from "react";
import { cn } from "@/lib/utils/cn";

interface FaqItemProps {
  question: string;
  answer: string;
}

/**
 * Single accordion row. Plus-sign rotates to × via an X transform (via the
 * rotate of the vertical bar 0deg → 90deg). Matches `.faq__item` + `.is-open`
 * styling and the 0.35s ease-out height animation.
 */
export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-[var(--line)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex items-center justify-between w-full text-start py-[28px] text-[18px] font-medium tracking-[-0.01em] text-[var(--fg)]"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className="relative w-[28px] h-[28px] shrink-0 ms-[24px]"
        >
          <span className="absolute top-1/2 left-0 right-0 h-px bg-[var(--fg)] -translate-y-1/2" />
          <span
            className={cn(
              "absolute left-1/2 top-0 bottom-0 w-px bg-[var(--fg)] -translate-x-1/2 origin-center transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
              open ? "rotate-90" : "rotate-0",
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="text-[15px] leading-[1.6] text-[var(--fg-muted)] pe-[56px] pb-[28px] max-w-[70ch]">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
