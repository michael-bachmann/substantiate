import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReceiptCard } from "./ReceiptCard";
import { ReceiptRow } from "./ReceiptRow";
import { Stamp } from "./Stamp";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "ui/ReceiptCard",
  component: ReceiptCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 340 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReceiptCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Raised hero card: a Stamp pinned in the corner over receipt rows. */
export const Raised: StoryObj = {
  render: () => (
    <ReceiptCard>
      <Stamp className="absolute right-[18px] top-[24px] opacity-90" />
      <Eyebrow tone="accent">Eligible · 2026</Eyebrow>
      <div className="mt-2 font-serif text-[40px] leading-none">$640.18</div>
      <div className="mt-[6px] font-mono text-[11px] text-ink2">
        12 receipts saved to Downloads
      </div>
      <div className="my-[14px] border-t border-dashed border-dash" />
      <ReceiptRow left="Amazon_2026-06-25" right="$54.86" />
      <ReceiptRow left="Amazon_2026-06-11" right="$129.40" />
      <ReceiptRow left="Amazon_2026-06-02" right="$18.20" />
    </ReceiptCard>
  ),
};

/** Tape variant: dashed inner card, no shadow. */
export const Tape: StoryObj = {
  render: () => (
    <ReceiptCard variant="tape">
      <ReceiptRow left="Amazon_2026-06-25" right="$54.86" />
      <ReceiptRow left="Amazon_2026-06-11" right="$129.40" />
    </ReceiptCard>
  ),
};
