import {
  Eyebrow,
  CalendarIcon,
  FileCheckIcon,
  UploadIcon,
} from "@substantiate/ui";
import type { ComponentType } from "react";

interface Step {
  n: string;
  Icon: ComponentType<{ size?: number }>;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    Icon: CalendarIcon,
    title: "Pick a period",
    body: "Choose this year, last year, or a custom date range that matches your plan year.",
  },
  {
    n: "02",
    Icon: FileCheckIcon,
    title: "It saves the receipts",
    body: "substantiate walks your Amazon orders and downloads a PDF for every FSA/HSA-eligible one — as it finds them.",
  },
  {
    n: "03",
    Icon: UploadIcon,
    title: "You upload & file",
    body: "Hand the PDFs to your reimbursement portal. You stay in control — substantiate never files claims for you.",
  },
];

/** How it works: three step cards on the paper2 band. */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-y-[1.5px] border-dashed border-dash bg-paper2"
    >
      <div className="mx-auto max-w-[1080px] px-8 py-[60px]">
        <Eyebrow size={11}>How it works</Eyebrow>
        <h2 className="mt-[10px] font-serif text-[34px] font-medium leading-[1.1]">
          Three steps, then back to your day.
        </h2>
        <div className="mt-[34px] flex flex-wrap gap-5">
          {STEPS.map(({ n, Icon, title, body }) => (
            <div
              key={n}
              className="min-w-[240px] flex-[1_1_240px] rounded-card border border-rule bg-field p-[22px]"
            >
              <div className="flex items-center gap-[11px]">
                <span className="font-mono text-[12px] font-medium text-terra">
                  {n}
                </span>
                <span className="h-px flex-1 border-t border-dashed border-dash" />
                <span className="flex text-terra">
                  <Icon size={20} />
                </span>
              </div>
              <div className="mt-[14px] font-serif text-[21px]">{title}</div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-ink2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
