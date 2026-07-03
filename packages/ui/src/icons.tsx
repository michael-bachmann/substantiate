import type { ReactNode } from "react";

// Inline stroke icons, lifted verbatim from the design handoff (viewBox 0 0 24 24,
// fill:none, stroke:currentColor, round caps/joins). Each icon keeps its source
// stroke-width. Colored via `color`/`text-*`; sized via `size` (px). This module
// grows as later PRs need more glyphs — one export per icon.

interface IconProps {
  size?: number;
  className?: string;
  /** Override the icon's source stroke-width (e.g. a bolder check for the SAVED/SENT stamp). */
  strokeWidth?: number;
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
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M9 3.5h6a3 3 0 0 1 3 3v2.5a3 3 0 0 1-3 3h-1.5v1.5a2 2 0 0 1-2 2H9a3 3 0 0 1-3-3V6.5a3 3 0 0 1 3-3Z" />
      <path d="M6 13.5H4.8a1.8 1.8 0 0 0 0 3.6H6M18 13.5h1.2a1.8 1.8 0 0 1 0 3.6H18" />
    </Icon>
  );
}

export function StorefrontIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M4.5 9.5h15V18a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V9.5z" />
      <path d="M4 9.5 5.5 5h13L20 9.5" />
      <path d="M9.5 19v-4.5h5V19" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.4v4.8" />
      <path d="M12 7.8h.01" />
    </Icon>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
      <path d="M16 10h2.4a2 2 0 0 1 0 4H16" />
      <path d="M8 3.5v2M11.5 3.5v2" />
    </Icon>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M4 7.5a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M5 12.5 10 17 19 6.5" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 9.5h16" />
      <path d="M8 3.5v4M16 3.5v4" />
    </Icon>
  );
}

export function FileCheckIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M6.5 4H13L17.5 8.5V20H6.5Z" />
      <path d="M13 4V8.5H17.5" />
      <path d="M9 13.6 11 15.6 15 11.2" />
    </Icon>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M12 15V4M12 4 8.5 7.5M12 4l3.5 3.5" />
      <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M12 3.5 19 6v5c0 4-3 7-7 8.2-4-1.2-7-4.2-7-8.2V6l7-2.5z" />
      <path d="M9.2 12l2 2 3.6-4" />
    </Icon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </Icon>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z" />
    </Icon>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M12 4.5 3.5 19h17L12 4.5z" />
      <path d="M12 10v4" />
      <path d="M12 16.6h.01" />
    </Icon>
  );
}

export function HandShieldIcon(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M12 21c4-1.2 7-5 7-9V6l-7-2.5" />
      <path d="M12 21c-4-1.2-7-5-7-9V6l7-2.5" />
    </Icon>
  );
}
