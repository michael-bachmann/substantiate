import type { MouseEventHandler, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { PuzzleIcon, CoffeeIcon, FolderIcon } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonIcon = "puzzle" | "coffee" | "folder" | "arrow";

interface ButtonProps {
  variant?: ButtonVariant;
  /** Compact size. */
  sm?: boolean;
  /** Full-width. */
  block?: boolean;
  /** Show a spinner and (optionally) swap the label while an action runs. */
  busy?: boolean;
  busyLabel?: ReactNode;
  disabled?: boolean;
  /** Leading icon; `arrow` renders as a trailing → glyph. */
  icon?: ButtonIcon;
  /** Small line above the label (two-line install buttons). */
  sublabel?: ReactNode;
  /** Renders an <a> (opens in a new tab) instead of a <button>. */
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-label"?: string;
  className?: string;
  children?: ReactNode;
}

// Shared shape/typography (no display, size, or color — those vary). Kept DRY so
// both the <button> and <a> render paths share one source of truth.
const BASE =
  "items-center justify-center gap-[9px] rounded-button border border-transparent font-bold tracking-[0.005em] no-underline transition";

function sizeClasses(sm: boolean, block: boolean) {
  const layout = block ? "flex w-full box-border" : "inline-flex";
  const pad = block
    ? sm
      ? "p-[10px]"
      : "p-[14px]"
    : sm
      ? "px-[15px] py-[9px]"
      : "px-5 py-[14px]";
  const fs = sm ? "text-[13.5px]" : block ? "text-[14.5px]" : "text-[15px]";
  return `${layout} ${pad} ${fs}`;
}

const VARIANT_BASE: Record<ButtonVariant, string> = {
  primary: "bg-terra text-paper2",
  secondary: "bg-field text-ink border-rule",
  ghost: "bg-transparent text-ink2 border-rule",
};

const VARIANT_HOVER: Record<ButtonVariant, string> = {
  primary: "hover:bg-terra-d",
  secondary: "hover:border-terra hover:bg-paper2",
  ghost: "hover:bg-paper2 hover:text-ink",
};

const ICONS = { puzzle: PuzzleIcon, coffee: CoffeeIcon, folder: FolderIcon };

/**
 * Themed action button. Renders an `<a>` when `href` is set, else a `<button>`.
 * Hover/press styles are omitted (not just guarded) while inert, so a disabled
 * `<button>` — which still matches `:hover` in CSS — stays fully inert.
 */
export function Button({
  variant = "primary",
  sm = false,
  block = false,
  busy = false,
  busyLabel,
  disabled = false,
  icon,
  sublabel,
  href,
  target = "_blank",
  rel = "noopener",
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  className = "",
  children,
}: ButtonProps) {
  const state = disabled
    ? "opacity-40 pointer-events-none cursor-default"
    : busy
      ? "pointer-events-none cursor-default"
      : `${VARIANT_HOVER[variant]} active:translate-y-px cursor-pointer`;

  const cls = `${BASE} ${sizeClasses(sm, block)} ${VARIANT_BASE[variant]} ${state} ${className}`;

  const label = busy && busyLabel ? busyLabel : children;
  const Leading = icon && icon !== "arrow" ? ICONS[icon] : null;

  const content = (
    <>
      {busy && <Spinner size={14} onAccent={variant === "primary"} />}
      {Leading && <Leading size={18} />}
      {sublabel != null ? (
        <span className="flex flex-col text-left leading-[1.1]">
          <span className="text-[10px] font-semibold tracking-[0.04em] opacity-[0.82]">
            {sublabel}
          </span>
          <span className="text-[15px] font-bold">{label}</span>
        </span>
      ) : (
        <span>{label}</span>
      )}
      {icon === "arrow" && <span className="text-[15px] leading-none">→</span>}
    </>
  );

  if (href != null) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        aria-busy={busy || undefined}
        onClick={onClick}
        className={cls}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      // `busy` must NOT set `disabled`: the disabled style is a washed-out
      // surface (right for a truly-disabled button) that would dull an active
      // "Saving…" pill. Keep it visually active; `pointer-events-none` blocks
      // re-clicks while the action runs.
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cls}
    >
      {content}
    </button>
  );
}
