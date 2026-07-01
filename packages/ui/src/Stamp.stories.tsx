import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stamp } from "./Stamp";

const meta = {
  title: "ui/Stamp",
  component: Stamp,
} satisfies Meta<typeof Stamp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default SAVED stamp (the receipt-card motif). */
export const Saved: Story = {};

/** SENT — the ContactForm variant (rotated -7, full opacity). */
export const Sent: Story = { args: { label: "SENT", rotate: -7 } };

/** As it sits on a card: slightly faded. */
export const OnCard: Story = { args: { className: "opacity-90" } };
