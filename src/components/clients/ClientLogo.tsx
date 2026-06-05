import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  scale?: number;
}

export function ClientLogo({ src, alt, scale = 1 }: Props) {
  return (
    <div className="flex items-center justify-center h-[88px] w-full rounded-[10px] bg-[var(--bg-alt)] px-[28px] overflow-hidden">
      {src ? (
        <div
          className="relative w-full h-[52px]"
          style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 720px) calc(100vw - 48px), (max-width: 1100px) calc(50vw - 88px), calc(33vw - 120px)"
          />
        </div>
      ) : (
        <span className="text-[12px] font-mono tracking-[0.12em] uppercase text-[var(--fg-muted)]">
          {alt}
        </span>
      )}
    </div>
  );
}
