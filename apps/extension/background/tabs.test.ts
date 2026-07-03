import { describe, expect, it, vi } from "vitest";
import {
  awaitPageResult,
  deliverPageResult,
  clearTabPageResults,
  clearBufferedPageResult,
} from "./tabs";

// Only the pure page-result coordinator is covered here — the navigation
// primitives (navigateTab/waitForTabLoad/waitForContentReady) are exercised
// manually against real tabs. Unique tab ids per test keep the module-level
// coordinator state isolated.
describe("awaitPageResult", () => {
  it("resolves with the first result matching the predicate", async () => {
    const p = awaitPageResult<{ kind: string }>(101, (r) => r.kind === "want");
    deliverPageResult(101, { kind: "nope" }); // buffered, doesn't match
    deliverPageResult(101, { kind: "want" }); // matches → resolves
    await expect(p).resolves.toEqual({ kind: "want" });
  });

  it("delivers a result that arrived just BEFORE the await (the fast-load race)", async () => {
    deliverPageResult(102, { kind: "early" });
    await expect(awaitPageResult<{ kind: string }>(102, (r) => r.kind === "early")).resolves.toEqual({
      kind: "early",
    });
  });

  it("does not match another tab's result", async () => {
    vi.useFakeTimers();
    const p = awaitPageResult(103, () => true, 1000);
    deliverPageResult(999, { kind: "other-tab" });
    const assertion = expect(p).rejects.toThrow(/no matching page result/);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
    vi.useRealTimers();
  });

  it("rejects on timeout when no matching result arrives", async () => {
    vi.useFakeTimers();
    const p = awaitPageResult<{ kind: string }>(104, (r) => r.kind === "never", 500);
    deliverPageResult(104, { kind: "wrong" });
    const assertion = expect(p).rejects.toThrow(/Tab 104 produced no matching page result within/);
    await vi.advanceTimersByTimeAsync(500);
    await assertion;
    vi.useRealTimers();
  });

  it("clearTabPageResults rejects pending waiters when a tab closes", async () => {
    const p = awaitPageResult(105, () => true);
    clearTabPageResults(105);
    await expect(p).rejects.toThrow(/Tab 105 was closed/);
  });

  // This is the load-bearing guarantee behind "a navigation is a non-event":
  // a buffered result that no waiter matched must not later satisfy a DIFFERENT
  // predicate (e.g. a stale order-A summary resolving the await for order B).
  it("never lets a buffered non-matching result satisfy a later, differently-predicated waiter", async () => {
    const p1 = awaitPageResult<{ id: string }>(106, (r) => r.id === "A");
    deliverPageResult(106, { id: "A" });
    await expect(p1).resolves.toEqual({ id: "A" });

    // A stale "A" lingers in the buffer (nothing matched it).
    deliverPageResult(106, { id: "A" });

    const p2 = awaitPageResult<{ id: string }>(106, (r) => r.id === "B");
    let settled = false;
    void p2.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false); // did NOT resolve on the stale buffered "A"

    deliverPageResult(106, { id: "B" });
    await expect(p2).resolves.toEqual({ id: "B" });
  });

  it("clearBufferedPageResult drops a stale buffered result so the next await ignores it", async () => {
    vi.useFakeTimers();
    deliverPageResult(107, { id: "stale" });
    clearBufferedPageResult(107); // e.g. at the start of a new scrape on a reused tab
    const p = awaitPageResult(107, () => true, 500);
    const assertion = expect(p).rejects.toThrow(/no matching page result/);
    await vi.advanceTimersByTimeAsync(500);
    await assertion;
    vi.useRealTimers();
  });
});
