import MarkSvg from "./mark.svg?react";

/**
 * Brand logo — the receipt glyph (from mark.svg, the single source shared with
 * the extension's rasterized icons) followed by the "substantiate" wordmark with
 * a terracotta full stop. `compact` renders the glyph alone (extension Help
 * header). The glyph is always terracotta (baked into mark.svg for rasterization).
 */
export function Logo({
  compact = false,
  size = 26,
  className = "",
}: {
  compact?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-[11px] ${className}`}>
      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center">
        <MarkSvg width={size} height={size} aria-hidden="true" />
      </span>
      {!compact && (
        <span className="font-sans text-[15.5px] font-extrabold tracking-[-0.03em] text-ink">
          substantiate<span className="text-terra">.</span>
        </span>
      )}
    </div>
  );
}
