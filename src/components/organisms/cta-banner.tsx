import Image from "next/image";
import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";

interface CtaBannerProps {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
}

/**
 * Full-width banner with photographic background, dark gradient overlay,
 * eyebrow + display heading + sub + two CTAs (primary gold pill + ghost).
 * Used on every page bottom in the prototype.
 */
export function CtaBanner({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  image = "port-sunrise.jpg",
  imageAlt = "",
}: CtaBannerProps) {
  return (
    <section className="py-[var(--section-y-tight)]">
      <Container>
        <Reveal className="relative rounded-[14px] overflow-hidden text-white bg-[var(--color-navy-900)] min-h-[480px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={`/img/${image}`}
              alt={imageAlt}
              fill
              sizes="(max-width: 1320px) 100vw, 1320px"
              className="object-cover opacity-70"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,10,28,0.85) 0%, rgba(6,10,28,0.5) 60%, rgba(6,10,28,0.3) 100%), linear-gradient(180deg, rgba(10,20,55,0.2), rgba(6,10,28,0.4))",
              }}
            />
          </div>
          <div className="relative z-[1] p-[clamp(56px,8vw,100px)] w-full">
            <div className="flex flex-wrap justify-between items-end gap-[32px] sm:gap-[48px]">
              <div>
                {/* <Eyebrow withShadow className="mb-[24px]">
                  {eyebrow}
                </Eyebrow> */}
                <h2
                  className="font-display font-medium tracking-[-0.025em] leading-none text-[clamp(36px,5vw,64px)] max-w-[18ch] m-0"
                  style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                >
                  {title}
                </h2>
                {sub ? (
                  <p
                    className="mt-[20px] text-white/[0.88] text-[16px] max-w-[48ch] leading-[1.6] m-0"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                  >
                    {sub}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-[12px] flex-wrap">
                <Button href={primary.href} variant="primary" withArrow>
                  {primary.label}
                </Button>
                {secondary ? (
                  <Button href={secondary.href} variant="ghost">
                    {secondary.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
