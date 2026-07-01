import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaqItem } from "./FaqItem";
import { FAQS } from "./faq-data";

const meta = {
  title: "ui/FaqItem",
  component: FaqItem,
} satisfies Meta<typeof FaqItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = { args: { q: FAQS[0].q, a: FAQS[0].a } };

export const Open: Story = { args: { q: FAQS[0].q, a: FAQS[0].a, defaultOpen: true } };

/** Controlled accordion — one item open at a time (the landing's behavior). */
export const Accordion: StoryObj = {
  render: () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    return (
      <div style={{ maxWidth: 600 }}>
        {FAQS.slice(0, 3).map((item, i) => (
          <FaqItem
            key={item.q}
            q={item.q}
            a={item.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
          />
        ))}
      </div>
    );
  },
};
