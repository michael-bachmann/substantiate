import { describe, it, expect } from "vitest";
import { money, fmtDate, rangeShort } from "./format";

describe("money", () => {
  it("always shows two decimals", () => {
    expect(money(54.86)).toBe("$54.86");
    expect(money(18.2)).toBe("$18.20");
    expect(money(0)).toBe("$0.00");
  });
});

describe("fmtDate", () => {
  it("renders the prototype's 'Mon D, YYYY' shape", () => {
    expect(fmtDate(new Date(2026, 5, 25))).toBe("Jun 25, 2026");
  });

  it("does not zero-pad the day", () => {
    expect(fmtDate(new Date(2026, 6, 2))).toBe("Jul 2, 2026");
  });
});

describe("rangeShort", () => {
  it("collapses a shared year onto the end", () => {
    expect(rangeShort(new Date(2026, 5, 25), new Date(2026, 6, 2))).toBe(
      "Jun 25 – Jul 2, 2026",
    );
  });

  it("keeps both years when the range spans a boundary", () => {
    expect(rangeShort(new Date(2025, 5, 25), new Date(2026, 6, 2))).toBe(
      "Jun 25, 2025 – Jul 2, 2026",
    );
  });
});
