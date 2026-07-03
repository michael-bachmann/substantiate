import { Logo, Button, LINKS } from "@substantiate/ui";

/** Top bar: brand left; anchor links + a compact "Add to browser" CTA right. */
export function Nav() {
  return (
    <header className="border-b-[1.5px] border-dashed border-dash">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-x-[26px] gap-y-3 px-8 py-[18px]">
        <Logo />
        <nav className="ml-auto flex flex-wrap items-center gap-x-[26px] gap-y-3">
          <a
            href="#how"
            className="text-[14px] font-semibold text-ink2 transition-colors hover:text-ink"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="text-[14px] font-semibold text-ink2 transition-colors hover:text-ink"
          >
            FAQ
          </a>
          <Button
            href={LINKS.chrome}
            variant="primary"
            sm
            icon="puzzle"
            aria-label="Add substantiate to your browser"
          >
            Add to browser
          </Button>
        </nav>
      </div>
    </header>
  );
}
