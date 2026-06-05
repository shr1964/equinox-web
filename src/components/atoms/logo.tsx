import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: "default" | "lg";
  className?: string;
  ariaLabel?: string;
}

export function Logo({
  size = "default",
  className,
  ariaLabel = "Equinox International",
}: LogoProps) {
  const height = size === "lg" ? 82 : 68;
  const width = size === "lg" ? 205 : 170;

  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label={ariaLabel}
    >
      <Image
        src="/img/new-logo.png"
        alt="Equinox International"
        width={width}
        height={height}
        priority
      />
    </span>
  );
}
