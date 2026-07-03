import type { Meta, StoryObj } from "@storybook/react-vite";
import App from "./App";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { Privacy } from "./sections/Privacy";
import { Faq } from "./sections/Faq";
import { Support } from "./sections/Support";
import { Footer } from "./sections/Footer";

// Sections are full-width bands, so render them fullscreen (not centered).
const meta: Meta = {
  title: "Landing/Sections",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const NavBar: Story = { name: "Nav", render: () => <Nav /> };
export const HeroSection: Story = { name: "Hero", render: () => <Hero /> };
export const HowItWorksSection: Story = {
  name: "HowItWorks",
  render: () => <HowItWorks />,
};
export const PrivacySection: Story = {
  name: "Privacy",
  render: () => <Privacy />,
};
export const FaqSection: Story = {
  name: "Faq",
  render: () => <Faq onAskQuestion={() => {}} onReportBug={() => {}} />,
};
export const SupportSection: Story = {
  name: "Support",
  render: () => <Support />,
};
export const FooterSection: Story = {
  name: "Footer",
  render: () => <Footer onReportBug={() => {}} />,
};

/** The whole page assembled, top to bottom. */
export const FullPage: Story = { name: "Full page", render: () => <App /> };

/** Full page constrained to a phone width to sanity-check the flex-wrap. */
export const FullPageMobile: Story = {
  name: "Full page · mobile",
  render: () => (
    <div className="mx-auto w-[390px] overflow-hidden shadow-panel">
      <App />
    </div>
  ),
};
