// ---------------------------------------------------------------------------
// Amazon FSA/HSA receipt export adapter (Chrome-only print path).
//
// Walks Amazon orders in a date range, and for each one whose printable invoice
// shows an "FSA or HSA eligible" total, saves that invoice as a PDF named with
// the order date and the FSA-eligible amount — ready to upload to an FSA/HSA
// reimbursement portal (e.g. Fidelity), where the filename conveys
// date + provider + amount.
//
// The walk is sequential by design: each order navigates the same reused tab and
// attaches the debugger to print it. It reuses only the shared tab-coordination
// plumbing (background/tabs) and the Chrome print path (background/print-to-pdf).
// ---------------------------------------------------------------------------

import type {
  RetailerAdapter,
  ExportOptions,
  ExportResult,
  ExportSummary,
} from "@/lib/types";
import { invoicePrintUrl, TRANSACTIONS_URL } from "@/retailers/amazon/selectors";
import type { AmazonPageResult } from "@/retailers/amazon/page";
import {
  openRetailerTab,
  awaitPageResult,
  clearBufferedPageResult,
} from "@/background/tabs";
import { printTabToPdf } from "@/background/print-to-pdf";

/** Pagination backstop. The date cutoff normally stops the walk first; this only
 *  guards against an unbounded loop (e.g. a pager that never reports !hasNext). */
const FSA_MAX_PAGES = 60;

export const amazonAdapter: RetailerAdapter = {
  id: "amazon",
  label: "Amazon",
  startUrl: TRANSACTIONS_URL,

  async exportReceipts(opts: ExportOptions): Promise<ExportSummary> {
    const { fromDate, toDate, signal, onProgress, alreadyExported } = opts;
    const empty: ExportSummary = {
      saved: [],
      skipped: [],
      errors: [],
      signedOut: false,
      ordersConsidered: 0,
    };

    const opened = await openRetailerTab(TRANSACTIONS_URL);
    if (!opened) {
      return {
        ...empty,
        errors: [{ orderId: "", status: "error", message: "Could not open an Amazon tab" }],
      };
    }
    const { tabId, weOpenedTab } = opened;

    try {
      // Phase 1: walk the transactions list to collect the order ids in range.
      onProgress?.({ phase: "collecting" });
      const { orderIds, signedOut } = await collectOrderIds(tabId, fromDate, toDate);
      if (signedOut) return { ...empty, signedOut: true };
      console.info(`[fsa-export] ${orderIds.length} order(s) in ${fromDate}..${toDate}`);

      // Phase 2: export each collected order, emitting progress once its result
      // is known (the result is part of the event).
      const summary: ExportSummary = { ...empty, ordersConsidered: orderIds.length };
      const total = orderIds.length;
      for (let i = 0; i < total; i++) {
        signal?.throwIfAborted();
        const orderId = orderIds[i];

        // Dedupe: skip an order already saved by a prior run without navigating.
        if (alreadyExported?.(orderId)) {
          const result: ExportResult = { orderId, status: "skipped", reason: "already-saved" };
          summary.skipped.push(result);
          onProgress?.({ phase: "exporting", index: i + 1, total, result });
          continue;
        }

        const result = await exportOrderOnTab(tabId, orderId);
        onProgress?.({ phase: "exporting", index: i + 1, total, result });
        console.info(`[fsa-export] ${i + 1}/${total}`, result);

        if (result.status === "login-required") {
          summary.signedOut = true;
          break; // session dropped mid-walk; a re-run reads the rest
        }
        if (result.status === "saved") summary.saved.push(result);
        else if (result.status === "skipped") summary.skipped.push(result);
        else summary.errors.push(result);
      }

      console.info(
        `[fsa-export] done: ${summary.saved.length} saved, ${summary.skipped.length} skipped, ${summary.errors.length} errored`,
      );
      return summary;
    } finally {
      if (weOpenedTab) browser.tabs.remove(tabId).catch(() => {});
    }
  },
};

// ---------------------------------------------------------------------------
// Fire-and-forget tab triggers — the content script answers with a PAGE_RESULT,
// not a reply, so an action that navigates (and tears down the script) is fine.
// ---------------------------------------------------------------------------

function navigate(tabId: number, url: string): void {
  browser.tabs.update(tabId, { url }).catch(() => {});
}
function describe(tabId: number): void {
  browser.tabs.sendMessage(tabId, { type: "DESCRIBE" }).catch(() => {});
}
function turnPage(tabId: number): void {
  browser.tabs.sendMessage(tabId, { type: "NEXT_PAGE" }).catch(() => {});
}

