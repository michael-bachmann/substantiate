import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";

const meta = {
  title: "ui/Field",
  component: Field,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty input with a muted placeholder. */
export const Input: Story = {
  args: { placeholder: "Your email (optional)", "aria-label": "Email" },
};

/** Filled input. */
export const InputFilled: Story = {
  args: { defaultValue: "curious@example.com", "aria-label": "Email" },
};

/** Empty textarea (3 rows, non-resizing). */
export const Textarea: Story = {
  args: { multiline: true, placeholder: "What’s on your mind?", "aria-label": "Message" },
};

/** Filled textarea. */
export const TextareaFilled: Story = {
  args: {
    multiline: true,
    defaultValue: "How do I pick a custom date range?",
    "aria-label": "Message",
  },
};
