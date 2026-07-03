import { Button, Eyebrow, ReceiptCard, ReceiptRow, Stamp } from "@substantiate/ui";

export interface DoneProps {
  /** Period that was scanned, e.g. "2026". */
  periodShort: string;
  /** Grand total of saved receipts. */
  subtotalStr: string;
  /** How many receipts were saved. */
  foundCount: number;
  /** The first three saved files (filename + amount). */
  rowsTop: { name: string; amount: string }[];
  /** Whether there are more than the three shown. */
  hasMore: boolean;
  /** How many beyond the three shown. */
  moreCount: number;
  onReset: () => void;
  onShowInFolder: () => void;
}

/**
 * Done view — the scan's receipt: a stamped total, the top saved files, a
 * "what's next" note, and the footer actions (reveal / save another year).
 */
export function Done({
  periodShort,
  subtotalStr,
  foundCount,
  rowsTop,
  hasMore,
  moreCount,
  onReset,
  onShowInFolder,
}: DoneProps) {
  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-4">
      <Stamp label="SAVED" className="absolute top-[30px] right-[14px] opacity-[0.88]" />

      <Eyebrow tone="accent">Complete · {periodShort}</Eyebrow>
      <div className="mt-2 font-serif text-[46px] font-medium leading-none">{subtotalStr}</div>
      <div className="mt-[6px] font-mono text-[11px] text-ink2">
        {foundCount} receipts saved to Downloads
      </div>

      <ReceiptCard variant="tape" className="mt-[18px]">
        {rowsTop.map((row) => (
          <ReceiptRow
            key={row.name}
            left={row.name}
            right={row.amount}
            truncate
          />
        ))}
        {hasMore && (
          <div className="pt-1 pl-[17px] font-mono text-[10px] text-ink3">
            + {moreCount} more receipts
          </div>
        )}
        <div className="mt-[11px] border-t border-dashed border-dash" />
        <div className="flex items-baseline justify-between pt-[10px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">Total</span>
          <span className="font-serif text-[22px] leading-none">{subtotalStr}</span>
        </div>
      </ReceiptCard>

      <div className="mt-[14px] flex items-start gap-[9px] border-y border-dashed border-dash px-[2px] py-3">
        <span className="mt-[2px] flex-none font-mono text-[9.5px] font-medium tracking-[0.1em] text-terra">
          NEXT
        </span>
        <span className="text-[12px] leading-[1.5] text-ink2">
          Upload these to your portal (Fidelity, HealthEquity&hellip;). substantiate never files
          claims for you.
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-[9px] pt-4">
        <Button variant="primary" block icon="folder" onClick={onShowInFolder}>
          Show in folder
        </Button>
        <Button variant="secondary" block onClick={onReset}>
          Save another year
        </Button>
      </div>
    </div>
  );
}
