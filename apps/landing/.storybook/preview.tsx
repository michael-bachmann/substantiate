import type { Preview } from "@storybook/react-vite";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/jetbrains-mono";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
  },
  // Render every story on the warm page canvas so the shared tokens read in context.
  decorators: [
    (Story) => (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
