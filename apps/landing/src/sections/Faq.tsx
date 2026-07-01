import { useState } from "react";
import { Eyebrow, FaqItem, FAQS } from "@substantiate/ui";

/**
 * FAQ accordion — one item open at a time (index in state; first open by
 * default; clicking the open item closes it). PR 5 appends the "Ask a
 * question" / "Report a bug" link buttons + modals below the accordion.
 */
export function Faq() {
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
      </div>
    </section>
  );
}