// ---------------------------------------------------------------------------
// Single-order export
// ---------------------------------------------------------------------------

/** "Amazon_2026-06-25_$54.86.pdf" — date + provider + amount, as the portal
 *  shows the filename when picking an uploaded receipt. */
function invoiceFilename(orderDate: string, fsaEligibleCents: number): string {
  const dollars = (fsaEligibleCents / 100).toFixed(2);
  return `Amazon_${orderDate}_$${dollars}.pdf`;
}

/**
 * Export one order's invoice on a tab that's already open on amazon.com.
 * Navigates the tab to the printable invoice, reads the FSA-eligible total off
 * it, and — if present — saves the rendered page as a named PDF. Returns a
 * structured outcome rather than throwing so the walk can tally and continue.
 */
async function exportOrderOnTab(tabId: number, orderId: string): Promise<ExportResult> {
  navigate(tabId, invoicePrintUrl(orderId));

  let page: AmazonPageResult;
  try {
    // Match the result for THIS order so a stale buffered result from the prior
    // page (the transactions list, or the previous order) can't satisfy us.
    page = await awaitPageResult<AmazonPageResult>(
      tabId,
      (r) =>
        r.pageKind === "login" ||
        (r.pageKind === "invoice-print" && r.orderId === orderId),
    );
  } catch (e) {
    return { orderId, status: "error", message: e instanceof Error ? e.message : String(e) };
  }

  if (page.pageKind === "login") return { orderId, status: "login-required" };
  if (page.pageKind !== "invoice-print") {
    return { orderId, status: "error", message: `Unexpected page: ${page.pageKind}` };
  }

  if (page.fsaEligibleCents === null) return { orderId, status: "skipped", reason: "no-fsa-line" };
  if (!page.orderDate) return { orderId, status: "skipped", reason: "no-order-date" };

  const filename = invoiceFilename(page.orderDate, page.fsaEligibleCents);
  try {
    await printTabToPdf(tabId, filename);
  } catch (e) {
    return { orderId, status: "error", message: e instanceof Error ? e.message : String(e) };
  }
  return { orderId, status: "saved", filename, fsaEligibleCents: page.fsaEligibleCents };
}

// ---------------------------------------------------------------------------
// Transactions walk: collect order ids from the list, then export each
// ---------------------------------------------------------------------------

/**
 * Collect unique order ids from purchase rows whose transaction date falls in
 * [fromDate, toDate]. The list is newest-first, so we page until a page's oldest
 * row predates `fromDate`. Refund rows are excluded (a refund isn't a purchase
 * to claim); note this does NOT exclude an order that was *later* refunded — see
 * the caller's caveat. Returns ids in list order (newest first).
 */
async function collectOrderIds(
  tabId: number,
  fromDate: string,
  toDate: string,
): Promise<{ orderIds: string[]; signedOut: boolean }> {
  const seen = new Set<string>();
  const orderIds: string[] = [];

  clearBufferedPageResult(tabId);
  describe(tabId);
  let page = await awaitTransactionsPage(tabId, null);
  let prevFingerprint: string | null = null;

  for (let i = 0; i < FSA_MAX_PAGES; i++) {
    if (!page) {
      console.warn(`[fsa-export] pagination stopped: page ${i + 1} did not arrive in time`);
      break;
    }
    if (page.pageKind === "login") return { orderIds, signedOut: true };
    if (page.pageKind !== "transactions") break;

    for (const t of page.transactions) {
      if (t.isRefund || !t.orderId) continue;
      if (t.date < fromDate || t.date > toDate) continue;
      if (seen.has(t.orderId)) continue;
      seen.add(t.orderId);
      orderIds.push(t.orderId);
    }

    if (page.transactions.length === 0) break;
    const oldestOnPage = page.transactions.reduce(
      (min, t) => (t.date < min ? t.date : min),
      page.transactions[0].date,
    );
    if (oldestOnPage < fromDate) break;
    if (!page.hasNext) break;

    prevFingerprint = page.fingerprint;
    turnPage(tabId);
    page = await awaitTransactionsPage(tabId, prevFingerprint);
  }

  return { orderIds, signedOut: false };
}

async function awaitTransactionsPage(
  tabId: number,
  prevFingerprint: string | null,
): Promise<AmazonPageResult | null> {
  try {
    return await awaitPageResult<AmazonPageResult>(
      tabId,
      (r) =>
        r.pageKind === "login" ||
        (r.pageKind === "transactions" &&
          (prevFingerprint === null || r.fingerprint !== prevFingerprint)),
    );
  } catch {
    return null;
  }
}
