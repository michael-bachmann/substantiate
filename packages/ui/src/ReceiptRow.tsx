import type { ReactNode } from "react";
import { CheckIcon } from "./icons";

interface ReceiptRowProps {
  /** Left label (filename / date). */
  left: ReactNode;
  /** Right value (amount), emphasized. */
  right: ReactNode;
  /** Clip an over-long left node (the Done view's filenames). */
  truncate?: boolean;
  /** Font-size varies slightly (10.5–11px) — allow override. */
  className?: string;
}

/**
 * A dotted-leader receipt row: `✓  left · · · · · right`. The check is
 * terracotta, the leader stretches to fill, the right value is inked.
 */
export function ReceiptRow({
  left,
  right,
  truncate = false,
  className = "",
}: ReceiptRowProps) {
  return (
    <div
      className={`flex items-baseline gap-[7px] py-[6px] font-mono text-[11px] text-ink2 ${className}`}
    >
      <CheckIcon size={11} strokeWidth={3} className="self-center text-terra" />
      <span
        className={
          truncate
            ? "max-w-[172px] overflow-hidden text-ellipsis whitespace-nowrap"
            : undefined
        }
      >
        {left}
      </span>
      <span className="flex-1 translate-y-[-3px] border-b border-dotted border-dash" />
      <span className="font-medium text-ink">{right}</span>
    </div>
  );
}
