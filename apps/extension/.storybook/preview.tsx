import type { Preview } from "@storybook/react-vite";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/jetbrains-mono";
import "../entrypoints/sidepanel/style.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
  },
  // Wrap every story in the warm page canvas so tokens render in context.
  decorators: [
    (Story) => (
      <div style={{ background: "var(--paper)", padding: 24, minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
