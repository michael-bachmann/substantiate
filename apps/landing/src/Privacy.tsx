import type { ReactNode } from "react";
import { Logo, ShieldCheckIcon, CheckIcon, LINKS } from "@substantiate/ui";

const UPDATED = "July 3, 2026";

/**
 * The substantiate Privacy Policy — its own static page (privacy.html entry),
 * kept accurate to how the product actually works: everything happens locally
 * in your browser, the only thing that leaves your device is a feedback message
 * you choose to send. Composed from small local helpers (there's just one legal
 * page, so no shared primitive system) styled in the site's paper tokens.
 */
export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 pb-[72px] pt-14">
      <a href="/" className="inline-block" aria-label="Back to substantiate home">
        <Logo />
      </a>

      <div className="mb-9 mt-8 border-b border-dashed border-dash pb-7">
        <h1 className="font-serif text-[clamp(30px,4.4vw,42px)] font-medium tracking-[-0.02em] text-ink">
          Privacy Policy
        </h1>
        <p className="mt-3 font-mono text-[13px] text-ink3">Last updated {UPDATED}</p>
      </div>

      <Tldr>
        substantiate finds your FSA/HSA-eligible Amazon orders and saves a PDF
        receipt for each one — <b>entirely on your own computer</b>. It runs in
        your browser using your existing Amazon session, and there is no
        substantiate server that could receive your data. The only thing that
        ever leaves your device is a message you choose to send us through a
        feedback form. No analytics, no trackers, no ads, and we never sell your
        data.
      </Tldr>

      <Section title="Who this covers">
        <p>
          This policy applies to the substantiate browser extension and this
          website, <a href={LINKS.website}>substantiate.dev</a>. substantiate is
          an independent project and is not affiliated, associated, or
          officially connected with Amazon, Fidelity, HealthEquity, or any other
          retailer or benefits administrator.
        </p>
      </Section>

      <Section title="What substantiate does with your data">
        <p>
          substantiate’s whole job is to turn your eligible Amazon orders into
          tidy PDF receipts you can file with your FSA/HSA administrator.
          Everything that touches your data happens on your own device.
        </p>

        <h3>Your orders — read locally, never sent to us</h3>
        <p>
          When you run a scan, substantiate reads your recent Amazon
          transactions and printable invoice pages from your own logged-in
          Amazon session: order dates, amounts, and which items Amazon marks
          FSA/HSA-eligible. This all happens <b>inside your browser</b>. Your
          order history is never transmitted to a substantiate server — we don’t
          operate a server that could receive it, and we couldn’t read it if we
          wanted to.
        </p>

        <h3>Your receipts — saved straight to your computer</h3>
        <p>
          Each eligible order is rendered to a PDF and saved to your browser’s
          downloads folder, named by date and amount (for example,{" "}
          <b>Amazon_2026-06-25_$54.86.pdf</b>). Those files live on your disk.
          substantiate never uploads them, and we never see them.
        </p>

        <h3>No Amazon login, ever</h3>
        <p>
          substantiate uses the Amazon session you’re already signed into. It
          never sees, stores, or transmits your Amazon username or password.
        </p>
      </Section>

      <Section title="Where your data goes">
        <p>These are the only external connections substantiate makes:</p>
        <DataTable
          rows={[
            [
              "Amazon",
              <>
                substantiate reads order and invoice pages from your own
                logged-in session. Nothing is sent <i>to</i> Amazon beyond the
                normal page requests your browser already makes.
              </>,
              "When you run a scan.",
            ],
            [
              "Web3Forms",
              "Only the message and (optional) email you type into a feedback form.",
              <>
                Only when you submit “Request a retailer,” “Report an issue,” or
                a contact form.
              </>,
            ],
          ]}
        />
        <Callout>
          There are no analytics SDKs, advertising networks, fingerprinting, or
          third-party trackers anywhere in substantiate.
        </Callout>
        <p>
          Our use of the data substantiate accesses follows the Chrome Web
          Store’s Limited Use requirements: we use it solely to provide the
          receipt-saving feature, never for advertising, and we never sell it or
          transfer it to anyone else.
        </p>
      </Section>

      <Section title="What the extension can access">
        <p>
          To do its job, the extension asks your browser for a few permissions.
          Here’s what each is for:
        </p>
        <List>
          <li>
            <b>Access to amazon.com pages:</b> so it can read your order list and
            invoice pages during a scan.
          </li>
          <li>
            <b>Browser tabs:</b> so it can open and drive the Amazon tab it works
            through during a scan.
          </li>
          <li>
            <b>Downloads:</b> so it can save each receipt PDF to your computer.
          </li>
          <li>
            <b>Rendering the Amazon tab to PDF:</b> substantiate uses your
            browser’s built-in print-to-PDF to turn each invoice into a clean
            receipt. This runs through the browser’s developer protocol, attached
            only to the Amazon tab and only while a scan is running. It’s used
            purely to generate the PDF locally — nothing about the page is
            transmitted anywhere.
          </li>
          <li>
            <b>Local storage:</b> to remember which orders it has already saved,
            so it doesn’t download duplicates.
          </li>
        </List>
      </Section>

      <Section title="What we store">
        <List>
          <li>
            <b>On your device:</b> the list of order IDs substantiate has already
            saved, so a repeat scan skips receipts you already have. This lives
            in your browser’s local extension storage, not on our servers, and is
            kept until you uninstall the extension or clear it.
          </li>
          <li>
            <b>On our side:</b> nothing about your orders or receipts. The only
            personal data we ever receive is what you choose to send through a
            feedback form — used solely to reply to you.
          </li>
        </List>
      </Section>

      <Section title="Feedback you send us">
        <p>
          If you submit a feedback form, your message is delivered to us by email
          through{" "}
          <a href="https://web3forms.com" target="_blank" rel="noreferrer">
            Web3Forms
          </a>
          , a form-relay service. If you include your email address, we use it
          only to respond. We don’t add you to any mailing list, and we delete
          correspondence we no longer need.
        </p>
      </Section>

      <Section title="Your choices">
        <List>
          <li>
            <b>Uninstall anytime:</b> removing the extension deletes its local
            storage, including the saved-order list.
          </li>
          <li>
            <b>Your receipts are yours:</b> the PDFs are saved to your computer —
            manage or delete them like any other file.
          </li>
          <li>
            <b>Skip the forms:</b> every feedback form is optional, and the email
            field within it is optional too.
          </li>
          <li>
            <b>Delete on request:</b> because we keep nothing about your orders,
            there’s nothing on our side to erase. For any feedback message you’ve
            emailed us, write to{" "}
            <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a> and we’ll delete
            it.
          </li>
        </List>
      </Section>

      <Section title="Children">
        <p>
          substantiate is intended for adults managing their own FSA/HSA receipts
          and is not directed to children under 13.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we change how substantiate handles data, we’ll update this page and
          the “last updated” date above. Material changes will also be noted in
          the extension’s release notes.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy? Email{" "}
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a> or open an issue on{" "}
          <a href={LINKS.issues} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </Section>
    </main>
  );
}

