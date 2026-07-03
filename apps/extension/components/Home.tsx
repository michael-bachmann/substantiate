import {
  Button,
  Eyebrow,
  CheckIcon,
  CalendarIcon,
  StorefrontIcon,
  InfoIcon,
} from "@substantiate/ui";

export interface HomeProps {
  mode: "year" | "range";
  year: 2026 | 2025;
  /** Whether the custom-range disclosure is expanded. */
  rangeOpen: boolean;
  /** ISO range endpoints — empty until PR 7 mounts the calendar. */
  rangeFrom: string;
  rangeTo: string;
  /** Year mode selected, or a complete custom range. */
  canStart: boolean;
  onSelectYear: (year: 2026 | 2025) => void;
  onToggleRange: () => void;
  onStart: () => void;
}

/**
 * Home view — pick a retailer (fixed to Amazon) and a period, then start.
 * A scrolling body over a pinned footer: the footer never scrolls so
 * "Start saving" is always reachable at 380px wide.
 */
export function Home({
  mode,
  year,
  rangeOpen,
  rangeFrom,
  rangeTo,
  canStart,
  onSelectYear,
  onToggleRange,
  onStart,
}: HomeProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Scrolling body */}
      <div className="flex-1 overflow-auto px-4 pt-[18px] pb-[10px]">
        <Eyebrow tone="accent">New batch</Eyebrow>
        <h1 className="mt-[5px] font-serif text-[30px] font-medium leading-[1.08]">
          Let&rsquo;s collect your
          <br />
          eligible receipts.
        </h1>

        <Eyebrow className="mt-[22px] mb-[9px]">Retailer</Eyebrow>
        <div className="flex items-center gap-[11px] rounded-control border border-rule bg-paper2 px-3 py-[11px]">
          <span className="flex text-ink2">
            <StorefrontIcon size={19} />
          </span>
          <span className="text-[14px] font-bold">Amazon</span>
          <span className="ml-auto font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-terra">
            Active
          </span>
        </div>

        <div className="mt-[14px] flex items-start gap-[9px] border-y border-dashed border-dash px-[2px] py-[11px]">
          <span className="mt-px flex flex-none text-terra">
            <InfoIcon size={14} />
          </span>
          <span className="text-[12px] leading-[1.5] text-ink2">
            First, make sure you&rsquo;re{" "}
            <b className="text-ink">signed in to Amazon</b> in another tab.
          </span>
        </div>

        <Eyebrow className="mt-[18px] mb-[9px]">Period</Eyebrow>
        <div className="grid grid-cols-2 gap-2">
          <YearTile
            year={2026}
            caption="this year"
            selected={mode === "year" && year === 2026}
            onClick={() => onSelectYear(2026)}
          />
          <YearTile
            year={2025}
            caption="last year"
            selected={mode === "year" && year === 2025}
            onClick={() => onSelectYear(2025)}
          />
        </div>

        {/* Custom-range disclosure. The calendar itself lands in PR 7 — for now
            the expanded body is a static From/To stub so the seam is visible. */}
        <div className="mt-2 overflow-hidden rounded-control border border-rule bg-paper2">
          <button
            type="button"
            onClick={onToggleRange}
            className="flex w-full cursor-pointer items-center gap-[10px] px-3 py-[11px] text-left"
          >
            <span className="flex flex-none text-terra">
              <CalendarIcon size={17} strokeWidth={1.7} />
            </span>
            <span className="flex-1 text-[13px] font-bold">Custom range</span>
            {mode === "range" && (
              <span className="mr-[2px] font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-terra">
                Using
              </span>
            )}
            <span className="w-[14px] flex-none text-center text-[17px] leading-none text-terra">
              {rangeOpen ? "−" : "+"}
            </span>
          </button>
          {rangeOpen && (
            <div className="border-t border-dashed border-dash p-3">
              {/* PR 7: mount the themed range calendar here */}
              <div className="flex gap-2">
                <FromToBox label="From" value={rangeFrom} />
                <FromToBox label="To" value={rangeTo} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned footer — never scrolls */}
      <div className="flex-shrink-0 border-t border-dashed border-dash px-4 pt-[13px] pb-4">
        <Button
          variant="primary"
          block
          icon="arrow"
          disabled={!canStart}
          onClick={onStart}
        >
          Start saving
        </Button>
        <div className="mt-[10px] text-center text-[11.5px] leading-[1.5] text-ink3">
          Saved to your computer. Nothing is ever uploaded.
        </div>
      </div>
    </div>
  );
}

/** One period tap target: a big serif year + a mono caption. */
function YearTile({
  year,
  caption,
  selected,
  onClick,
}: {
  year: number;
  caption: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative w-full cursor-pointer rounded-control border px-[13px] py-[11px] text-left ${
        selected ? "border-terra bg-paper2" : "border-rule"
      }`}
    >
      <div
        className={`font-serif text-[31px] leading-none ${selected ? "" : "text-ink2"}`}
      >
        {year}
      </div>
      <div
        className={`mt-[3px] font-mono text-[9.5px] tracking-[0.06em] ${
          selected ? "text-ink2" : "text-ink3"
        }`}
      >
        {caption}
      </div>
      {selected && (
        <span className="absolute top-[10px] right-[11px] flex text-terra">
          <CheckIcon size={14} strokeWidth={2.6} />
        </span>
      )}
    </button>
  );
}

/** A read-only From/To field box for the custom-range stub (PR 7 makes it live). */
function FromToBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-control border border-rule bg-field px-[10px] py-[7px]">
      <div className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink3">
        {label}
      </div>
      <div className="mt-[2px] font-mono text-[12px] text-ink3">
        {value || "—"}
      </div>
    </div>
  );
}
