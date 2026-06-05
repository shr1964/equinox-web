import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";

const btnBase =
  "inline-flex items-center gap-[12px] px-[22px] py-[14px] rounded-full text-[14px] font-semibold tracking-[0.01em] transition-all duration-[250ms]";

export function NotFoundPage() {
  return (
    <section className="py-[var(--section-y)] flex items-center min-h-[70vh]">
      <Container>
        <div className="max-w-[520px]">
          <Eyebrow className="mb-[24px]">Error · 404</Eyebrow>
          <h1
            className="font-display font-extrabold tracking-tight leading-none text-[var(--color-gold-500)] m-0 mb-[4px]"
            style={{ fontSize: "clamp(80px, 14vw, 160px)" }}
          >
            404
          </h1>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.1] m-0 mb-[16px] text-[clamp(28px,3vw,40px)]">
            Page not found.
          </h2>
          <p className="text-[var(--fg-muted)] text-[17px] leading-[1.55] m-0 mb-[40px] max-w-[52ch]">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Head back home or open a conversation with our team.
          </p>
          <div className="flex flex-wrap gap-[12px]">
            <a
              href="/"
              className={`${btnBase} bg-[var(--color-gold-500)] text-[var(--color-on-accent)] hover:bg-[var(--color-gold-400)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-pill)]`}
            >
              Back to home
            </a>
            <a
              href="/contact"
              className={`${btnBase} bg-transparent border border-[var(--line)] text-[var(--fg)] hover:border-[var(--color-navy-700)] hover:text-[var(--color-navy-700)]`}
            >
              Contact us
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
