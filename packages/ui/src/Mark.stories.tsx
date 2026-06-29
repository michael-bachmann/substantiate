import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mark, BrandRow } from "./Mark";

const meta = {
  title: "ui/Mark",
  component: Mark,
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 48 } };
export const Brand: StoryObj = { render: () => <BrandRow size={28} /> };
