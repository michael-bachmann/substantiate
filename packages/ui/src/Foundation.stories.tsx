import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/** Specimen page proving substantiate's design tokens + three font families
 *  render. No component under test — each export is a standalone specimen. */
const meta: Meta = {
  title: "Foundation/Tokens",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const COLORS: { name: string; token: string; hex: string; onDark?: boolean }[] = [
  { name: "paper", token: "--paper", hex: "#F6EFE3" },
  { name: "paper2", token: "--paper2", hex: "#FCF8EF" },
  { name: "field", token: "--field", hex: "#FFFDFA" },
  { name: "ink", token: "--ink", hex: "#2B2620", onDark: true },
  { name: "ink2", token: "--ink2", hex: "#6F6456", onDark: true },
  { name: "ink3", token: "--ink3", hex: "#A99C88" },
  { name: "rule", token: "--rule", hex: "#E6DBC8" },
  { name: "dash", token: "--dash", hex: "#CCBBA0" },
  { name: "terra", token: "--terra", hex: "#C0603A", onDark: true },
  { name: "terra-d", token: "--terra-d", hex: "#9C4A2A", onDark: true },
  { name: "terra-t", token: "--terra-t", hex: "#F1DFD2" },
];

const Section = ({ label, children }: { label: string; children: ReactNode }) => (
  <section className="border-t border-dashed border-dash pt-6">
    <h2
      className="mb-4 font-mono text-[11px] font-medium uppercase text-ink3"
      style={{ letterSpacing: ".16em" }}
    >
      {label}
    </h2>
    {children}
  </section>
);

export const Palette: Story = {
  render: () => (
    <div className="min-h-screen bg-paper p-8 text-ink">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <Section label="Color">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COLORS.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-tile border border-rule">
                <div
                  className="flex h-20 items-end p-2"
                  style={{ background: `var(${c.token})` }}
                >
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: c.onDark ? "#FCF8EF" : "#2B2620" }}
                  >
                    {c.hex}
                  </span>
                </div>
                <div className="bg-paper2 px-2 py-1.5 font-mono text-[11px] text-ink2">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Type — Newsreader (serif)">
          <h1 className="font-serif text-[40px] leading-[1.06] text-ink">
            Stop saving FSA receipts by hand.
          </h1>
          <div className="tabular mt-2 font-serif text-[56px] font-medium leading-none text-ink">
            $640.18
          </div>
        </Section>

        <Section label="Type — Hanken Grotesk (sans)">
          <p className="max-w-md font-sans text-[15px] leading-[1.55] text-ink2">
            The extension walks your Amazon order history and saves a PDF invoice for
            every eligible order — you upload them to your reimbursement portal yourself.
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-4 font-sans">
            <span className="font-normal">Regular 400</span>
            <span className="font-medium">Medium 500</span>
            <span className="font-semibold">Semibold 600</span>
            <span className="font-bold">Bold 700</span>
            <span className="font-extrabold">Extrabold 800</span>
          </div>
        </Section>

        <Section label="Type — JetBrains Mono (data / eyebrows)">
          <div
            className="font-mono text-[12px] font-medium uppercase text-terra-d"
            style={{ letterSpacing: ".16em" }}
          >
            New batch
          </div>
          <div className="tabular mt-2 font-mono text-[13px] text-ink2">
            Amazon_2026-06-25_$54.86.pdf
          </div>
          <div className="tabular mt-1 font-mono text-[13px] text-ink2">
            Jun 25 · · · · · · · · $54.86
          </div>
        </Section>

        <Section label="Radius">
          <div className="flex flex-wrap items-end gap-4">
            {[
              { label: "card 16", cls: "rounded-card", w: "h-20 w-28" },
              { label: "tile 14", cls: "rounded-tile", w: "h-16 w-16" },
              { label: "button 10", cls: "rounded-button", w: "h-12 w-24" },
              { label: "control 8", cls: "rounded-control", w: "h-12 w-24" },
              { label: "pill", cls: "rounded-pill", w: "h-12 w-12" },
            ].map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-2">
                <div className={`${r.w} ${r.cls} border border-rule bg-paper2`} />
                <span className="font-mono text-[11px] text-ink3">{r.label}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Elevation">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-40 rounded-card bg-paper2 shadow-panel" />
              <span className="font-mono text-[11px] text-ink3">shadow-panel</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-40 rounded-card bg-paper2 shadow-modal" />
              <span className="font-mono text-[11px] text-ink3">shadow-modal</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  ),
};
