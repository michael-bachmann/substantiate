import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Compact 36px, auto-width variant (default is 44px, full-width). */
  sm?: boolean;
  /** Show a spinner and (optionally) swap the label while an action runs. */
  busy?: boolean;
  busyLabel?: ReactNode;
}

// `enabled:` guards every hover/active effect so a disabled button is fully
// inert — disabled <button>s still match :hover in CSS, so without the guard
// they'd brighten/press. Holds for all variants below.
// Exported so the anchor-based `LinkButton` shares the exact shape + sizing.
// (It can't reuse the `VARIANT` strings below: their `enabled:`/`disabled:`
// guards never match an <a>, which has no enabled/disabled state.)
export const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button border font-semibold tracking-[-0.005em] transition enabled:active:translate-y-px disabled:cursor-default";

export const SIZE = {
  default: "min-h-[44px] w-full px-4 py-[11px] text-[14.5px]",
  sm: "min-h-[36px] w-auto px-[13px] py-2 text-[13px]",
};

const VARIANT: Record<ButtonVariant, string> = {
  secondary:
    "bg-field text-ink border-rule enabled:hover:border-terra enabled:hover:bg-paper2 disabled:opacity-40",
  primary:
    "bg-terra text-paper2 border-transparent enabled:hover:bg-terra-d disabled:opacity-40",
  ghost:
    "bg-transparent text-ink2 border-rule enabled:hover:bg-paper2 disabled:opacity-40",
  // No dedicated danger color in substantiate's single-accent palette — a
  // darker terracotta reads as emphasis without introducing a second hue.
  danger:
    "bg-terra-d text-paper2 border-transparent enabled:hover:bg-terra disabled:opacity-40",
};

/** Primary action / form button. See variants in the design's primitive kit. */
export function Button({
  variant = "secondary",
  sm = false,
  busy = false,
  busyLabel,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      // `busy` must NOT set `disabled`: the disabled-primary style is a light
      // greyed surface (correct for a truly-disabled button), which would wash
      // out the dark "Syncing…" pill. Keep it visually active; just block
      // re-clicks while the action runs.
      disabled={disabled}
      aria-busy={busy || undefined}
      className={`${BASE} ${sm ? SIZE.sm : SIZE.default} ${VARIANT[variant]} ${busy ? "pointer-events-none cursor-default" : ""} ${className}`}
    >
      {busy && <Spinner size={15} onAccent={variant === "primary"} />}
      {busy && busyLabel ? busyLabel : children}
    </button>
  );
}
