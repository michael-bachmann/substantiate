import type { ComponentProps } from "react";
import { ContactForm } from "@substantiate/ui";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ContactModalProps extends ComponentProps<typeof ContactForm> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible dialog name (visually hidden — ContactForm shows its own heading). */
  title: string;
}

/**
 * Landing modal: a themed shadcn Dialog wrapping the shared ContactForm. Radix
 * unmounts the Content on close, so the form remounts fresh on reopen (empty
 * fields, no lingering SENT state) — no manual reset needed. The visible heading
 * comes from ContactForm; DialogTitle supplies the accessible name (sr-only) so
 * there's no a11y violation.
 */
export function ContactModal({
  open,
  onOpenChange,
  title,
  ...formProps
}: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <ContactForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
