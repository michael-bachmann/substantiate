import type { ReactNode } from "react";
import { Button } from "@substantiate/ui";

interface NoticeAction {
  label: string;
  /** Renders the primary Button as a link (opens a tab) when set. */
  href?: string;
  onClick?: () => void;
}

export interface ScanNoticeProps {
  /** A sized icon element, tinted by the caller (e.g. `<StorefrontIcon size={40} />`). */
  icon: ReactNode;
  title: string;
  body: string;
  primary: NoticeAction;
  secondary?: NoticeAction;
}

/**
 * The shared terminal-notice layout for the signed-out and error views: a
 * centered icon + serif title + muted body, with up to two pinned actions.
 * Both states are the same shape, so they share one component rather than
 * duplicating the frame.
 */
export function ScanNotice({ icon, title, body, primary, secondary }: ScanNoticeProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-5 pb-4">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="flex text-terra">{icon}</span>
        <h2 className="mt-4 font-serif text-[26px] font-medium leading-[1.12]">{title}</h2>
        <p className="mt-[10px] max-w-[280px] text-[13px] leading-[1.55] text-ink2">{body}</p>
      </div>

      <div className="mt-auto flex flex-col gap-[9px] pt-4">
        <Button variant="primary" block href={primary.href} onClick={primary.onClick}>
          {primary.label}
        </Button>
        {secondary && (
          <Button variant="secondary" block onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  );
}
