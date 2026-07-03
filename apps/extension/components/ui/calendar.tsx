import type { ComponentProps } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/components/lib/utils";

export type CalendarProps = ComponentProps<typeof DayPicker>;

/**
 * shadcn/ui Calendar (react-day-picker v9), themed to the substantiate receipt
 * language: terracotta range endpoints, terra-tint middle band, mono weekday
 * row, Newsreader month caption, ghost-outline nav. Adapted from the design
 * handoff's reference/date-range-picker.tsx.
 *
 * Two deliberate departures from the reference's `classNames`:
 *   1. The reference's raw CSS-var utilities (`text-[--ink]`, `bg-[--field]`)
 *      are swapped for the extension's `@theme` token utilities (`text-ink`,
 *      `bg-field`, …), which is how tokens are consumed everywhere else here.
 *   2. We don't import react-day-picker's stylesheet, so the few structural
 *      rules it would supply — `.rdp-months { position: relative }` and the
 *      absolutely-positioned `.rdp-nav` — are folded into the classNames below.
 *
 * `--cell-size` (~34px) sizes each day cell to fit the 380px side panel.
 */
export function Calendar({ className, classNames, showOutsideDays = false, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={0} // Sunday-first, per the design
      className={cn("[--cell-size:2.125rem]", className)}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft /> : <ChevronRight />,
      }}
      classNames={{
        ...getDefaultClassNames(),
        months: "relative flex flex-col",
        month: "space-y-2.5",
        month_caption: "flex h-9 items-center px-1",
        caption_label: "font-serif text-[18px] leading-none text-ink",
        nav: "absolute right-0 top-0 flex h-9 items-center gap-1.5",
        button_previous:
          "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-rule bg-field text-terra hover:bg-paper [&_svg]:size-3.5",
        button_next:
          "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-rule bg-field text-terra hover:bg-paper [&_svg]:size-3.5",
        weekdays: "flex",
        weekday:
          "w-(--cell-size) text-center font-mono text-[9.5px] font-medium uppercase tracking-wide text-ink3",
        week: "mt-0.5 flex w-full",
        day: "h-(--cell-size) w-(--cell-size) p-0 text-center",
        day_button:
          "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[9px] font-sans text-[12.5px] font-medium text-ink transition-colors hover:bg-paper",
        // A lone start (from picked, no to yet) is `selected` only — no range
        // modifiers — so it renders here as a full terracotta pill. #FCF8EF is
        // the paper-2 tint used for text on a terracotta fill.
        selected:
          "[&>button]:rounded-[9px] [&>button]:bg-terra [&>button]:text-[#FCF8EF] [&>button:hover]:bg-terra",
        // Range band: solid terracotta ends, terra-tint middle, one continuous
        // strip via zero-gap cells. Endpoints keep the outer rounding and square
        // the inner edge; the middle overrides the `selected` fill (in-range days
        // are also `selected`), hence the `!`.
        range_start:
          "rounded-l-[9px] bg-terra [&>button]:!rounded-r-none [&>button]:bg-terra [&>button]:text-[#FCF8EF]",
        range_end:
          "rounded-r-[9px] bg-terra [&>button]:!rounded-l-none [&>button]:bg-terra [&>button]:text-[#FCF8EF]",
        range_middle:
          "rounded-none bg-terra-t [&>button]:!rounded-none [&>button]:!bg-transparent [&>button]:text-terra-d [&>button:hover]:!bg-transparent",
        today: "rounded-[9px] [&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-terra [&>button]:text-terra",
        disabled: "[&>button]:opacity-30",
        ...classNames,
      }}
      {...props}
    />
  );
}
