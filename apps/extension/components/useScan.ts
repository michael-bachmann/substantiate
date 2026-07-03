import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { money, rangeShort } from "@/lib/format";

export type ScanView = "home" | "saving" | "done";

interface Receipt {
  /** Display date, e.g. "Jun 25". */
  d: string;
  /** Month-day used in the saved filename, e.g. "06-25". */
  md: string;
  /** Eligible amount. */
  a: number;
}

// ── MOCK ────────────────────────────────────────────────────────────────
// A fixed catalog of eligible receipts + the `checked` counts at which each
// one is "found" stand in for real Amazon order-history walking. PR 10
// replaces this catalog + timer with the live scanner; the derived values and
// view transitions below stay as-is.
const CATALOG: Receipt[] = [
  { d: "Jun 25", md: "06-25", a: 54.86 },
  { d: "Jun 18", md: "06-18", a: 18.2 },
  { d: "Jun 11", md: "06-11", a: 129.4 },
  { d: "Jun 02", md: "06-02", a: 42.99 },
  { d: "May 21", md: "05-21", a: 23.1 },
  { d: "May 09", md: "05-09", a: 67.5 },
  { d: "Apr 27", md: "04-27", a: 15.99 },
  { d: "Apr 14", md: "04-14", a: 88.0 },
  { d: "Mar 30", md: "03-30", a: 31.25 },
  { d: "Mar 12", md: "03-12", a: 49.99 },
  { d: "Feb 20", md: "02-20", a: 12.4 },
  { d: "Jan 16", md: "01-16", a: 106.9 },
];
const THRESHOLDS = [6, 14, 22, 30, 44, 54, 66, 78, 90, 100, 108, 116];
const TARGET = 120;
const TICK_MS = 120;
// ────────────────────────────────────────────────────────────────────────

interface ScanState {
  view: ScanView;
  checked: number;
  /** How many of CATALOG have been revealed so far. */
  foundCount: number;
}

interface UseScanArgs {
  mode: "year" | "range";
  year: number;
  range: DateRange | undefined;
  /** Story seeds — a real mount uses the defaults and never runs the timer
   *  until `start()` is called. */
  initialView?: ScanView;
  initialChecked?: number;
  initialFound?: number;
}

/**
 * Owns the mocked scan: a ~120ms timer that advances `checked` two at a time,
 * revealing receipts as `checked` crosses each threshold, then flips to the
 * Done view at the target. Derives every value the Saving/Done views render.
 * The timer only ever runs after a real `start()` — seeded state renders a
 * static frame for stories.
 */
export function useScan({
  mode,
  year,
  range,
  initialView = "home",
  initialChecked = 0,
  initialFound = 0,
}: UseScanArgs) {
  const [state, setState] = useState<ScanState>({
    view: initialView,
    checked: initialChecked,
    foundCount: initialFound,
  });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function clear() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  // Stop the timer once the scan completes, and always on unmount — no leaks.
  useEffect(() => {
    if (state.view === "done") clear();
  }, [state.view]);
  useEffect(() => clear, []);

  function start() {
    clear();
    setState({ view: "saving", checked: 0, foundCount: 0 });
    timer.current = setInterval(() => {
      setState((s) => {
        const checked = s.checked + 2;
        if (checked >= TARGET) {
          return { view: "done", checked: TARGET, foundCount: CATALOG.length };
        }
        const revealed = THRESHOLDS.filter((t) => t <= checked).length;
        return { view: "saving", checked, foundCount: Math.max(revealed, s.foundCount) };
      });
    }, TICK_MS);
  }

  function toHome() {
    clear();
    setState({ view: "home", checked: 0, foundCount: 0 });
  }

  // Derived values (port of the prototype's `renderVals`).
  const found = CATALOG.slice(0, state.foundCount);
  const yearMode = mode === "year";
  const fileYear = yearMode ? year : (range?.from?.getFullYear() ?? year);
  const periodShort = yearMode
    ? String(year)
    : range?.from && range?.to
      ? rangeShort(range.from, range.to)
      : "custom range";
  const sum = found.reduce((acc, r) => acc + r.a, 0);
  const rows = found.map((r) => ({
    date: r.d,
    amount: money(r.a),
    name: `Amazon_${fileYear}-${r.md}`,
  }));

  return {
    view: state.view,
    start,
    cancel: toHome, // "Cancel" on Saving
    reset: toHome, // "Save another year" on Done
    periodShort,
    checkedLabel: `${state.checked} / ~${TARGET}`,
    progressPct: Math.min(100, Math.round((state.checked / TARGET) * 100)),
    foundCount: found.length,
    subtotalStr: money(sum),
    rows,
    rowsTop: rows.slice(0, 3),
    hasMore: found.length > 3,
    moreCount: Math.max(0, found.length - 3),
    currentOrderId: `113-${66000 + state.checked * 7}`,
  };
}

export type ScanModel = ReturnType<typeof useScan>;
