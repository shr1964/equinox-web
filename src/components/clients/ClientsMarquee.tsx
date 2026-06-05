"use client";

import { Container } from "@/components/atoms/container";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { ClientLogoCard } from "./ClientLogoCard";
import { CLIENT_LOGOS } from "@/data/clients";

interface Props {
  eyebrow: string;
  viewAllLabel: string;
  learnMoreLabel: string;
}

export function ClientsMarquee({ eyebrow, learnMoreLabel }: Props) {
  const track = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="py-[var(--section-y-tight)] overflow-hidden">


      {/* dir="ltr" forces LTR flex layout so translateX always moves left,
          regardless of the page's RTL context. The text marquee keeps its own
          eq-marquee-track class + CSS reversal; this track is intentionally
          decoupled from that rule. */}
      <div
        dir="ltr"
        className="group/marq relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          className="flex w-max group-hover/marq:[animation-play-state:paused]"
          style={{
            animation: "eq-marquee 28s linear infinite",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
          aria-hidden="true"
        >
          {track.map((client, i) => (
            <ClientLogoCard
              key={`${client.id}-${i}`}
              logo={client.logo}
              name={client.name}
            />
          ))}
        </div>
      </div>

      <Container>
        <Reveal className="mt-[48px] flex justify-center">
          <Button href="/clients" variant="primary" withArrow>
            {learnMoreLabel}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
