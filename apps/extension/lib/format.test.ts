import { describe, it, expect } from "vitest";
import { titleWord, titleCase } from "./format";

describe("titleWord", () => {
  it("capitalizes a lowercase word", () => {
    expect(titleWord("hello")).toBe("Hello");
  });

  it("normalizes mixed case", () => {
    expect(titleWord("hELLO")).toBe("Hello");
  });

  it("handles the empty string", () => {
    expect(titleWord("")).toBe("");
  });
});

describe("titleCase", () => {
  it("title-cases each word", () => {
    expect(titleCase("the quick brown fox")).toBe("The Quick Brown Fox");
  });

  it("collapses extra whitespace and trims", () => {
    expect(titleCase("  prove   it  ")).toBe("Prove It");
  });

  it("returns an empty string for blank input", () => {
    expect(titleCase("   ")).toBe("");
  });
});
