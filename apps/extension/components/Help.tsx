import { useState, type FormEvent, type ReactNode } from "react";
import {
  Logo,
  Eyebrow,
  Field,
  Button,
  FaqItem,
  FAQS,
  CheckIcon,
  CoffeeIcon,
  StorefrontIcon,
  AlertTriangleIcon,
  ExternalLinkIcon,
  LINKS,
  submitWeb3Forms,
  type Web3FormsPayload,
} from "@substantiate/ui";

// Displayed in the About footer. Kept as a local constant, not read from the
// manifest — keep in sync with the manifest version by hand for now.
const VERSION = "v0.1";

interface HelpProps {
  onClose: () => void;
  /** Stories: seed a disclosure expanded. */
  initialReqOpen?: boolean;
  initialBugOpen?: boolean;
  /**
   * Send seam forwarded to both disclosures — defaults to the real Web3Forms
   * call. Injected in stories to force deterministic sending / sent / error.
   */
  submit?: (payload: Web3FormsPayload) => Promise<void>;
}

/**
 * Help & about overlay — an absolute layer over the panel (opened by the header
 * `···`, closed by `×`). A dashed header over a scrolling body: the coffee card,
 * the FAQ accordion, the two inline Get-involved disclosures, and the links +
 * version footer. Composed from the shared kit.
 */
export function Help({ onClose, initialReqOpen, initialBugOpen, submit }: HelpProps) {
  return (
    <div className="absolute inset-0 z-[5] flex flex-col bg-paper">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-[11px] border-b-[1.5px] border-dashed border-dash px-4 py-[14px]">
        <Logo compact />
        <div className="text-[15.5px] font-extrabold tracking-[-0.03em]">Help &amp; about</div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close help"
          className="ml-auto cursor-pointer px-1 text-[20px] leading-none text-ink3 transition hover:text-ink"
        >
          &times;
        </button>
      </div>

      {/* Scrolling body */}
      <div className="flex-1 overflow-auto p-4">
        {/* Coffee card */}
        <div className="rounded-[13px] border border-dashed border-dash bg-paper2 p-[15px]">
          <div className="font-serif text-[21px] leading-[1.1]">Enjoying substantiate?</div>
          <div className="mt-[5px] text-[12.5px] leading-[1.5] text-ink2">
            It&rsquo;s free and ad-free. A coffee keeps it maintained.
          </div>
          {/* One-off espresso-dark button (not terracotta) — a local styled
              anchor rather than a speculative shared Button variant. */}
          <a
            href={LINKS.buymeacoffee}
            target="_blank"
            rel="noopener"
            className="mt-[13px] box-border flex w-full items-center justify-center gap-[9px] rounded-button bg-espresso px-3 py-3 text-[13.5px] font-bold text-paper2 no-underline transition hover:bg-[#1f1b16]"
          >
            <CoffeeIcon size={16} />
            Buy me a coffee &middot; $3
          </a>
        </div>

        {/* Frequently asked */}
        <Eyebrow className="mt-[22px] mb-1">Frequently asked</Eyebrow>
        {FAQS.map((f, i) => (
          <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
        ))}
        <div className="border-t border-dashed border-dash" />

        {/* Get involved */}
        <Eyebrow className="mt-[22px] mb-[9px]">Get involved</Eyebrow>
        <div className="flex flex-col gap-2">
          <InlineDisclosure
            icon={<StorefrontIcon size={18} strokeWidth={1.7} />}
            title="Request a retailer"
            subtitle="Tell us where to expand next"
            fieldPlaceholder="Which store? CVS, Walgreens…"
            payloadKey="retailer"
            subject="substantiate · Retailer request"
            cta="Send request"
            sentTitle="Request received."
            sentBlurb="Thanks — we add the most-requested stores first."
            sentCta="Request another ›"
            defaultOpen={initialReqOpen}
            submit={submit}
          />
          <InlineDisclosure
            icon={<AlertTriangleIcon size={18} />}
            title="Report an issue"
            subtitle="Something broken? Let us know"
            fieldPlaceholder="I picked 2025 and hit Start saving, then…"
            multiline
            payloadKey="issue"
            subject="substantiate · Bug report"
            cta="Send report"
            sentTitle="Report sent."
            sentBlurb="Thanks — we read every one and chase the gnarly ones first."
            sentCta="Report another ›"
            defaultOpen={initialBugOpen}
            submit={submit}
          />
        </div>

        {/* Links */}
        <Eyebrow className="mt-[22px] mb-1">Links</Eyebrow>
        <LinkRow label="Website" href={LINKS.website} display="substantiate.dev" />
        <LinkRow
          label="Privacy policy"
          href={LINKS.privacy}
          display="substantiate.dev/privacy"
          bottomRule
        />
        <div className="mt-[18px] text-center font-mono text-[10px] tracking-[0.1em] text-ink3">
          substantiate {VERSION}
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  display,
  bottomRule = false,
}: {
  label: string;
  href: string;
  display: string;
  bottomRule?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`flex items-center gap-[11px] border-t border-dashed border-dash py-3 text-inherit no-underline ${
        bottomRule ? "border-b" : ""
      }`}
    >
      <span className="flex-1 text-[13px] font-semibold">{label}</span>
      <span className="font-mono text-[11px] text-ink2">{display}</span>
      <span className="flex text-ink3">
        <ExternalLinkIcon size={13} />
      </span>
    </a>
  );
}

