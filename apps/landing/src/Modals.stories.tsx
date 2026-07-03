import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactModal } from "./components/ContactModal";

// The landing modals: a shadcn Dialog (dimmed + blurred backdrop) wrapping the
// shared ContactForm. Rendered forced-open so the storyboard shows the dialog
// without interaction. A static onOpenChange keeps them deterministically open.
const meta: Meta<typeof ContactModal> = {
  title: "Landing/Modals",
  component: ContactModal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ContactModal>;

const noop = () => {};

/** "Ask a question" — ContactForm defaults, inside the dialog. */
export const Contact: Story = {
  name: "Contact",
  render: () => (
    <ContactModal open onOpenChange={noop} title="Ask a question" />
  ),
};

/** "Report a bug" — same dialog, bug-report copy. */
export const Bug: Story = {
  name: "Bug report",
  render: () => (
    <ContactModal
      open
      onOpenChange={noop}
      title="Report a bug"
      eyebrow="Report a bug"
      heading="Found something broken?"
      blurb="Tell us what happened and we’ll dig in — steps to reproduce help a lot."
      placeholder="What went wrong? What did you expect to happen?"
      cta="Send report"
      subject="substantiate · Bug report"
      sentTitle="Report sent."
      sentBlurb="Thanks — we read every report and chase the gnarly ones first."
    />
  ),
};

/** The SENT confirmation state, via ContactForm's injected `submit` seam. */
export const ContactSent: Story = {
  name: "Contact · sent",
  render: () => (
    <ContactModal
      open
      onOpenChange={noop}
      title="Ask a question"
      submit={() => Promise.resolve()}
    />
  ),
  play: async ({ canvasElement }) => {
    // Dialog portals to document.body, so query the whole document, not the
    // story canvas. Fill the message + submit to reach the SENT stamp.
    const root = canvasElement.ownerDocument.body;
    const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));
    const textarea = root.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, "The saved PDF filename is missing the amount.");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await wait();
    const submit = root.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    submit.click();
    await wait();
  },
};
