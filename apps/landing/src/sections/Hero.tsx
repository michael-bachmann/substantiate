import { Button, Eyebrow, CheckIcon, LINKS } from "@substantiate/ui";
import { HeroCard } from "./HeroCard";

const CHIPS = ["Ad-free", "Runs locally", "Never submits claims"];

/** Hero: pitch + install buttons on the left, the receipt card on the right. */
export function Hero() {
  return (
    <section className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-[52px] px-8 pb-14 pt-16">
      <div className="min-w-[300px] flex-[1_1_380px]">
        <Eyebrow tone="accent" size={11}>
          Chrome &amp; Firefox extension
        </Eyebrow>
        <h1 className="mt-4 font-serif text-[54px] font-medium leading-[1.04]">
          Stop saving FSA receipts by hand.
        </h1>
        <p className="mt-5 max-w-[480px] text-[16.5px] leading-[1.6] text-ink2">
          substantiate finds every FSA/HSA-eligible Amazon order and saves a
          tidy PDF receipt for each one — named by date and amount, ready to
          upload to Fidelity, HealthEquity, or wherever you file.
        </p>

        <div className="mt-[30px] flex flex-wrap gap-3">
          <Button
            href={LINKS.chrome}
            variant="primary"
            icon="puzzle"
            sublabel="Free · Add to"
          >
            Chrome
          </Button>
          <Button
            href={LINKS.firefox}
            variant="secondary"
            icon="puzzle"
            iconClassName="text-terra"
            sublabel="Free · Add to"
          >
            Firefox
          </Button>
        </div>

        <div className="mt-[22px] flex flex-wrap gap-x-[18px] gap-y-2 text-[12.5px] text-ink3">
          {CHIPS.map((chip) => (
            <span key={chip} className="flex items-center gap-[6px]">
              <CheckIcon size={13} className="text-terra" /> {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-w-[300px] flex-[0_1_360px] justify-center">
        <HeroCard />
      </div>
    </section>
  );
}
