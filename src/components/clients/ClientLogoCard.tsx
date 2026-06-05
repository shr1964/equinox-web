import Image from "next/image";

interface Props {
  logo: string;
  name: string;
}

export function ClientLogoCard({ logo, name }: Props) {
  return (
    <div className="group shrink-0 flex flex-col items-center gap-[12px] px-[12px] py-[20px]">
      <div className="relative h-[72px] w-[160px] sm:h-[96px] sm:w-[200px] flex items-center justify-center">
        {logo ? (
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain grayscale opacity-40 transition-all duration-[350ms] group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <span className="text-[14px] font-semibold text-[var(--fg-muted)] text-center leading-tight">
            {name}
          </span>
        )}
      </div>
      <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-[var(--fg-muted)] transition-colors duration-[350ms] group-hover:text-[var(--fg)] whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}
