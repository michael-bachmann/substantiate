import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "ui/Eyebrow",
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Muted tone (ink3) — the default section label. */
export const Muted: Story = { args: { children: "How it works" } };

/** Accent tone (terra-d) — status / emphasis labels. */
export const Accent: Story = { args: { children: "Eligible · 2026", tone: "accent" } };
