import { Logo, Eyebrow, LINKS } from "@substantiate/ui";

const LINK_CLASS =
  "text-[14px] text-ink2 no-underline transition-colors hover:text-terra-d";

/** Site footer: brand + tagline, two link columns, and a mono bottom bar. */
export function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-[1080px] flex-wrap gap-9 px-8 pb-[34px] pt-[44px]">
        <div className="min-w-[240px] flex-[1_1_280px]">
          <Logo />
          <p className="mt-[14px] max-w-[280px] text-[13.5px] leading-[1.6] text-ink2">
            FSA/HSA receipts, handled. Built by a fellow FSA-haver tired of
            saving PDFs one by one.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-[56px] gap-y-8">
          <div>
            <Eyebrow className="mb-[13px]">Get it</Eyebrow>
            <div className="flex flex-col gap-[10px]">
              <a
                href={LINKS.chrome}
                target="_blank"
                rel="noopener"
                className={LINK_CLASS}
              >
                Chrome Web Store
              </a>
              <a
                href={LINKS.firefox}
                target="_blank"
                rel="noopener"
                className={LINK_CLASS}
              >
                Firefox Add-ons
              </a>
            </div>
          </div>
          <div>
            <Eyebrow className="mb-[13px]">Project</Eyebrow>
            <div className="flex flex-col gap-[10px]">
              <a href="#faq" className={LINK_CLASS}>
                FAQ
              </a>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener"
                className={LINK_CLASS}
              >
                GitHub
              </a>
              {/* Inert placeholder — PR 5 wires this to the bug-report modal. */}
              <button type="button" className={`text-left ${LINK_CLASS}`}>
                Report a bug
              </button>
              <a
                href={LINKS.privacy}
                target="_blank"
                rel="noopener"
                className={LINK_CLASS}
              >
                Privacy
              </a>
              <a href={`mailto:${LINKS.email}`} className={LINK_CLASS}>
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-dash">
        <div className="mx-auto flex max-w-[1080px] flex-wrap justify-between gap-[10px] px-8 py-[18px] font-mono text-[11px] text-ink3">
          <span>© 2026 substantiate</span>
          <span>
            substantiate.dev · not affiliated with Amazon, Fidelity, or
            HealthEquity
          </span>
        </div>
      </div>
    </footer>
  );
}
