import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "lib/**/*.test.ts",
      "components/**/*.test.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      // Measure domain logic only (lib/). The React UI and the I/O boundary
      // (storage, network clients, messaging) are presentational or only
      // meaningfully exercised against live pages/APIs — unit coverage there
      // would be noise, not signal. Add background/ and retailers/ here as
      // those domains land.
      include: ["lib/**"],
      exclude: ["**/*.test.{ts,tsx}", "**/types.ts"],
      reporter: ["text-summary", "lcov"],
      // Thresholds sit just under current coverage so the bar ratchets up over
      // time without breaking the build on unrelated changes.
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
