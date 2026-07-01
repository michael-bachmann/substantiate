import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactForm } from "./ContactForm";

const meta = {
  title: "ui/ContactForm",
  component: ContactForm,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// This Storybook has no @storybook/test, so the play functions below drive the
// component with plain DOM APIs. React ignores a raw `el.value =`, so we call
// the native value setter and dispatch an `input` event to trip its onChange.
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const tick = (ms = 60) => new Promise((r) => setTimeout(r, ms));

async function fill(canvas: HTMLElement) {
  const email = canvas.querySelector("input") as HTMLInputElement;
  const message = canvas.querySelector("textarea") as HTMLTextAreaElement;
  setValue(email, "curious@example.com");
  setValue(message, "How do I pick a custom date range?");
  await tick();
}

async function fillAndSend(canvas: HTMLElement) {
  await fill(canvas);
  const submit = canvas.querySelector('button[type="submit"]') as HTMLButtonElement;
  submit.click();
  await tick();
}

/** Idle, empty — submit disabled until the message has content. */
export const Empty: Story = {};

/** Both fields populated (message present → submit enabled). */
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    await fill(canvasElement);
  },
};

/** Busy state: an injected send that never resolves keeps the "Sending…" pill. */
export const Sending: Story = {
  args: { submit: () => new Promise<void>(() => {}) },
  play: async ({ canvasElement }) => {
    await fillAndSend(canvasElement);
  },
};

/** Success confirmation: injected send resolves instantly → SENT stamp. */
export const Sent: Story = {
  args: { submit: () => Promise.resolve() },
  play: async ({ canvasElement }) => {
    await fillAndSend(canvasElement);
  },
};

/** Failure: injected send rejects → inline error line, form stays editable. */
export const Error: Story = {
  args: { submit: () => Promise.reject(new Error("network")) },
  play: async ({ canvasElement }) => {
    await fillAndSend(canvasElement);
  },
};

/** The landing's "Report a bug" copy — same component, alternate strings. */
export const BugReport: Story = {
  args: {
    eyebrow: "Report a bug",
    heading: "Found something broken?",
    blurb: "Tell us what happened and we’ll dig in — steps to reproduce help a lot.",
    placeholder: "What went wrong? What did you expect to happen?",
    cta: "Send report",
    subject: "substantiate · Bug report",
    sentTitle: "Report sent.",
    sentBlurb: "Thanks — we read every report and chase the gnarly ones first.",
  },
};
