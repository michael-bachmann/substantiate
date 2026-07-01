import { CheckIcon } from "./icons";

interface StampProps {
  /** Stamp text (uppercase, tracked). */
  label?: string;
  /** Rotation in degrees (cards use ~-8, ContactForm uses -7). */
  rotate?: number;
  /** Opacity / positioning overrides — positioning is the consumer's job. */
  className?: string;
}

/**
 * The rotated rubber stamp (SAVED / SENT): a terracotta bordered pill with a
 * double outline, tilted a few degrees. Presentational inline element — the
 * consumer positions it (absolute inside a ReceiptCard, or in flow).
 */
export function Stamp({ label = "SAVED", rotate = -8, className = "" }: StampProps) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex items-center gap-[6px] rounded-[7px] border-2 border-terra px-[10px] pt-[5px] pb-[4px] text-terra outline outline-[1.5px] outline-terra outline-offset-[2.5px] ${className}`}
    >
      <CheckIcon size={13} strokeWidth={3} />
      <span className="font-mono text-[12px] font-medium tracking-[0.18em]">
        {label}
      </span>
    </span>
  );
}
