import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import Panel from "./Panel";

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

// Saving, just underway: a couple of receipts found, progress bar barely moved.
// Seeded state renders a static frame — the scan timer only runs on a real
// "Start saving", so these Saving/Done stories don't animate.
export const SavingEarly: Story = {
  name: "Saving — early",
  args: { initialView: "saving", initialChecked: 16, initialFound: 2 },
};

// Saving, about halfway: six receipts found, progress ~50%.
export const SavingMid: Story = {
  name: "Saving — mid",
  args: { initialView: "saving", initialChecked: 60, initialFound: 6 },
};

// Done: all twelve saved, the SAVED stamp, the total, and "+ 9 more receipts".
export const DoneAll: Story = {
  name: "Done",
  args: { initialView: "done", initialChecked: 120, initialFound: 12 },
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
