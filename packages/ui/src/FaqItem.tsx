import { useId, useState, type ReactNode } from "react";

interface FaqItemProps {
  q: string;
  a: ReactNode;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Controlled open state; when provided, `onToggle` drives changes. */
  open?: boolean;
  onToggle?: () => void;
}

/**
 * Accordion FAQ row: a question button with a +/− indicator that reveals the
 * answer. Controlled when `open` is passed (landing = one-open-at-a-time),
 * otherwise self-manages state seeded by `defaultOpen` (extension Help, stories).
 */
export function FaqItem({ q, a, defaultOpen = false, open, onToggle }: FaqItemProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;
  const answerId = useId();

  const toggle = () => {
    if (isControlled) onToggle?.();
    else setInternalOpen((v) => !v);
  };

  return (
    <div className="border-t border-dashed border-dash py-[15px] font-sans">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="group flex w-full cursor-pointer items-start gap-3 text-left"
      >
        <span className="flex-1 text-[14px] font-bold leading-[1.4] text-ink transition-colors group-hover:text-terra-d">
          {q}
        </span>
        <span className="w-[14px] flex-none text-center text-[17px] leading-[1.3] text-terra">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div
          id={answerId}
          className="mt-[9px] pr-[26px] text-[13px] leading-[1.6] text-ink2"
        >
          {a}
        </div>
      )}
    </div>
  );
}
