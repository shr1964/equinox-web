"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

export function Hero() {
  const t = useTranslations("home.hero");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  // Prototype: heroBg translates by scrollY * 0.18, then scale(1.06).
  const y = useTransform(scrollY, (s) => (reduce ? 0 : s * 0.18));

  return (
    <section
      ref={ref}
      className="relative min-h-screen text-white overflow-hidden bg-[var(--color-navy-900)]"
    >
      <motion.div
        style={{ y, scale: 1.06, willChange: "transform" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/img/port-night.jpg"
          alt="Container port at night"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10, 20, 55, 0.36) 0%, rgba(6, 12, 36, 0.62) 100%), linear-gradient(90deg, rgba(6, 10, 28, 0.45) 0%, rgba(6, 10, 28, 0.05) 65%)",
        }}
      />

      <Container className="relative z-[2] min-h-screen flex flex-col pt-[clamp(120px,18vh,200px)] pb-[clamp(60px,10vh,100px)]">
        <Reveal className="flex-1 flex flex-col justify-center">
          {/* <Eyebrow withShadow className="mb-[28px]">
            {t("eyebrow")}
          </Eyebrow> */}
          <h1
            className="font-display font-normal tracking-[-0.025em] leading-[0.96] max-w-[16ch] text-[clamp(48px,7.2vw,110px)] m-0"
            style={{ textShadow: "0 4px 24px rgba(0, 0, 0, 0.35)" }}
          >
            <span className="text-white">{t("title1")}</span>
            <br />
            <strong className="font-bold text-white">{t("title2")}</strong>
          </h1>
          <p
            className="mt-[28px] max-w-[56ch] text-[clamp(16px,1.2vw,18px)] leading-[1.6] text-white/[0.88] m-0"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)" }}
          >
            {t("sub")}
          </p>
          <div className="mt-[44px] flex flex-wrap gap-[14px]">
            <Button href="/contact" variant="primary" withArrow>
              {t("ctaPrimary")}
            </Button>
            <Button href="/services" variant="ghost">
              {t("ctaSecondary")}
            </Button>
          </div>
        </Reveal>

        <Reveal
          delay={0.16}
          className="grid grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-[32px] mt-[clamp(60px,8vh,100px)] pt-[32px] border-t border-white/[0.12]"
        >
          <HeroStat
            value={
              <CountUp to={Number(t("stats.yearsValue"))} className="inline-block" />
            }
            suffix="+"
            label={t("stats.yearsLabel")}
          />
          <HeroStat
            value={
              <CountUp to={Number(t("stats.clientsValue"))} className="inline-block" />
            }
            suffix="+"
            label={t("stats.clientsLabel")}
          />
          <HeroStat value={t("stats.marketsValue")} label={t("stats.marketsLabel")} />
          <HeroStat value={t("stats.coverageValue")} label={t("stats.coverageLabel")} />
        </Reveal>
      </Container>
    </section>
  );
}

function HeroStat({
  value,
  suffix,
  label,
}: {
  value: React.ReactNode;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <div className="font-display font-medium leading-none tracking-[-0.02em] text-[clamp(36px,4.4vw,56px)] text-white">
        {value}
        {suffix ? (
          <sup className="text-[0.5em] font-medium text-[var(--color-gold-500)] align-super ms-[2px]">
            {suffix}
          </sup>
        ) : null}
      </div>
      <div className="font-mono uppercase text-[11px] tracking-[0.22em] mt-[12px] text-white/[0.5]">
        {label}
      </div>
    </div>
  );
}
