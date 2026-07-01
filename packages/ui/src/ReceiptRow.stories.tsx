import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReceiptRow } from "./ReceiptRow";
import { ReceiptCard } from "./ReceiptCard";

const meta = {
  title: "ui/ReceiptRow",
  component: ReceiptRow,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReceiptRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A normal dotted-leader row. */
export const Default: Story = {
  args: { left: "Amazon_2026-06-25", right: "$54.86" },
};

/** A long filename, clipped with `truncate` (the Done view). */
export const Truncated: Story = {
  args: {
    left: "Amazon_order_112-8845201-2026-06-25_receipt.pdf",
    right: "$129.40",
    truncate: true,
  },
};

/** Stacked inside a receipt card — the real hero/Done context. */
export const InCard: StoryObj = {
  render: () => (
    <ReceiptCard>
      <ReceiptRow left="Amazon_2026-06-25" right="$54.86" />
      <ReceiptRow left="Amazon_2026-06-11" right="$129.40" />
      <ReceiptRow left="Amazon_2026-06-02" right="$18.20" />
    </ReceiptCard>
  ),
};
