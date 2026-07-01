import { ReceiptCard, ReceiptRow, Stamp, Eyebrow } from "@substantiate/ui";

/** The hero receipt visual — mirrors the extension's Done summary. */
export function HeroCard() {
  return (
    <ReceiptCard className="w-[340px] max-w-full">
      <Stamp className="absolute right-[18px] top-[24px] opacity-90" />
      <Eyebrow tone="accent">Eligible · 2026</Eyebrow>
      <div className="mt-2 font-serif text-[40px] leading-none tabular-nums">
        $640.18
      </div>
      <div className="mt-[6px] font-mono text-[11px] text-ink2">
        12 receipts saved to Downloads
      </div>
      <div className="mb-[4px] mt-[16px] border-t border-dashed border-dash" />
      <ReceiptRow left="Amazon_2026-06-25" right="$54.86" />
      <ReceiptRow left="Amazon_2026-06-11" right="$129.40" />
      <ReceiptRow left="Amazon_2026-06-02" right="$18.20" />
      <div className="pl-[18px] pt-[4px] font-mono text-[10px] text-ink3">
        + 9 more receipts
      </div>
    </ReceiptCard>
  );
}
