import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { Privacy } from "./sections/Privacy";
import { Faq } from "./sections/Faq";
import { Support } from "./sections/Support";
import { Footer } from "./sections/Footer";

export default function App() {
  return (
    <div className="bg-paper text-ink">
      <Nav />
      <Hero />
      <HowItWorks />
      <Privacy />
      <Faq />
      <Support />
      <Footer />
    </div>
  );
}
