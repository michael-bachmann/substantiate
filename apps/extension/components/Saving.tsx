import { Button, ReceiptCard, ReceiptRow } from "@substantiate/ui";
import type { SavedRow } from "@/lib/scan";

export interface SavingProps {
  /** Period being scanned, e.g. "2026" or "Jun 25 – Jul 2, 2026". */
  periodShort: string;
  /** `collecting` = paging the order list (count unknown); `exporting` = saving
   *  each eligible order in turn. */
  phase: "collecting" | "exporting";
  /** Current order in the export loop (exporting phase). */
  index: number;
  /** Total orders to export (exporting phase). */
  total: number;
  /** Found receipts (date + amount) saved so far. */
  rows: SavedRow[];
  /** Running total of the saved receipts. */
  subtotalStr: string;
  onCancel: () => void;
}

/**
 * Saving view — two phases. While `collecting`, a calm indeterminate state
 * ("Finding your orders…") since the order count isn't known yet. While
 * `exporting`, the live "receipt tape" fills as each eligible order is saved:
 * a determinate bar, streaming rows, and a running subtotal pinned to the
 * bottom. A pulsing status line + Cancel bookend both phases.
 */
export function Saving({
  periodShort,
  phase,
  index,
  total,
  rows,
  subtotalStr,
  onCancel,
}: SavingProps) {
  const collecting = phase === "collecting";
  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-[18px] pb-4">
      {/* Status line */}
      <div className="mb-[10px] flex flex-shrink-0 items-center gap-2">
        <span className="h-[7px] w-[7px] flex-none animate-pulse-dot rounded-full bg-terra" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-terra-d">
          {collecting ? `Scanning ${periodShort}` : "Saving receipts"}
        </span>
        {!collecting && (
          <span className="ml-auto font-mono text-[11px] text-ink2">
            {index} / {total}
          </span>
        )}
      </div>

      {/* Progress bar — indeterminate while collecting, determinate while exporting */}
      <div className="h-[3px] flex-shrink-0 overflow-hidden rounded-[9px] bg-terra-t">
        {collecting ? (
          <div className="h-full w-1/4 animate-indeterminate rounded-[9px] bg-terra" />
        ) : (
          <div
            className="h-full bg-terra transition-[width] duration-[120ms] ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        )}
      </div>

      {/* Receipt tape */}
      <ReceiptCard variant="tape" className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="flex-shrink-0 text-center font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink3">
          {collecting ? "reading order history" : `${rows.length} eligible · found so far`}
        </div>
        <div className="mt-3 mb-1 flex-shrink-0 border-t border-dashed border-dash" />

        <div className="min-h-0 flex-1 overflow-auto">
          {collecting ? (
            <div className="pt-1 font-mono text-[10.5px] text-ink3">
              Looking through your Amazon orders…
              <span className="animate-blink text-terra">▌</span>
            </div>
          ) : (
            rows.map((row, i) => (
              <ReceiptRow key={i} left={row.date} right={row.amount} />
            ))
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="mt-3 border-t border-dashed border-dash" />
          <div className="flex items-baseline justify-between pt-[11px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink2">
              Subtotal so far
            </span>
            <span className="font-serif text-[25px] leading-none">{subtotalStr}</span>
          </div>
        </div>
      </ReceiptCard>

      <div className="mt-[14px] flex-shrink-0 text-center text-[11.5px] leading-[1.5] text-ink3">
        Each receipt downloads as it&rsquo;s found &mdash; keep the Amazon tab open.
      </div>
      <div className="mt-3 flex-shrink-0">
        <Button variant="secondary" block sm onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
