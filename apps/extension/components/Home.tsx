import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Button,
  Eyebrow,
  CheckIcon,
  CalendarIcon,
  StorefrontIcon,
  InfoIcon,
} from "@substantiate/ui";
import { Calendar } from "@/components/ui/calendar";

export interface HomeProps {
  mode: "year" | "range";
  year: 2026 | 2025;
  /** Whether the custom-range disclosure is expanded. */
  rangeOpen: boolean;
  /** The picked custom range, or undefined until the user selects one. */
  range: DateRange | undefined;
  /** Year mode selected, or a complete custom range. */
  canStart: boolean;
  /** Chrome-only feature is unavailable here (Firefox) — disable Start. */
  blocked?: boolean;
  onSelectYear: (year: 2026 | 2025) => void;
  onToggleRange: () => void;
  onRangeChange: (range: DateRange | undefined) => void;
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
  range,
  canStart,
  blocked = false,
  onSelectYear,
  onToggleRange,
  onRangeChange,
  onStart,
}: HomeProps) {
  // Which endpoint the next tap sets: "from" when there's no start or the range
  // is already complete (a tap starts over), otherwise "to". Its box gets the
  // terracotta border. Mirrors the prototype's fromBorder/toBorder logic.
  const nextEnd = !range?.from || (range.from && range.to) ? "from" : "to";

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

        {/* Custom-range disclosure: From/To summary boxes over an inline themed
            range calendar. Picking a range flips Panel to "range" mode. */}
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
              <div className="flex gap-2">
                <FromToBox
                  label="From"
                  date={range?.from}
                  active={nextEnd === "from"}
                />
                <FromToBox
                  label="To"
                  date={range?.to}
                  active={nextEnd === "to"}
                />
              </div>
              <div className="mt-3 flex justify-center">
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  defaultMonth={range?.from}
                  selected={range}
                  onSelect={onRangeChange}
                />
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
          disabled={!canStart || blocked}
          onClick={onStart}
        >
          Start saving
        </Button>
        <div className="mt-[10px] text-center text-[11.5px] leading-[1.5] text-ink3">
          {blocked
            ? "substantiate saves receipts on desktop Chrome. Firefox support is coming soon."
            : "Saved to your computer. Nothing is ever uploaded."}
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

/**
 * A read-only From/To field box reflecting the picked endpoint. `active` marks
 * the endpoint the next calendar tap will set (terracotta border).
 */
function FromToBox({
  label,
  date,
  active,
}: {
  label: string;
  date: Date | undefined;
  active: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-control border bg-field px-[10px] py-[7px] ${
        active ? "border-terra" : "border-rule"
      }`}
    >
      <div className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink3">
        {label}
      </div>
      <div
        className={`mt-[2px] font-mono text-[12px] ${date ? "text-ink" : "text-ink3"}`}
      >
        {date ? format(date, "MMM d, yyyy") : "—"}
      </div>
    </div>
  );
}