type Status = "idle" | "sending" | "sent";

interface InlineDisclosureProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  /** Placeholder for the required primary field. */
  fieldPlaceholder: string;
  /** Render the primary field as a textarea (bug report) vs a single line. */
  multiline?: boolean;
  /** Web3Forms payload key carrying the primary field's value. */
  payloadKey: "retailer" | "issue";
  subject: string;
  cta: string;
  sentTitle: string;
  sentBlurb: string;
  sentCta: string;
  defaultOpen?: boolean;
  submit?: (payload: Web3FormsPayload) => Promise<void>;
}

/**
 * One Get-involved disclosure: a clickable header that expands an inline form
 * (NOT a modal). The primary field is required; email optional. Mirrors
 * ContactForm's idle → sending → sent (inline confirmation + "another") / error
 * machine, driven through the injected `submit` seam. Shared by the Request /
 * Report rows — only copy, icon, field, and payload key differ.
 */
function InlineDisclosure({
  icon,
  title,
  subtitle,
  fieldPlaceholder,
  multiline = false,
  payloadKey,
  subject,
  cta,
  sentTitle,
  sentBlurb,
  sentCta,
  defaultOpen = false,
  submit = submitWeb3Forms,
}: InlineDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState(false);

  const ready = value.trim() !== "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    setError(false);
    try {
      await submit({
        subject,
        from_name: "substantiate extension",
        [payloadKey]: value,
        email,
      });
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(true);
    }
  }

  function reset() {
    setStatus("idle");
    setError(false);
    setValue("");
    setEmail("");
  }

  return (
    <div className="overflow-hidden rounded-[11px] border border-rule bg-paper2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-[13px] py-3 text-left"
      >
        <span className="flex flex-none text-terra">{icon}</span>
        <span className="flex-1">
          <span className="block text-[13.5px] font-bold">{title}</span>
          <span className="mt-px block text-[11.5px] text-ink3">{subtitle}</span>
        </span>
        <span className="w-[14px] flex-none text-center text-[17px] leading-none text-terra">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="border-t border-dashed border-dash p-[13px]">
          {status === "sent" ? (
            <div className="flex items-start gap-[10px]" role="status">
              <span className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full bg-terra-t text-terra">
                <CheckIcon size={11} strokeWidth={3} />
              </span>
              <div className="flex-1">
                <div className="text-[13px] font-bold">{sentTitle}</div>
                <div className="mt-[2px] text-[11.5px] leading-[1.5] text-ink3">{sentBlurb}</div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 cursor-pointer text-[11.5px] font-bold text-terra"
                >
                  {sentCta}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {multiline ? (
                <Field
                  multiline
                  rows={3}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={fieldPlaceholder}
                  aria-label={title}
                />
              ) : (
                <Field
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={fieldPlaceholder}
                  aria-label={title}
                />
              )}
              <Field
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                aria-label="Email (optional)"
                className="mt-2"
              />
              {error && (
                <div role="alert" className="mt-[9px] text-[11.5px] leading-[1.45] text-terra-d">
                  Couldn&rsquo;t send just now — check your connection and try again.
                </div>
              )}
              <div className="mt-[10px]">
                <Button
                  type="submit"
                  variant="primary"
                  block
                  sm
                  busy={status === "sending"}
                  busyLabel="Sending…"
                  disabled={!ready}
                >
                  {cta}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
