import type { AnchorHTMLAttributes, ReactNode } from "react";
import { BASE, SIZE, type ButtonVariant } from "./Button";

// Same looks as <Button>, but with plain `hover:`/`active:` — an <a> is never
// `:disabled`, so it needs neither the `enabled:` guard nor the disabled styles.
const VARIANT: Record<ButtonVariant, string> = {
  secondary: "bg-field text-ink border-rule hover:border-terra hover:bg-paper2",
  primary: "bg-terra text-paper2 border-transparent hover:bg-terra-d",
  ghost: "bg-transparent text-ink2 border-rule hover:bg-paper2",
  danger: "bg-terra-d text-paper2 border-transparent hover:bg-terra",
};

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  sm?: boolean;
  children?: ReactNode;
}

/** An anchor styled as a <Button> — for link CTAs (nav, store links). */
export function LinkButton({
  variant = "secondary",
  sm = false,
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      {...rest}
      // Re-add the active press: BASE's is `enabled:active:` which never matches an <a>.
      className={`${BASE} active:translate-y-px no-underline ${sm ? SIZE.sm : SIZE.default} ${VARIANT[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
