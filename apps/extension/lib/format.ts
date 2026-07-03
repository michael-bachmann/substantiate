import { format } from "date-fns";

/** Money as the design writes it: always two decimals, leading "$". */
export function money(n: number): string {
  return "$" + n.toFixed(2);
}

/** A single date the way the prototype's `fmtDate` renders it: "Jun 25, 2026". */
export function fmtDate(d: Date): string {
  return format(d, "MMM d, yyyy");
}

/**
 * A period label for a custom range, collapsing a shared year onto the end
 * (mirrors the prototype's `rangeShort`):
 *   same year → "Jun 25 – Jul 2, 2026"
 *   spanning  → "Jun 25, 2025 – Jul 2, 2026"
 */
export function rangeShort(from: Date, to: Date): string {
  if (from.getFullYear() === to.getFullYear()) {
    return `${format(from, "MMM d")} – ${fmtDate(to)}`;
  }
  return `${fmtDate(from)} – ${fmtDate(to)}`;
}
