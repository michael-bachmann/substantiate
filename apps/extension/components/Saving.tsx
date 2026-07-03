import { Button, ReceiptCard, ReceiptRow } from "@substantiate/ui";

export interface SavingProps {
  /** Period being scanned, e.g. "2026" or "Jun 25 – Jul 2, 2026". */
  periodShort: string;
  /** Progress readout, e.g. "48 / ~120". */
  checkedLabel: string;
  /** Progress bar fill, 0–100. */
  progressPct: number;
  /** How many receipts have been found so far. */
  foundCount: number;
  /** Found receipts (date + amount) revealed so far. */
  rows: { date: string; amount: string }[];
  /** Running total of the found receipts. */
  subtotalStr: string;
  /** The order id currently being read. */
  currentOrderId: string;
  onCancel: () => void;
}

/**
 * Saving view — a live "receipt tape" that fills as the scan finds eligible
 * orders. A pulsing status line + progress bar pin the top, the row list
 * scrolls, and a running subtotal + Cancel pin the bottom.
 */
export function Saving({
  periodShort,
  checkedLabel,
  progressPct,
  foundCount,
  rows,
  subtotalStr,
  currentOrderId,
  onCancel,
}: SavingProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-[18px] pb-4">
      {/* Status line */}
      <div className="mb-[10px] flex flex-shrink-0 items-center gap-2">
        <span className="h-[7px] w-[7px] flex-none animate-pulse-dot rounded-full bg-terra" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-terra-d">
          Scanning {periodShort}
        </span>
        <span className="ml-auto font-mono text-[11px] text-ink2">{checkedLabel}</span>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] flex-shrink-0 overflow-hidden rounded-[9px] bg-terra-t">
        <div
          className="h-full bg-terra transition-[width] duration-[120ms] ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Receipt tape */}
      <ReceiptCard variant="tape" className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="flex-shrink-0 text-center font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink3">
          {foundCount} eligible · found so far
        </div>
        <div className="mt-3 mb-1 flex-shrink-0 border-t border-dashed border-dash" />

        <div className="min-h-0 flex-1 overflow-auto">
          {rows.map((row) => (
            <ReceiptRow key={row.date} left={row.date} right={row.amount} />
          ))}
          <div className="pt-1 font-mono text-[10.5px] text-ink3">
            reading order {currentOrderId}
            <span className="animate-blink text-terra">▌</span>
          </div>
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
        Each receipt downloads as it&rsquo;s found &mdash; keep this tab open.
      </div>
      <div className="mt-3 flex-shrink-0">
        <Button variant="secondary" block sm onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
