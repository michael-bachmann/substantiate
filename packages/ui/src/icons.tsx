import type { ReactNode } from "react";

// Inline stroke icons, lifted verbatim from the design handoff (viewBox 0 0 24 24,
// fill:none, stroke:currentColor, round caps/joins). Each icon keeps its source
// stroke-width. Colored via `color`/`text-*`; sized via `size` (px). This module
// grows as later PRs need more glyphs — one export per icon.

interface IconProps {
  size?: number;
  className?: string;
}

function Icon({
  size = 18,
  strokeWidth,
  className = "",
  children,
}: IconProps & { strokeWidth: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function PuzzleIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.7}>
      <path d="M9 3.5h6a3 3 0 0 1 3 3v2.5a3 3 0 0 1-3 3h-1.5v1.5a2 2 0 0 1-2 2H9a3 3 0 0 1-3-3V6.5a3 3 0 0 1 3-3Z" />
      <path d="M6 13.5H4.8a1.8 1.8 0 0 0 0 3.6H6M18 13.5h1.2a1.8 1.8 0 0 1 0 3.6H18" />
    </Icon>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.8}>
      <path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
      <path d="M16 10h2.4a2 2 0 0 1 0 4H16" />
      <path d="M8 3.5v2M11.5 3.5v2" />
    </Icon>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.8}>
      <path d="M4 7.5a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={1.8}>
      <path d="M5 12.5 10 17 19 6.5" />
    </Icon>
  );
}
