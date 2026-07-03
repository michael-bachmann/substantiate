import { useState } from "react";
import { Button, Eyebrow, FaqItem, FAQS } from "@substantiate/ui";

interface FaqProps {
  /** Opens the Contact modal (lifted to App). */
  onAskQuestion: () => void;
  /** Opens the Bug-report modal (lifted to App). */
  onReportBug: () => void;
}

/**
 * FAQ accordion — one item open at a time (index in state; first open by
 * default; clicking the open item closes it). Below it, two secondary link
 * buttons open the Contact / Bug modals (state lives in App).
 */
export function Faq({ onAskQuestion, onReportBug }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-t-[1.5px] border-dashed border-dash">
      <div className="mx-auto max-w-[720px] px-8 py-[60px]">
        <Eyebrow size={11} className="text-center">
          Questions &amp; answers
        </Eyebrow>
        <h2 className="mb-7 mt-[10px] text-center font-serif text-[34px] font-medium leading-[1.1]">
          Good to know
        </h2>
        {FAQS.map((faq, i) => (
          <FaqItem
            key={faq.q}
            q={faq.q}
            a={faq.a}
            open={i === openIndex}
            onToggle={() => setOpenIndex(i === openIndex ? -1 : i)}
          />
        ))}
        <div className="mt-[10px] flex flex-wrap justify-center gap-3 border-t border-dashed border-dash pt-6">
          <Button
            variant="secondary"
            icon="message"
            iconClassName="text-terra"
            onClick={onAskQuestion}
          >
            Ask a question
          </Button>
          <Button
            variant="secondary"
            icon="alert"
            iconClassName="text-terra"
            onClick={onReportBug}
          >
            Report a bug
          </Button>
        </div>
      </div>
    </section>
  );
}
