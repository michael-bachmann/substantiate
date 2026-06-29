import type { Meta, StoryObj } from "@storybook/react-vite";
import Panel from "./Panel";

const meta = {
  title: "extension/Panel",
  component: Panel,
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
