/**
 * The 16×16 north-east arrow used inside .btn__arrow and .linkarrow on
 * every CTA throughout the prototype.
 */
export function ArrowIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 13 13 3M6 3h7v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
