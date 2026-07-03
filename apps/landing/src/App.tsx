import { useState } from "react";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { Privacy } from "./sections/Privacy";
import { Faq } from "./sections/Faq";
import { Support } from "./sections/Support";
import { Footer } from "./sections/Footer";
import { ContactModal } from "./components/ContactModal";

type Modal = null | "contact" | "bug";

export default function App() {
  // Mirrors the mock's top-level `modal` state (null | contact | bug).
  const [modal, setModal] = useState<Modal>(null);
  const openContact = () => setModal("contact");
  const openBug = () => setModal("bug");
  const close = () => setModal(null);

  return (
    <div className="bg-paper text-ink">
      <Nav />
      <Hero />
      <HowItWorks />
      <Privacy />
      <Faq onAskQuestion={openContact} onReportBug={openBug} />
      <Support />
      <Footer onReportBug={openBug} />

      <ContactModal
        open={modal === "contact"}
        onOpenChange={(o) => !o && close()}
        title="Ask a question"
      />
      <ContactModal
        open={modal === "bug"}
        onOpenChange={(o) => !o && close()}
        title="Report a bug"
        eyebrow="Report a bug"
        heading="Found something broken?"
        blurb="Tell us what happened and we’ll dig in — steps to reproduce help a lot."
        placeholder="What went wrong? What did you expect to happen?"
        cta="Send report"
        subject="substantiate · Bug report"
        sentTitle="Report sent."
        sentBlurb="Thanks — we read every report and chase the gnarly ones first."
      />
    </div>
  );
}
