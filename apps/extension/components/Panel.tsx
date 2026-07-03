import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Logo,
  StorefrontIcon,
  AlertTriangleIcon,
  type Web3FormsPayload,
} from "@substantiate/ui";
import { Home } from "@/components/Home";
import { Saving } from "@/components/Saving";
import { Done } from "@/components/Done";
import { ScanNotice } from "@/components/ScanNotice";
import { Help } from "@/components/Help";
import { useScan, type ScanView, type ScanPhase } from "@/components/useScan";
import { showDownloads } from "@/lib/messaging";
import type { SavedRow } from "@/lib/scan";
import type { ExportSummary } from "@/lib/types";

const AMAZON_ORDERS_URL = "https://www.amazon.com/gp/css/order-history?ref=substantiate";

interface PanelProps {
  /** Storybook seeds — production mounts with the defaults. */
  initialMode?: "year" | "range";
  initialYear?: 2026 | 2025;
  initialRangeOpen?: boolean;
  /** Seed the calendar with a picked range (for stories). */
  initialRange?: DateRange;
  /** Seed a static scan frame (stories) — the messaging seam stays idle until a
   *  real `startScan`, so seeded frames don't animate or send messages. */
  initialView?: ScanView;
  initialPhase?: ScanPhase;
  initialIndex?: number;
  initialTotal?: number;
  initialRows?: SavedRow[];
  initialSubtotalCents?: number;
  initialSummary?: ExportSummary;
  initialError?: string;
  /** Seed the Help overlay open + its disclosures (stories). */
  initialHelpOpen?: boolean;
  initialReqOpen?: boolean;
  initialBugOpen?: boolean;
  /** Chrome-only gate. Defaults to the WXT build target; stories force it. */
  blocked?: boolean;
  /** Send seam forwarded to the Help disclosures (stories force sent/error). */
  submit?: (payload: Web3FormsPayload) => Promise<void>;
}

/**
 * Side-panel shell: a full-height flex column with a header shared by every
 * view and a view area. `useScan` owns the scan lifecycle and drives which
 * view renders (home → saving → done / signed-out / error).
 */
export default function Panel({
  initialMode = "year",
  initialYear = 2026,
  initialRangeOpen = false,
  initialRange,
  initialView = "home",
  initialPhase = "collecting",
  initialIndex = 0,
  initialTotal = 0,
  initialRows = [],
  initialSubtotalCents = 0,
  initialSummary,
  initialError = "",
  initialHelpOpen = false,
  initialReqOpen = false,
  initialBugOpen = false,
  blocked = Boolean(import.meta.env.FIREFOX),
  submit,
}: PanelProps) {
  const [helpOpen, setHelpOpen] = useState(initialHelpOpen);
  const [mode, setMode] = useState<"year" | "range">(initialMode);
  const [year, setYear] = useState<2026 | 2025>(initialYear);
  const [rangeOpen, setRangeOpen] = useState(initialRangeOpen);
  // The custom-range endpoints, as react-day-picker's DateRange. The calendar
  // owns the pick logic; picking flips `mode` to "range".
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const scan = useScan({
    mode,
    year,
    range,
    initialView,
    initialPhase,
    initialIndex,
    initialTotal,
    initialRows,
    initialSubtotalCents,
    initialSummary,
    initialError,
  });

  // Year mode is always a valid period; a custom range needs both ends.
  const canStart = mode === "year" || (range?.from != null && range?.to != null);

  // A pick (react-day-picker calls this only on user selection) activates range
  // mode, which deselects the year tiles and shows the "Using" tag. Re-clicking
  // a lone start day deselects it (next=undefined); ignore that so we don't
  // strand range mode over an empty range — pick a new start or a year instead.
  function changeRange(next: DateRange | undefined) {
    if (!next) return;
    setRange(next);
    setMode("range");
  }

  function selectYear(next: 2026 | 2025) {
    setYear(next);
    setMode("year");
  }

  function openHelp() {
    setHelpOpen(true);
  }

  function handleStart() {
    // Firefox has no walk yet; the button is disabled, but guard anyway.
    if (canStart && !blocked) scan.start();
  }

  return (
    <div className="relative flex h-full flex-col bg-paper text-ink">
      {/* Header — reused by every view and the Help overlay. */}
      <header className="flex flex-shrink-0 items-center gap-[11px] border-b-[1.5px] border-dashed border-dash px-4 py-[14px]">
        <Logo />
        <button
          type="button"
          onClick={openHelp}
          aria-label="Open help and settings"
          className="ml-auto cursor-pointer px-[6px] py-[2px] text-[17px] tracking-[1px] text-ink3 transition hover:text-ink2"
        >
          ···
        </button>
      </header>

      {scan.view === "home" && (
        <Home
          mode={mode}
          year={year}
          rangeOpen={rangeOpen}
          range={range}
          canStart={canStart}
          blocked={blocked}
          onSelectYear={selectYear}
          onToggleRange={() => setRangeOpen((open) => !open)}
          onRangeChange={changeRange}
          onStart={handleStart}
        />
      )}

      {scan.view === "saving" && (
        <Saving
          periodShort={scan.periodShort}
          phase={scan.phase}
          index={scan.index}
          total={scan.total}
          rows={scan.rows}
          subtotalStr={scan.subtotalStr}
          onCancel={scan.cancel}
        />
      )}

      {scan.view === "done" && scan.done && (
        <Done
          periodShort={scan.periodShort}
          subtotalStr={scan.done.subtotalStr}
          foundCount={scan.done.foundCount}
          rowsTop={scan.done.rowsTop}
          hasMore={scan.done.hasMore}
          moreCount={scan.done.moreCount}
          skippedAlreadySaved={scan.done.skippedAlreadySaved}
          errorCount={scan.done.errorCount}
          partial={scan.done.partial}
          onReset={scan.reset}
          onShowInFolder={showDownloads}
        />
      )}

      {scan.view === "signedout" && (
        <ScanNotice
          icon={<StorefrontIcon size={40} />}
          title="Sign in to Amazon"
          body="We couldn't reach your orders. Open Amazon, sign in, then try again."
          primary={{ label: "Open Amazon", href: AMAZON_ORDERS_URL }}
          secondary={{ label: "Try again", onClick: scan.start }}
        />
      )}

      {scan.view === "error" && (
        <ScanNotice
          icon={<AlertTriangleIcon size={40} />}
          title="Something went wrong"
          body={scan.errorMessage || "We hit a snag reaching Amazon. Try again in a moment."}
          primary={{ label: "Try again", onClick: scan.start }}
          secondary={{ label: "Back", onClick: scan.reset }}
        />
      )}

      {/* Help & about — an absolute layer covering the current view. */}
      {helpOpen && (
        <Help
          onClose={() => setHelpOpen(false)}
          initialReqOpen={initialReqOpen}
          initialBugOpen={initialBugOpen}
          submit={submit}
        />
      )}
    </div>
  );
}
