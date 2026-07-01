import { Button, CoffeeIcon, LINKS } from "@substantiate/ui";

/** Closing CTA — the constrained "buy me a coffee" band. */
export function Support() {
  return (
    <section className="border-y-[1.5px] border-dashed border-dash bg-paper2">
      <div className="mx-auto flex max-w-[600px] flex-col items-center px-8 py-[54px] text-center">
        <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[15px] bg-terra-t text-terra">
          <CoffeeIcon size={28} />
        </div>
        <h2 className="mt-4 font-serif text-[28px] font-medium leading-[1.12]">
          Like substantiate? Buy me a coffee.
        </h2>
        <p className="mt-2 max-w-[400px] text-[14px] leading-[1.55] text-ink2">
          It’s free, open-source, and ad-free. A coffee helps keep it that way.
        </p>
        <div className="mt-[22px]">
          <Button href={LINKS.buymeacoffee} variant="primary" icon="coffee">
            Buy me a coffee · $3
          </Button>
        </div>
      </div>
    </section>
  );
}
