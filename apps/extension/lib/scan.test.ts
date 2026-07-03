import { describe, it, expect } from "vitest";
import { periodRange, savedRow, summaryToDone } from "./scan";
import type { ExportResult, ExportSummary } from "./types";

const saved = (filename: string, cents: number): ExportResult => ({
  orderId: filename,
  status: "saved",
  filename,
  fsaEligibleCents: cents,
});

describe("periodRange", () => {
  it("year mode spans Jan 1 to Dec 31 of the year", () => {
    expect(periodRange("year", 2026, undefined)).toEqual({
      fromDate: "2026-01-01",
      toDate: "2026-12-31",
    });
  });

  it("range mode uses the picked endpoints as ISO dates", () => {
    expect(
      periodRange("range", 2026, {
        from: new Date(2026, 5, 8),
        to: new Date(2026, 5, 22),
      }),
    ).toEqual({ fromDate: "2026-06-08", toDate: "2026-06-22" });
  });

  it("falls back to the year when a range is incomplete", () => {
    expect(
      periodRange("range", 2025, { from: new Date(2025, 0, 3), to: undefined }),
    ).toEqual({ fromDate: "2025-01-01", toDate: "2025-12-31" });
  });
});

describe("savedRow", () => {
  it("parses the ISO date from the filename and formats the amount", () => {
    expect(savedRow(saved("Amazon_2026-06-25_$54.86.pdf", 5486))).toEqual({
      date: "Jun 25, 2026",
      amount: "$54.86",
    });
  });

  it("degrades a malformed filename to a dash, keeping the amount", () => {
    expect(savedRow(saved("Amazon_receipt.pdf", 1820))).toEqual({
      date: "—",
      amount: "$18.20",
    });
  });

  it("degrades a result without a filename or cents to dash / zero", () => {
    expect(
      savedRow({ orderId: "z", status: "skipped", reason: "no-fsa-line" }),
    ).toEqual({ date: "—", amount: "$0.00" });
  });
});

describe("summaryToDone", () => {
  const emptySummary: ExportSummary = {
    saved: [],
    skipped: [],
    errors: [],
    signedOut: false,
    ordersConsidered: 0,
  };

  it("folds saved rows, subtotal, and the +N-more tail", () => {
    const summary: ExportSummary = {
      ...emptySummary,
      saved: [
        saved("Amazon_2026-06-25_$54.86.pdf", 5486),
        saved("Amazon_2026-06-18_$18.20.pdf", 1820),
        saved("Amazon_2026-06-11_$129.40.pdf", 12940),
        saved("Amazon_2026-06-02_$42.99.pdf", 4299),
      ],
      ordersConsidered: 20,
    };
    const done = summaryToDone(summary);
    expect(done.foundCount).toBe(4);
    expect(done.rowsTop).toHaveLength(3);
    expect(done.hasMore).toBe(true);
    expect(done.moreCount).toBe(1);
    expect(done.subtotalStr).toBe("$245.45");
    expect(done.partial).toBe(false);
  });

  it("reports a clean zero-found walk", () => {
    const done = summaryToDone({ ...emptySummary, ordersConsidered: 8 });
    expect(done.foundCount).toBe(0);
    expect(done.rowsTop).toEqual([]);
    expect(done.hasMore).toBe(false);
    expect(done.subtotalStr).toBe("$0.00");
    expect(done.partial).toBe(false);
  });

  it("counts already-saved skips", () => {
    const done = summaryToDone({
      ...emptySummary,
      saved: [saved("Amazon_2026-03-30_$31.25.pdf", 3125)],
      skipped: [
        { orderId: "a", status: "skipped", reason: "already-saved" },
        { orderId: "b", status: "skipped", reason: "already-saved" },
        { orderId: "c", status: "skipped", reason: "no-fsa-line" },
      ],
    });
    expect(done.skippedAlreadySaved).toBe(2);
  });

  it("flags a partial walk that signed out after saving some", () => {
    const done = summaryToDone({
      ...emptySummary,
      saved: [saved("Amazon_2026-01-16_$106.90.pdf", 10690)],
      signedOut: true,
    });
    expect(done.partial).toBe(true);
  });

  it("counts unreadable orders so a zero result isn't mislabeled 'none eligible'", () => {
    const done = summaryToDone({
      ...emptySummary,
      errors: [
        { orderId: "a", status: "error", message: "boom" },
        { orderId: "b", status: "error", message: "boom" },
      ],
      ordersConsidered: 2,
    });
    expect(done.foundCount).toBe(0);
    expect(done.errorCount).toBe(2);
  });
});
