import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { money, rangeShort } from "@/lib/format";
import { periodRange, savedRow, summaryToDone, type SavedRow } from "@/lib/scan";
import type { ExportSummary } from "@/lib/types";
import { startScan, cancelScan, onScanProgress } from "@/lib/messaging";

export type ScanView = "home" | "saving" | "done" | "signedout" | "error";
export type ScanPhase = "collecting" | "exporting";

interface UseScanArgs {
  mode: "year" | "range";
  year: number;
  range: DateRange | undefined;
  /** Story seeds — a real mount uses the defaults and never sends a message
   *  until `start()` is called, so seeded frames render statically. */
  initialView?: ScanView;
  initialPhase?: ScanPhase;
  initialIndex?: number;
  initialTotal?: number;
  initialRows?: SavedRow[];
  initialSubtotalCents?: number;
  /** Seeds the Done / signed-out views from a finished summary (stories). */
  initialSummary?: ExportSummary;
  initialError?: string;
}

/**
 * Drives the side panel over the background message bus. `start()` kicks off the
 * real Amazon export walk and streams its two-phase progress into the Saving
 * view; when the walk resolves it maps the summary to a terminal view
 * (done / signed-out / error). The messaging seam is only touched on a real
 * `start()`/`cancel()` — seeded state renders a static frame for stories.
 */
export function useScan({
  mode,
  year,
  range,
  initialView = "home",
  initialPhase = "collecting",
  initialIndex = 0,
  initialTotal = 0,
  initialRows = [],
  initialSubtotalCents = 0,
  initialSummary,
  initialError = "",
}: UseScanArgs) {
  const [view, setView] = useState<ScanView>(initialView);
  const [phase, setPhase] = useState<ScanPhase>(initialPhase);
  const [index, setIndex] = useState(initialIndex);
  const [total, setTotal] = useState(initialTotal);
  const [rows, setRows] = useState<SavedRow[]>(initialRows);
  const [subtotalCents, setSubtotalCents] = useState(initialSubtotalCents);
  const [summary, setSummary] = useState<ExportSummary | null>(initialSummary ?? null);
  const [errorMessage, setErrorMessage] = useState(initialError);

  // A monotonic run token guards against a superseded run's async work landing on
  // a newer one. `start()` captures an id; the progress callback and the post-await
  // block no-op unless the id is still current. `cancel()` (and a restart) bump the
  // token, so an aborted run's late resolution can't clobber the live view or
  // double-append rows. `latestUnsub` is only for releasing the listener on unmount.
  const runRef = useRef(0);
  const latestUnsub = useRef<(() => void) | null>(null);

  // Release the live progress listener if the panel closes mid-scan — no leaks.
  useEffect(() => () => latestUnsub.current?.(), []);

  async function start() {
    const id = ++runRef.current;
    setRows([]);
    setSubtotalCents(0);
    setIndex(0);
    setTotal(0);
    setPhase("collecting");
    setView("saving");

    const { fromDate, toDate } = periodRange(mode, year, range);
    const unsub = onScanProgress((e) => {
      if (id !== runRef.current) return; // superseded or cancelled — ignore
      if (e.phase === "collecting") {
        setPhase("collecting");
        return;
      }
      setPhase("exporting");
      setIndex(e.index);
      setTotal(e.total);
      if (e.result.status === "saved") {
        const cents = e.result.fsaEligibleCents;
        setRows((rs) => [...rs, savedRow(e.result)]);
        setSubtotalCents((c) => c + cents);
      }
    });
    latestUnsub.current = unsub;

    const res = await startScan({ retailer: "amazon", fromDate, toDate });
    unsub();
    if (latestUnsub.current === unsub) latestUnsub.current = null;

    // A cancel or a restart bumped the token past this run — drop its result.
    if (id !== runRef.current) return;
    if ("error" in res) {
      setErrorMessage(res.error);
      setView("error");
      return;
    }
    const s = res.summary;
    setSummary(s);
    setView(s.signedOut && s.saved.length === 0 ? "signedout" : "done");
  }

  function cancel() {
    runRef.current++; // invalidate the in-flight run's callback + resolution
    void cancelScan();
    setView("home");
  }

  function reset() {
    setView("home");
  }

  const yearMode = mode === "year";
  const periodShort = yearMode
    ? String(year)
    : range?.from && range?.to
      ? rangeShort(range.from, range.to)
      : "custom range";

  return {
    view,
    start,
    cancel, // "Cancel" on Saving
    reset, // "Save another year" / "Back" on the terminal views
    periodShort,
    // Saving (two-phase)
    phase,
    index,
    total,
    rows,
    subtotalStr: money(subtotalCents / 100),
    // Done (folded from the finished summary)
    done: summary ? summaryToDone(summary) : null,
    // Error
    errorMessage,
  };
}

export type ScanModel = ReturnType<typeof useScan>;
