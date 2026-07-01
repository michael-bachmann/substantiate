import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** `accent` = terra-d (e.g. "NEW BATCH"); `muted` = ink3 (e.g. "Retailer"). */
  tone?: "accent" | "muted";
  /** Font size in px — the design only ever uses 10 or 11. Default 10. */
  size?: 10 | 11;
  className?: string;
}

/** The mono uppercase, tracked section label used throughout the design. */
export function Eyebrow({ children, tone = "muted", size = 10, className = "" }: EyebrowProps) {
  return (
    <div
      className={`font-mono ${size === 11 ? "text-[11px]" : "text-[10px]"} font-medium uppercase tracking-[0.16em] ${
        tone === "accent" ? "text-terra-d" : "text-ink3"
      } ${className}`}
    >
      {children}
    </div>
  );
}
