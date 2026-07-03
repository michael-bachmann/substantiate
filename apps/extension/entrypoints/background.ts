import { initPageResultListener } from "@/background/tabs";
import { getAdapter } from "@/retailers/registry";
import { getExportedOrderIds, addExportedOrderId, flushExportedWrites } from "@/lib/exported-store";
import type { ExportProgress, ExportSummary } from "@/lib/types";

/** Service worker entry point. Implementation lands as features are built. */
export default defineBackground(() => {
  // Wire the PAGE_RESULT coordinator FIRST so a result from the very first page
  // load (e.g. a tab already open on Amazon) can't be missed before a scan runs.
  initPageResultListener();

  // Chrome opens the side panel when its toolbar icon is clicked. Firefox has
  // no sidePanel API — its sidebar_action provides a toolbar toggle natively —
  // so skip this there to avoid a startup TypeError.
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }

  // One scan at a time — the walk drives a single reused tab, so a second scan
  // would fight it. START_SCAN holds the controller; CANCEL_SCAN aborts it.
  let scanController: AbortController | null = null;

  browser.runtime.onMessage.addListener((message: unknown, _sender) => {
    if (typeof message !== "object" || message === null) return;
    const type = (message as { type?: string }).type;

    if (type === "START_SCAN") {
      // Enforce the one-at-a-time invariant: a second scan would drive the same
      // reused tab and double-attach the debugger. Reject rather than abort the
      // in-flight one — restarting on a shared tab mid-print is messier.
      if (scanController) return Promise.resolve({ error: "A scan is already running" });
      const { retailer, fromDate, toDate } = message as {
        retailer: string;
        fromDate: string;
        toDate: string;
      };
      // Return a Promise so the message channel stays open for the long walk.
      return runScan(retailer, fromDate, toDate);
    }

    if (type === "CANCEL_SCAN") {
      scanController?.abort();
      return;
    }

    if (type === "SHOW_DOWNLOADS") {
      // Reveal the saved receipts in the OS file manager. Chrome-only —
      // Firefox has no downloads.showDefaultFolder, so guard rather than throw.
      if (chrome.downloads?.showDefaultFolder) chrome.downloads.showDefaultFolder();
      return;
    }

    // Anything else (including PAGE_RESULT — handled by the tabs.ts listener) is
    // not ours; don't respond so other listeners can.
    return;
  });

  async function runScan(
    retailer: string,
    fromDate: string,
    toDate: string,
  ): Promise<{ ok: true; summary: ExportSummary } | { error: string }> {
    scanController = new AbortController();
    const signal = scanController.signal;
    try {
      const adapter = getAdapter(retailer);
      // Load the already-exported set once for the sync dedupe predicate; record
      // each newly-saved order id as the walk reports it.
      const exported = await getExportedOrderIds(retailer);
      const onProgress = (event: ExportProgress) => {
        browser.runtime.sendMessage({ type: "SCAN_PROGRESS", event }).catch(() => {});
        if (event.phase === "exporting" && event.result.status === "saved") {
          exported.add(event.result.orderId);
          void addExportedOrderId(retailer, event.result.orderId);
        }
      };
      const summary = await adapter.exportReceipts({
        fromDate,
        toDate,
        signal,
        onProgress,
        alreadyExported: (id) => exported.has(id),
      });
      return { ok: true, summary };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    } finally {
      // Flush the (fire-and-forget) per-save persistence before we let go, so a
      // scan that just finished can't lose its last saved ids to an SW teardown.
      await flushExportedWrites();
      scanController = null;
    }
  }
});
