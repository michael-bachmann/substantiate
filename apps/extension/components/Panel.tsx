import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Logo } from "@substantiate/ui";
import { Home } from "@/components/Home";

interface PanelProps {
  /** Storybook seeds — production mounts with the defaults. */
  initialMode?: "year" | "range";
  initialYear?: 2026 | 2025;
  initialRangeOpen?: boolean;
  /** Seed the calendar with a picked range (for stories). */
  initialRange?: DateRange;
}

/**
 * Side-panel shell: a full-height flex column with a header shared by every
 * view and a view area. Only Home ships now; `view` is seeded to "home" so
 * PR 8 can slot in the Saving/Done views without restructuring.
 */
export default function Panel({
  initialMode = "year",
  initialYear = 2026,
  initialRangeOpen = false,
  initialRange,
}: PanelProps) {
  const [view] = useState<"home" | "saving" | "done">("home");
  const [mode, setMode] = useState<"year" | "range">(initialMode);
  const [year, setYear] = useState<2026 | 2025>(initialYear);
  const [rangeOpen, setRangeOpen] = useState(initialRangeOpen);
  // The custom-range endpoints, as react-day-picker's DateRange. The calendar
  // owns the pick logic; picking flips `mode` to "range".
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

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
    // PR 9: Help overlay
  }

  function startScan() {
    // PR 8: run the scan (transitions to the Saving view)
  }

  return (
    <div className="flex h-full flex-col bg-paper text-ink">
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

      {view === "home" && (
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
    </div>
  );
}
