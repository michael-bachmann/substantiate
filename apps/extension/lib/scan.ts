import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { money, fmtDate } from "@/lib/format";
import type { ExportResult, ExportSummary } from "@/lib/types";

/**
 * Pure helpers backing the side-panel scan hook. Kept out of the React hook so
 * they're unit-testable (and covered under the `lib/**` gate): turning the
 * chosen period into the walk's ISO date range, turning a saved-order result
 * into a display row, and folding a finished summary into the Done view's props.
 */

/** A found receipt as the Saving/Done tapes render it. */
export interface SavedRow {
  /** Display date, e.g. "Jun 25, 2026". */
  date: string;
  /** Eligible amount, e.g. "$54.86". */
  amount: string;
}

/**
 * The date range the walk receives, as inclusive ISO `YYYY-MM-DD`.
 * Year mode → Jan 1 .. Dec 31 of that year. Range mode → the picked endpoints.
 * A range-mode call with an incomplete range falls back to the year (the panel
 * only starts a scan once the range is complete, so this is just belt-and-suspenders).
 */
export function periodRange(
  mode: "year" | "range",
  year: number,
  range: DateRange | undefined,
): { fromDate: string; toDate: string } {
  if (mode === "range" && range?.from && range?.to) {
    return {
      fromDate: format(range.from, "yyyy-MM-dd"),
      toDate: format(range.to, "yyyy-MM-dd"),
    };
  }
  return { fromDate: `${year}-01-01`, toDate: `${year}-12-31` };
}

/**
 * A saved result → a display row. The date is parsed out of the export
 * filename (`Amazon_YYYY-MM-DD_$amount.pdf`); a malformed name degrades to "—"
 * rather than throwing. The amount comes from the eligible cents.
 */
export function savedRow(result: ExportResult): SavedRow {
  const cents = "fsaEligibleCents" in result ? result.fsaEligibleCents : 0;
  const iso = "filename" in result ? result.filename.match(/(\d{4})-(\d{2})-(\d{2})/) : null;
  const date = iso
    ? fmtDate(new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])))
    : "—";
  return { date, amount: money(cents / 100) };
}

/** The Done view's props, folded out of a finished walk summary. */
export interface DoneData {
  foundCount: number;
  /** The first three saved rows shown on the tape. */
  rowsTop: SavedRow[];
  hasMore: boolean;
  moreCount: number;
  subtotalStr: string;
  /** How many orders were skipped because a prior run already saved them. */
  skippedAlreadySaved: number;
  /** How many orders couldn't be read (so a zero result isn't "none eligible"). */
  errorCount: number;
  /** The walk signed out mid-way but still saved some receipts. */
  partial: boolean;
}

export function summaryToDone(summary: ExportSummary): DoneData {
  const rows = summary.saved.map(savedRow);
  const foundCount = summary.saved.length;
  const subtotalCents = summary.saved.reduce(
    (acc, r) => acc + ("fsaEligibleCents" in r ? r.fsaEligibleCents : 0),
    0,
  );
  const skippedAlreadySaved = summary.skipped.filter(
    (s) => "reason" in s && s.reason === "already-saved",
  ).length;
  return {
    foundCount,
    rowsTop: rows.slice(0, 3),
    hasMore: foundCount > 3,
    moreCount: Math.max(0, foundCount - 3),
    subtotalStr: money(subtotalCents / 100),
    skippedAlreadySaved,
    errorCount: summary.errors.length,
    partial: summary.signedOut && foundCount > 0,
  };
}
