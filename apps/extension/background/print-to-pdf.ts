// ---------------------------------------------------------------------------
// Print a loaded tab to a PDF file via the Chrome DevTools Protocol.
//
// An extension can't drive the OS print dialog (window.print is interactive and
// out of reach), so to get a named PDF we attach the debugger to the tab, call
// CDP `Page.printToPDF` (which renders the page to base64-encoded PDF bytes with
// no dialog), and hand those bytes to `chrome.downloads` with a chosen filename.
//
// Chrome-only: `chrome.debugger` has no Firefox equivalent. This whole module is
// part of the FSA-export prototype and is never reached on the Firefox build.
// ---------------------------------------------------------------------------

/** Minimal shape of the CDP Page.printToPDF reply. */
interface PrintToPdfResult {
  data: string; // base64-encoded PDF
}

function attachDebugger(tabId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach({ tabId }, "1.3", () => {
      const err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else resolve();
    });
  });
}

function detachDebugger(tabId: number): Promise<void> {
  return new Promise((resolve) => {
    // Best-effort: a detach failure (e.g. tab already gone) shouldn't mask the
    // real result, so swallow lastError here.
    chrome.debugger.detach({ tabId }, () => {
      void chrome.runtime.lastError;
      resolve();
    });
  });
}

function sendCommand<T>(
  tabId: number,
  method: string,
  params: Record<string, unknown>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand({ tabId }, method, params, (result) => {
      const err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else resolve(result as T);
    });
  });
}

function downloadDataUrl(url: string, filename: string): Promise<number> {
  return new Promise((resolve, reject) => {
    chrome.downloads.download(
      { url, filename, saveAs: false, conflictAction: "uniquify" },
      (downloadId) => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve(downloadId);
      },
    );
  });
}

/**
 * Render the page currently loaded in `tabId` to a PDF and save it to the
 * browser's downloads as `filename` (e.g. "Amazon_2026-06-25_$54.86.pdf").
 * The tab must already be fully loaded. Resolves with the download id.
 */
export async function printTabToPdf(tabId: number, filename: string): Promise<number> {
  await attachDebugger(tabId);
  try {
    const { data } = await sendCommand<PrintToPdfResult>(tabId, "Page.printToPDF", {
      printBackground: true,
      // Amazon's invoice is letter-sized; preferCSSPageSize keeps any @page
      // rules the print stylesheet sets, falling back to these dimensions.
      preferCSSPageSize: true,
    });
    // MV3 service workers have no URL.createObjectURL, so feed downloads a data:
    // URL. An invoice is a page or two — well within the data-URL size limit.
    const dataUrl = `data:application/pdf;base64,${data}`;
    return await downloadDataUrl(dataUrl, filename);
  } finally {
    await detachDebugger(tabId);
  }
}
