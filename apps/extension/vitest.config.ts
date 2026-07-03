import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "lib/**/*.test.ts",
      "components/**/*.test.{ts,tsx}",
      "retailers/**/*.test.ts",
      "background/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      // Measure domain logic only (lib/). The React UI and the I/O boundary
      // (storage, network clients, messaging) are presentational or only
      // meaningfully exercised against live pages/APIs — unit coverage there
      // would be noise, not signal. Add background/ and retailers/ here as
      // those domains land.
      include: ["lib/**"],
      // messaging.ts is a pure I/O shim over browser.runtime.sendMessage —
      // meaningfully exercised only against a live panel (10c), so excluded
      // like the other I/O boundaries rather than covered with hollow mocks.
      exclude: ["**/*.test.{ts,tsx}", "**/types.ts", "lib/messaging.ts"],
      reporter: ["text-summary", "lcov"],
      // A baseline floor for the scaffold's sample lib (100% covered). Raise
      // these toward actual coverage as real domain code lands so the bar
      // ratchets up without breaking the build on unrelated changes.
      thresholds: {
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
