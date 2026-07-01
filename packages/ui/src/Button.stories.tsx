import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "ui/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary", children: "Add to Chrome" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Skip" } };

export const PrimarySm: Story = { args: { variant: "primary", sm: true, children: "Add to browser" } };
export const SecondarySm: Story = { args: { variant: "secondary", sm: true, children: "Cancel" } };
export const GhostSm: Story = { args: { variant: "ghost", sm: true, children: "Skip" } };

export const Block: Story = { args: { variant: "primary", block: true, children: "Start saving", icon: "arrow" } };

export const Busy: Story = {
  args: { variant: "primary", busy: true, busyLabel: "Saving…", children: "Start saving" },
};

export const Disabled: Story = { args: { variant: "primary", disabled: true, children: "Start saving" } };

export const IconPuzzle: Story = { args: { variant: "secondary", icon: "puzzle", children: "Add to browser" } };
export const IconCoffee: Story = { args: { variant: "primary", icon: "coffee", children: "Buy me a coffee · $3" } };
export const IconFolder: Story = { args: { variant: "secondary", icon: "folder", children: "Show in folder" } };
export const IconArrow: Story = { args: { variant: "primary", icon: "arrow", children: "Start saving" } };

export const InstallSublabel: Story = {
  args: { variant: "primary", icon: "puzzle", sublabel: "Free · Add to", children: "Chrome" },
};

export const AsLink: Story = {
  args: { variant: "secondary", href: "https://example.com", icon: "puzzle", children: "Add to Firefox" },
};
