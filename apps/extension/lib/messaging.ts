import { browser } from "wxt/browser";
import type { ExportProgress, ExportSummary } from "./types";

/**
 * Typed client over the background message bus. The side panel calls these named
 * helpers instead of scattering `browser.runtime.sendMessage({ type })` string
 * literals. Covers the scan request/response messages plus the progress
 * broadcast the background emits during a walk. (Consumed by the panel in 10c.)
 */

export type StartScanResponse = { ok: true; summary: ExportSummary } | { error: string };

/** Kick off a receipt export walk for one retailer over a date range. Resolves
 *  when the walk finishes (or aborts) — it can run for a while. */
export async function startScan(opts: {
  retailer: string;
  fromDate: string;
  toDate: string;
}): Promise<StartScanResponse> {
  return (await browser.runtime.sendMessage({
    type: "START_SCAN",
    retailer: opts.retailer,
    fromDate: opts.fromDate,
    toDate: opts.toDate,
  })) as StartScanResponse;
}

/** Abort the in-flight scan, if any. */
export async function cancelScan(): Promise<void> {
  await browser.runtime.sendMessage({ type: "CANCEL_SCAN" });
}

/** Subscribe to scan progress broadcasts. Returns an unsubscribe fn. */
export function onScanProgress(cb: (e: ExportProgress) => void): () => void {
  const listener = (msg: unknown) => {
    if (
      typeof msg === "object" &&
      msg !== null &&
      (msg as { type?: unknown }).type === "SCAN_PROGRESS"
    ) {
      cb((msg as { event: ExportProgress }).event);
    }
  };
  browser.runtime.onMessage.addListener(listener);
  return () => browser.runtime.onMessage.removeListener(listener);
}
