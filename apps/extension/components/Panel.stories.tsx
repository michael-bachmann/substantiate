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

// 2026 preselected → "Start saving" enabled (the app's default state).
export const Default: Story = {};

// Last year chosen instead.
export const Year2025: Story = {
  name: "2025 selected",
  args: { initialYear: 2025 },
};

// Disclosure expanded; a year is still selected, so the CTA stays enabled and
// the From/To stub shows em-dashes (PR 7 wires the calendar).
export const CustomRangeOpen: Story = {
  name: "Custom range open",
  args: { initialRangeOpen: true },
};

// Range mode with no dates yet: year tiles deselect, the "Using" tag shows, and
// the CTA is disabled until both ends are picked (PR 7).
export const RangeDisabled: Story = {
  name: "Range mode / CTA disabled",
  args: { initialMode: "range", initialRangeOpen: true },
};
