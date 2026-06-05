import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/atoms/arrow-icon";

interface ServiceTileProps {
  num: string;
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  desc: string;
  ctaLabel: string;
}

export function ServiceTile({
  num,
  href,
  image,
  imageAlt,
  title,
  desc,
  ctaLabel,
}: ServiceTileProps) {
  return (
    <Link
      href={href as never}
      className="group relative isolate aspect-[4/5] rounded-[14px] overflow-hidden bg-[var(--color-navy-900)] text-white cursor-pointer block"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image.startsWith("http") ? image : `/img/${image}`}
          alt={imageAlt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,10,28,0.4) 0%, rgba(6,10,28,0.95) 90%)",
          }}
        />
      </div>
      <div className="absolute inset-0 z-[1] p-[28px] flex flex-col justify-between">
        <div className="font-mono text-[12px] tracking-[0.22em] text-white/[0.5]">
          {num} / Service
        </div>
        <div>
          <div className="text-[clamp(20px,2.5vw,26px)] font-semibold tracking-[-0.01em] leading-[1.15] mb-[12px] text-white line-clamp-2">
            {title}
          </div>
          <div className="text-[14px] text-white/[0.68] leading-[1.5] max-w-[32ch] line-clamp-3">
            {desc}
          </div>
          <div className="inline-flex items-center gap-[10px] mt-[18px] text-[13px] font-mono uppercase tracking-[0.22em] text-[var(--color-gold-500)]">
            <span>{ctaLabel}</span>
            <span className="inline-flex w-3 h-3 transition-transform duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px] rtl:group-hover:translate-x-0">
              <ArrowIcon size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
