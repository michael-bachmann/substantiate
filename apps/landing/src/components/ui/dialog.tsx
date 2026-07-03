import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// shadcn/ui Dialog, themed to substantiate. Radix gives us the focus trap,
// ESC-to-close, backdrop-click-to-close, and `aria-modal` for free — we only
// restyle. The Content deliberately adds NO card surface (bg/border/padding):
// ContactForm ships its own paper2 card, so a wrapper card would double up.
// Enter/exit fades are keyed off Radix's `data-state`; the keyframes live in
// styles.css (guarded for prefers-reduced-motion).

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Dimmed + blurred backdrop, per the mock (rgba(43,38,32,.5) + ~3px blur).
      "modal-fade fixed inset-0 z-50 bg-[rgba(43,38,32,0.5)] backdrop-blur-[3px]",
      "data-[state=open]:animate-[modal-overlay-in_150ms_ease] data-[state=closed]:animate-[modal-overlay-out_150ms_ease]",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      // No sub-heading to expose (ContactForm's blurb is self-describing), so
      // opt out of aria-describedby rather than invent an sr-only description —
      // this also silences Radix's dev-only "Missing Description" warning.
      aria-describedby={undefined}
      className={cn(
        // Centered container only — position, width, elevation. No surface.
        // `w-[calc(100%-48px)]` keeps the mock's 24px side gutters on mobile.
        "modal-fade fixed left-1/2 top-1/2 z-50 w-[calc(100%-48px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2",
        "max-h-[calc(100dvh-48px)] overflow-y-auto shadow-modal",
        "data-[state=open]:animate-[modal-content-in_150ms_ease] data-[state=closed]:animate-[modal-content-out_150ms_ease]",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute right-[17px] top-[15px] z-[1] cursor-pointer px-1 py-0.5 text-[20px] leading-none text-ink3 transition-colors hover:text-ink"
      >
        ×
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