/** Brand-tinted "short version" callout at the top of the page. */
function Tldr({ children }: { children: ReactNode }) {
  return (
    <div className="mb-9 flex items-start gap-[14px] rounded-card bg-terra-t px-[22px] py-5">
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-tile bg-terra text-paper2">
        <ShieldCheckIcon size={20} />
      </span>
      <p className="text-[14.5px] leading-[1.6] text-ink2 [&_b]:font-[650] [&_b]:text-ink">
        {children}
      </p>
    </div>
  );
}

/** A titled section of prose; descendant p/h3/a/b are styled here so section
 *  bodies read as plain markup. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-[34px] [&_a:hover]:underline [&_a]:font-semibold [&_a]:text-terra [&_b]:font-[650] [&_b]:text-ink [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-ink [&_p:last-child]:mb-0 [&_p]:mb-3 [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-ink2">
      <h2 className="mb-3 font-serif text-[22px] font-medium tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Bulleted list with terracotta dots; `<b>` inside an item is emphasized. */
function List({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-3 flex list-none flex-col gap-[11px] p-0 [&_b]:font-[650] [&_b]:text-ink [&>li]:relative [&>li]:pl-7 [&>li]:text-[16px] [&>li]:leading-[1.6] [&>li]:text-ink2 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-[9px] [&>li]:before:h-[7px] [&>li]:before:w-[7px] [&>li]:before:rounded-full [&>li]:before:bg-terra [&>li]:before:content-['']">
      {children}
    </ul>
  );
}

/** The "where your data goes" service / what / when grid. */
function DataTable({ rows }: { rows: ReactNode[][] }) {
  return (
    <table className="mb-[14px] mt-[6px] w-full border-collapse text-[14.5px]">
      <thead>
        <tr>
          {["Service", "What’s shared", "When"].map((h) => (
            <th
              key={h}
              className="border-b border-rule px-3 py-[11px] text-left align-top font-mono text-[11px] font-bold uppercase tracking-[0.07em] text-ink3"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, r) => (
          <tr key={r}>
            {cells.map((cell, c) => (
              <td
                key={c}
                className="border-b border-rule px-3 py-[11px] text-left align-top leading-[1.5] text-ink2 first:whitespace-nowrap first:font-semibold first:text-ink"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Reassuring "no trackers" callout — flat paper surface with a terracotta check. */
function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-[4px] mb-[14px] flex items-start gap-[11px] rounded-control border border-rule bg-paper2 px-4 py-[14px]">
      <CheckIcon size={18} className="mt-px flex-none text-terra" />
      <p className="text-[14.5px] leading-[1.55] text-ink2">{children}</p>
    </div>
  );
}
