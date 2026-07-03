import {
  Eyebrow,
  ShieldCheckIcon,
  LockIcon,
  HandShieldIcon,
} from "@substantiate/ui";
import type { ComponentType } from "react";

interface Point {
  Icon: ComponentType<{ size?: number }>;
  title: string;
  body: string;
}

const POINTS: Point[] = [
  {
    Icon: ShieldCheckIcon,
    title: "Runs entirely in your browser",
    body: "No servers, no uploads. Your orders and PDFs stay on your machine.",
  },
  {
    Icon: LockIcon,
    title: "No account, no password",
    body: "It uses your existing Amazon session — it never sees your login.",
  },
  {
    Icon: HandShieldIcon,
    title: "You file the claims",
    body: "substantiate only saves receipts. Submitting to your portal stays your call.",
  },
];

/** Privacy: the terra-tint accent band. */
export function Privacy() {
  return (
    <section className="bg-terra-t">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-10 px-8 py-[54px]">
        <div className="min-w-[280px] flex-[1_1_300px]">
          <Eyebrow tone="accent" size={11}>
            Private by design
          </Eyebrow>
          <h2 className="mt-[10px] font-serif text-[32px] font-medium leading-[1.12] text-ink">
            Your receipts never leave your computer.
          </h2>
        </div>
        <div className="flex min-w-[280px] flex-[1_1_320px] flex-col gap-[14px]">
          {POINTS.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <span className="mt-px flex flex-none text-terra">
                <Icon size={18} />
              </span>
              <div>
                <div className="text-[14.5px] font-bold text-ink">{title}</div>
                <div className="mt-0.5 text-[13px] leading-[1.55] text-ink2">
                  {body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
