import { Button, Eyebrow, ReceiptCard, ReceiptRow, Stamp, FileCheckIcon } from "@substantiate/ui";
import type { SavedRow } from "@/lib/scan";

export interface DoneProps {
  /** Period that was scanned, e.g. "2026". */
  periodShort: string;
  /** Grand total of saved receipts. */
  subtotalStr: string;
  /** How many receipts were saved. */
  foundCount: number;
  /** The first three saved rows (date + amount). */
  rowsTop: SavedRow[];
  /** Whether there are more than the three shown. */
  hasMore: boolean;
  /** How many beyond the three shown. */
  moreCount: number;
  /** Orders skipped because a prior run already saved them (0 hides the note). */
  skippedAlreadySaved: number;
  /** Orders that couldn't be read this run (0 hides the note). */
  errorCount: number;
  /** The walk signed out mid-way but still saved some — offer a re-run. */
  partial: boolean;
  onReset: () => void;
  onShowInFolder: () => void;
}

/**
 * Done view — the scan's receipt. Normally a stamped total, the top saved
 * files, a "what's next" note, and the footer actions. When nothing eligible
 * turned up it swaps the tape for a calm empty state; when the walk signed out
 * mid-way it adds a re-run note over the saved-so-far results.
 */
export function Done({
  periodShort,
  subtotalStr,
  foundCount,
  rowsTop,
  hasMore,
  moreCount,
  skippedAlreadySaved,
  errorCount,
  partial,
  onReset,
  onShowInFolder,
}: DoneProps) {
  if (foundCount === 0) {
    // With no saves, a "none were eligible" claim is only true if nothing errored;
    // otherwise the walk simply couldn't read some orders and should say so.
    const hadErrors = errorCount > 0;
    return (
      <div className="relative flex flex-1 flex-col px-4 pt-5 pb-4">
        <Eyebrow tone="accent">Complete · {periodShort}</Eyebrow>

        <div className="mt-[18px] flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex text-ink3">
            <FileCheckIcon size={38} strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-serif text-[24px] font-medium leading-[1.15]">
            {hadErrors ? (
              <>
                Couldn&rsquo;t finish
                <br />
                scanning {periodShort}.
              </>
            ) : (
              <>
                No eligible receipts
                <br />
                found in {periodShort}.
              </>
            )}
          </h2>
          <p className="mt-3 max-w-[280px] text-[12.5px] leading-[1.55] text-ink2">
            {hadErrors ? (
              <>
                We couldn&rsquo;t read {errorCount}{" "}
                {errorCount === 1 ? "order" : "orders"} this time. Re-run to try again &mdash;
                anything eligible will be saved.
              </>
            ) : (
              <>
                substantiate only saves orders with an &ldquo;FSA or HSA eligible&rdquo; total.
                None of your Amazon orders in this period had one.
              </>
            )}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <Button variant="secondary" block onClick={onReset}>
            Save another year
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-4">
      <Stamp label="SAVED" className="absolute top-[30px] right-[14px] opacity-[0.88]" />

      <Eyebrow tone="accent">Complete · {periodShort}</Eyebrow>
      <div className="mt-2 font-serif text-[46px] font-medium leading-none">{subtotalStr}</div>
      <div className="mt-[6px] font-mono text-[11px] text-ink2">
        {foundCount} receipts saved to Downloads
        {skippedAlreadySaved > 0 && ` · skipped ${skippedAlreadySaved} already saved`}
      </div>

      <ReceiptCard variant="tape" className="mt-[18px]">
        {rowsTop.map((row, i) => (
          <ReceiptRow key={i} left={row.date} right={row.amount} />
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

      {partial && (
        <div className="mt-[14px] flex items-start gap-[9px] rounded-control border border-rule bg-paper2 px-3 py-[11px]">
          <span className="mt-[2px] flex-none font-mono text-[9.5px] font-medium tracking-[0.1em] text-terra">
            NOTE
          </span>
          <span className="text-[12px] leading-[1.5] text-ink2">
            Amazon signed you out before we finished &mdash; re-run to save the rest.
          </span>
        </div>
      )}

      {errorCount > 0 && (
        <div className="mt-[14px] flex items-start gap-[9px] rounded-control border border-rule bg-paper2 px-3 py-[11px]">
          <span className="mt-[2px] flex-none font-mono text-[9.5px] font-medium tracking-[0.1em] text-terra">
            NOTE
          </span>
          <span className="text-[12px] leading-[1.5] text-ink2">
            Couldn&rsquo;t read {errorCount} {errorCount === 1 ? "order" : "orders"} this run
            &mdash; re-run to try for {errorCount === 1 ? "it" : "them"}.
          </span>
        </div>
      )}

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
