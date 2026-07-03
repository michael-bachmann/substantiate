import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  // Generate the manifest icons (Chrome + Firefox) from a single source — the
  // brand glyph in packages/ui/src/mark.svg (mirrors @substantiate/ui's Logo).
  autoIcons: {
    baseIconPath: "../../packages/ui/src/mark.svg",
    sizes: [128, 96, 48, 32, 16],
  },
  // Don't auto-import from Storybook stories / tests — they re-export the same
  // case names across files, which floods the build log with "Duplicated
  // imports" warnings. We import everything explicitly; this only trims the
  // scan sources (WXT's built-in auto-imports are unaffected).
  imports: {
    dirsScanOptions: {
      fileFilter: (file) => !/\.(stories|test)\.[jt]sx?$/.test(file),
    },
  },
  manifest: ({ browser }) => ({
    name: "substantiate",
    description: "substantiate browser extension",
    // Each browser has its own stable-extension-ID mechanism. Firefox uses
    // browser_specific_settings.gecko.id; Chrome derives a stable ID from a
    // pinned public `key` (added once the extension is published).
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: { id: "substantiate@substantiate.dev" },
          },
        }
      : {}),
    // `sidePanel` and `debugger` are Chrome-only; including them on Firefox
    // triggers an "Unknown permission" warning. Firefox uses sidebar_action
    // (auto-generated from the sidepanel entrypoint) instead, and has no
    // debugger equivalent (the print-to-PDF path is Chrome-only).
    permissions: [
      "storage",
      "tabs",
      "downloads",
      ...(browser === "firefox" ? [] : ["sidePanel", "debugger"]),
    ],
    // Amazon order scraping runs against amazon.com pages.
    host_permissions: ["*://*.amazon.com/*"],
  }),
  vite: () => ({
    plugins: [
      tailwindcss(),
      // Lets components import SVGs as React components via the `?react` query
      // (e.g. @substantiate/ui's Logo). Default include is **/*.svg?react, so
      // plain SVG URL imports (public/, assets/) are untouched.
      svgr(),
    ],
  }),
});
