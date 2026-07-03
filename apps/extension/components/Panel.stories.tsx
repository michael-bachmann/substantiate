import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import Panel from "./Panel";
import type { ExportResult, ExportSummary } from "@/lib/types";

// A finished-walk summary for the terminal stories. `saved` filenames follow the
// export naming (`Amazon_YYYY-MM-DD_$amount.pdf`) so the Done tape derives its
// dates + subtotal exactly as production would.
const saved = (date: string, cents: number): ExportResult => ({
  orderId: date,
  status: "saved",
  filename: `Amazon_${date}_$${(cents / 100).toFixed(2)}.pdf`,
  fsaEligibleCents: cents,
});
const doneSummary: ExportSummary = {
  saved: [
    saved("2026-06-25", 5486),
    saved("2026-06-18", 1820),
    saved("2026-06-11", 12940),
    saved("2026-06-02", 4299),
    saved("2026-05-21", 2310),
  ],
  skipped: [{ orderId: "x", status: "skipped", reason: "already-saved" }],
  errors: [],
  signedOut: false,
  ordersConsidered: 34,
};

// Device chrome mimicking the prototype: a fixed 380×644 rounded panel with the
// warm border + soft shadow, clipping the panel's scroll to the frame.
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[644px] w-[380px] overflow-hidden rounded-card border border-[#E0D2BC] shadow-panel">
      {children}
    </div>
  );
}

const meta = {
  title: "extension/Panel",
  component: Panel,
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

// 2026 preselected, disclosure closed → "Start saving" enabled (the app default).
export const Default: Story = {};

// Last year chosen instead.
export const Year2025: Story = {
  name: "2025 selected",
  args: { initialYear: 2025 },
};

// Disclosure expanded with no range yet: a year is still selected, so the CTA
// stays enabled; the calendar shows an empty grid and "From" is the next pick.
export const CustomRangeOpen: Story = {
  name: "Custom range open (empty)",
  args: { initialRangeOpen: true },
};

// Start picked (from only): range mode, so year tiles deselect and "Using"
// shows, but the CTA is disabled until the "To" end is picked next.
export const RangeStartPicked: Story = {
  name: "Range start picked",
  args: {
    initialMode: "range",
    initialRangeOpen: true,
    initialRange: { from: new Date(2026, 5, 8), to: undefined },
  },
};

// Full range: both ends picked, the band renders, the "Using" tag shows, year
// tiles are deselected, and the CTA is enabled.
export const RangeFull: Story = {
  name: "Range complete",
  args: {
    initialMode: "range",
    initialRangeOpen: true,
    initialRange: { from: new Date(2026, 5, 8), to: new Date(2026, 5, 22) },
  },
};

// Home on Firefox: the Chrome-only gate disables "Start saving" and swaps the
// reassurance line for the "desktop Chrome / Firefox soon" note.
export const HomeBlocked: Story = {
  name: "Home — Firefox blocked",
  args: { blocked: true },
};

// Saving, collecting phase: paging the order list, count unknown — the calm
// indeterminate state. Seeded frames render statically and never message.
export const SavingCollecting: Story = {
  name: "Saving — collecting",
  args: { initialView: "saving", initialPhase: "collecting" },
};

// Saving, exporting phase: a few receipts saved, the determinate bar at 3 of 8.
export const SavingExporting: Story = {
  name: "Saving — exporting",
  args: {
    initialView: "saving",
    initialPhase: "exporting",
    initialIndex: 3,
    initialTotal: 8,
    initialRows: [
      { date: "Jun 25, 2026", amount: "$54.86" },
      { date: "Jun 18, 2026", amount: "$18.20" },
      { date: "Jun 11, 2026", amount: "$129.40" },
    ],
    initialSubtotalCents: 20246,
  },
};

// Done: five saved, the SAVED stamp, the total, "+ 2 more", and the
// "skipped 1 already saved" note.
export const DoneAll: Story = {
  name: "Done",
  args: { initialView: "done", initialSummary: doneSummary },
};

// Done, zero-found: a clean walk that turned up nothing eligible — the calm
// empty state instead of the receipt tape.
export const DoneZero: Story = {
  name: "Done — nothing found",
  args: {
    initialView: "done",
    initialSummary: {
      saved: [],
      skipped: [],
      errors: [],
      signedOut: false,
      ordersConsidered: 12,
    },
  },
};

// Done, but some orders couldn't be read: no saves + an error count, so the
// empty state says "couldn't finish" rather than "nothing eligible".
export const DoneErrors: Story = {
  name: "Done — some unreadable",
  args: {
    initialView: "done",
    initialSummary: {
      saved: [],
      skipped: [],
      errors: [
        { orderId: "a", status: "error", message: "read failed" },
        { orderId: "b", status: "error", message: "read failed" },
      ],
      signedOut: false,
      ordersConsidered: 5,
    },
  },
};

// Signed out before anything saved: the sign-in notice.
export const SignedOut: Story = {
  name: "Signed out",
  args: { initialView: "signedout" },
};

// A walk that failed: the error notice carrying the message.
export const ScanError: Story = {
  name: "Error",
  args: {
    initialView: "error",
    initialError: "Couldn't open the Amazon tab. Check your connection and try again.",
  },
};

// ── Help & about overlay ──────────────────────────────────────────────────
// This Storybook has no @storybook/test, so the play function drives the form
// with plain DOM APIs. React ignores a raw `el.value =`, so we call the native
// value setter and dispatch an `input` event to trip onChange (as ContactForm).
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms));

// Help opened: coffee card, first FAQ expanded, both disclosures collapsed.
export const HelpOpen: Story = {
  name: "Help — open",
  args: { initialHelpOpen: true },
};

// "Request a retailer" expanded to its inline form.
export const HelpRequestOpen: Story = {
  name: "Help — request a retailer",
  args: { initialHelpOpen: true, initialReqOpen: true },
};

// "Report an issue" expanded to its inline form (multiline).
export const HelpReportOpen: Story = {
  name: "Help — report an issue",
  args: { initialHelpOpen: true, initialBugOpen: true },
};

// Sent confirmation: an injected resolving submit + a play function that fills
// the retailer field and submits → the inline "Request received." state.
export const HelpRequestSent: Story = {
  name: "Help — request sent",
  args: {
    initialHelpOpen: true,
    initialReqOpen: true,
    submit: () => Promise.resolve(),
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("input") as HTMLInputElement;
    setValue(input, "CVS");
    await tick();
    const submit = canvasElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    submit.click();
    await tick();
  },
};
