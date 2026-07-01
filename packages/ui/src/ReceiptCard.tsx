import type { ReactNode } from "react";

interface ReceiptCardProps {
  /** `raised` = hero/Done surface (shadow); `tape` = dashed inner card. */
  variant?: "raised" | "tape";
  /** Padding / size overrides. */
  className?: string;
  children: ReactNode;
}

// `raised` is `relative` so a Stamp can be absolutely positioned inside.
const VARIANTS = {
  raised:
    "relative bg-paper2 border border-rule rounded-card shadow-panel p-[22px]",
  tape: "bg-paper2 border border-dashed border-dash rounded-[11px] p-[15px]",
};

/** The paper2 receipt surface — a thin wrapper over the two card variants. */
export function ReceiptCard({
  variant = "raised",
  className = "",
  children,
}: ReceiptCardProps) {
  return <div className={`${VARIANTS[variant]} ${className}`}>{children}</div>;
}
