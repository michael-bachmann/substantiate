import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** `accent` = terra-d (e.g. "NEW BATCH"); `muted` = ink3 (e.g. "Retailer"). */
  tone?: "accent" | "muted";
  /** Size varies 10–11px — default 10px, allow override. */
  className?: string;
}

/** The mono uppercase, tracked section label used throughout the design. */
export function Eyebrow({ children, tone = "muted", className = "" }: EyebrowProps) {
  return (
    <div
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.16em] ${
        tone === "accent" ? "text-terra-d" : "text-ink3"
      } ${className}`}
    >
      {children}
    </div>
  );
}
