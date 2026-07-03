import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Logo, type Web3FormsPayload } from "@substantiate/ui";
import { Home } from "@/components/Home";
import { Saving } from "@/components/Saving";
import { Done } from "@/components/Done";
import { Help } from "@/components/Help";
import { useScan, type ScanView } from "@/components/useScan";

interface PanelProps {
  /** Storybook seeds — production mounts with the defaults. */
  initialMode?: "year" | "range";
  initialYear?: 2026 | 2025;
  initialRangeOpen?: boolean;
  /** Seed the calendar with a picked range (for stories). */
  initialRange?: DateRange;
  /** Seed a static Saving/Done frame (stories) — the timer stays idle until a
   *  real `startScan`, so seeded frames don't animate. */
  initialView?: ScanView;
  initialChecked?: number;
  initialFound?: number;
  /** Seed the Help overlay open + its disclosures (stories). */
  initialHelpOpen?: boolean;
  initialReqOpen?: boolean;
  initialBugOpen?: boolean;
  /** Send seam forwarded to the Help disclosures (stories force sent/error). */
  submit?: (payload: Web3FormsPayload) => Promise<void>;
}

/**
 * Side-panel shell: a full-height flex column with a header shared by every
 * view and a view area. `useScan` owns the scan lifecycle and drives which
 * view renders (home → saving → done).
 */
export default function Panel({
  initialMode = "year",
  initialYear = 2026,
  initialRangeOpen = false,
  initialRange,
  initialView = "home",
  initialChecked = 0,
  initialFound = 0,
  initialHelpOpen = false,
  initialReqOpen = false,
  initialBugOpen = false,
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
    initialChecked,
    initialFound,
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

  function startScan() {
    if (canStart) scan.start();
  }

  function showInFolder() {
    // PR 10: reveal the saved downloads in the OS file manager.
  }

  return (
    <div className="relative flex h-full flex-col bg-paper text-ink">
      {/* Header — reused by the Saving/Done views and the Help overlay later. */}
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
          onSelectYear={selectYear}
          onToggleRange={() => setRangeOpen((open) => !open)}
          onRangeChange={changeRange}
          onStart={startScan}
        />
      )}

      {scan.view === "saving" && (
        <Saving
          periodShort={scan.periodShort}
          checkedLabel={scan.checkedLabel}
          progressPct={scan.progressPct}
          foundCount={scan.foundCount}
          rows={scan.rows}
          subtotalStr={scan.subtotalStr}
          currentOrderId={scan.currentOrderId}
          onCancel={scan.cancel}
        />
      )}

      {scan.view === "done" && (
        <Done
          periodShort={scan.periodShort}
          subtotalStr={scan.subtotalStr}
          foundCount={scan.foundCount}
          rowsTop={scan.rowsTop}
          hasMore={scan.hasMore}
          moreCount={scan.moreCount}
          onReset={scan.reset}
          onShowInFolder={showInFolder}
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
