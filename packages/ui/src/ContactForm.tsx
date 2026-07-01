import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { CheckIcon } from "./icons";
import { submitWeb3Forms, type Web3FormsPayload } from "./web3forms";

interface ContactFormProps {
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  /** Placeholder for the message textarea. */
  placeholder?: string;
  /** Submit button label. */
  cta?: string;
  /** Web3Forms subject line (also distinguishes Contact vs Bug submissions). */
  subject?: string;
  sentTitle?: string;
  sentBlurb?: string;
  /**
   * Send handler seam — defaults to the real Web3Forms call. Injected in
   * stories/tests to force deterministic sending / sent / error states.
   */
  submit?: (payload: Web3FormsPayload) => Promise<void>;
}

type Status = "idle" | "sending" | "sent";

// Shared input styling (email + textarea): field fill, hairline border that
// turns terracotta on focus, control radius.
const FIELD =
  "w-full box-border bg-field border border-rule rounded-control px-[12px] py-[11px] text-[13px] font-medium font-sans text-ink outline-none transition-colors focus:border-terra";

/**
 * Prop-driven contact form (landing "Ask a question" + "Report a bug" share it,
 * different copy). Message is required; email optional. idle → sending → sent
 * (SENT stamp + "Send another") or → error line, staying idle so the user can
 * retry. Submits via Web3Forms unless a `submit` seam is injected.
 */
export function ContactForm({
  eyebrow = "Questions?",
  heading = "Still curious? Ask away.",
  blurb = "Drop a line and we usually reply within a day. No account, no spam.",
  placeholder = "What’s on your mind?",
  cta = "Send message",
  subject = "substantiate · Contact",
  sentTitle = "Thanks for reaching out.",
  sentBlurb = "We read every message and usually reply within a day.",
  submit = submitWeb3Forms,
}: ContactFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState(false);

  const messageReady = message.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!messageReady || status === "sending") return;
    setStatus("sending");
    setError(false);
    try {
      await submit({ subject, from_name: "substantiate landing", email, message });
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(true);
    }
  }

  function reset() {
    setStatus("idle");
    setError(false);
    setEmail("");
    setMessage("");
  }

  const card =
    "bg-paper2 border border-rule rounded-card px-[26px] py-[24px] text-ink font-sans";

  if (status === "sent") {
    return (
      <div className={card} role="status">
        <div className="flex items-center gap-4">
          <div className="flex flex-none items-center gap-[7px] rounded-[7px] border-2 border-terra px-[11px] pt-[6px] pb-[5px] text-terra rotate-[-7deg] outline outline-[1.5px] outline-terra outline-offset-[2.5px]">
            <CheckIcon size={13} strokeWidth={3} />
            <span className="font-mono text-[12px] font-medium tracking-[0.18em]">
              SENT
            </span>
          </div>
          <div className="flex-1">
            <div className="font-serif text-[22px] leading-[1.1]">{sentTitle}</div>
            <div className="mt-1 text-[13px] leading-[1.5] text-ink2">
              {sentBlurb}{" "}
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer font-bold text-terra transition-colors hover:text-terra-d"
              >
                Send another ›
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className={card} onSubmit={handleSubmit} noValidate>
      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-[200px] flex-[1_1_220px]">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-terra-d">
            {eyebrow}
          </div>
          <div className="mt-[7px] font-serif text-[24px] leading-[1.12]">
            {heading}
          </div>
          <div className="mt-[7px] text-[13.5px] leading-[1.55] text-ink2">
            {blurb}
          </div>
        </div>
        <div className="min-w-[250px] flex-[1_1_280px]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
            aria-label="Your email (optional)"
            className={FIELD}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={placeholder}
            aria-label="Message"
            className={`${FIELD} mt-[9px] resize-none leading-[1.5]`}
          />
          {error && (
            <div
              role="alert"
              className="mt-[9px] text-[11.5px] leading-[1.45] text-terra-d"
            >
              Couldn’t send just now — check your connection and try again.
            </div>
          )}
          <div className="mt-[11px]">
            <Button
              type="submit"
              variant="primary"
              block
              busy={status === "sending"}
              busyLabel="Sending…"
              disabled={!messageReady}
            >
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
