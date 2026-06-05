import { ClientLogo } from "./ClientLogo";

interface Props {
  num: string;
  name: string;
  desc: string;
  tags: string[];
  logo?: string | null;
  logoScale?: number;
}

export function ClientCard({ num, name, desc, tags, logo, logoScale }: Props) {
  return (
    <article className="group rounded-[14px] overflow-hidden bg-[var(--card)] border border-[var(--line)] flex flex-col h-full transition-[border-color,transform,box-shadow] duration-[250ms] hover:border-[var(--color-navy-700)] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]">
      <div className="px-[24px] pt-[24px]">
        <ClientLogo src={logo ?? ""} alt={name} scale={logoScale} />
      </div>
      <div className="px-[32px] pt-[24px] pb-[32px] flex flex-col flex-1">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--fg-muted)]">
          {num}
        </div>
        <h3 className="mt-[16px] text-[clamp(20px,1.8vw,24px)] font-semibold tracking-[-0.01em] leading-[1.2]">
          {name}
        </h3>
        <p className="mt-[12px] text-[15px] leading-[1.55] text-[var(--fg-muted)]">{desc}</p>
        <div className="mt-auto pt-[24px] flex flex-wrap gap-[8px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center border border-[var(--line)] rounded-full px-[12px] py-[6px] text-[11px] text-[var(--fg-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
