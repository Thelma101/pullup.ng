type PullUpLogoProps = {
  variant?: "full" | "mark";
  inverted?: boolean;
  className?: string;
};

/**
 * PullUp brand lockup.
 * Abstract P: navy stem + teal rising “pull” curve.
 */
export function PullUpLogo({ variant = "full", inverted = false, className = "" }: PullUpLogoProps) {
  const ink = inverted ? "#F4F7F8" : "#0B1C2C";
  const stem = inverted ? "#F4F7F8" : "#0B1C2C";
  const accent = "#0D9488";

  const mark = (
    <svg
      width="36"
      height="36"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      {/* Navy stem */}
      <rect x="16" y="8" width="14" height="48" rx="7" fill={stem} />
      {/* Teal pull — overlaps stem, forms the P bowl + rise */}
      <path
        d="M23 52c12.5-2 24-12.5 24-27.5C47 14.5 38.5 8 28 8h-1v10c6.5.5 12 5.5 12 13.5 0 9-7 15.5-16 17.5V52z"
        fill={accent}
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <span className={`inline-flex items-center ${className}`} aria-label="PullUp">
        {mark}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="PullUp">
      {mark}
      <span className="font-display text-[1.35rem] font-bold tracking-tight" style={{ color: ink }}>
        PullUp
        <span style={{ color: accent }}>.NG</span>
      </span>
    </span>
  );
}
