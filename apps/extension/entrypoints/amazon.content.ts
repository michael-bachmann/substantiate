import {
  parseTransactionsFromDocument,
  parseInvoicePrintPage,
} from "@/retailers/amazon/scraper";
import { SELECTORS } from "@/retailers/amazon/selectors";
import {
  detectAmazonPageKind,
  transactionsFingerprint,
  hasNextPage,
  orderIdFromUrl,
  type AmazonPageResult,
} from "@/retailers/amazon/page";
import { waitUntil, waitForElement, waitForQuietDom } from "@/lib/dom-wait";

/** Actions the adapter triggers on the live page. Neither needs a reply: the
 *  adapter reacts to the PAGE_RESULT the page sends afterwards, not to a return
 *  value — so an action that navigates (and destroys this context) is fine. */
type ContentMessage =
  | { type: "PING" }
  | { type: "DESCRIBE" }
  | { type: "NEXT_PAGE" };

export default defineContentScript({
  matches: ["*://*.amazon.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message: ContentMessage, sender) => {
      if (sender.id !== browser.runtime.id) return;
      // PING is the only message anyone awaits a reply to (the readiness
      // handshake used when opening/navigating a tab); answer it with a Promise.
      // DESCRIBE/NEXT_PAGE are fire-and-forget triggers — the page answers by
      // sending a PAGE_RESULT, so there's no response here.
      if (message.type === "PING") return Promise.resolve({ pong: true });
      if (message.type === "NEXT_PAGE") void turnPage();
      else void describe();
    });

    // Describe this page as soon as it's loaded. This is what makes a navigation
    // (or Firefox's reload-on-page-turn) a non-event: whatever page lands here
    // announces itself, and the adapter's awaitPageResult resolves on it.
    void describe();
  },
});

/** Detect the page, wait for its meaningful DOM, parse, and report one result. */
async function describe(): Promise<void> {
  const kind = detectAmazonPageKind(window.location.href);
  switch (kind) {
    case "login":
      return post({ pageKind: "login" });

    case "transactions": {
      // The list renders asynchronously after load; wait for rows before reading
      // so we never report an empty page and skip real transactions.
      await waitForElement(SELECTORS.lineItem);
      const transactions = parseTransactionsFromDocument(document);
      return post({
        pageKind: "transactions",
        fingerprint: transactionsFingerprint(transactions),
        hasNext: hasNextPage(document),
        transactions,
      });
    }

    case "invoice-print": {
      // The printable invoice is server-rendered (not async like the
      // transactions list); the Order Summary rows anchor readiness. Wait for
      // them, then read the date, id, and FSA-eligible total off the page.
      await waitForElement(SELECTORS.summaryLineRow);
      const { orderId, orderDate, fsaEligibleCents } = parseInvoicePrintPage(document);
      return post({
        pageKind: "invoice-print",
        orderId: orderId || orderIdFromUrl(window.location.href),
        orderDate,
        fsaEligibleCents,
      });
    }

    default:
      // Unrecognized page — nothing awaits an "other" result, so don't post one
      // (it would only sit in the buffer as noise). The adapter's await times out
      // on its own if it ever lands somewhere unexpected.
      // Surface the landing URL: an unclassified page means the adapter's await
      // will time out (we post nothing), so a future Amazon redirect that breaks
      // classification shows up as an actionable log instead of a silent 30s hang.
      console.warn(`[amazon] landed on unclassified page: ${window.location.href}`);
      return;
  }
}

/** Turn Amazon's transactions pager. In Chrome this is an in-page AJAX swap, so
 *  the same context waits for the new rows and re-describes; in Firefox the click
 *  reloads the page, so this context is torn down and the freshly-loaded page
 *  describes itself. Either way the adapter gets the next transactions result. */
async function turnPage(): Promise<void> {
  const nextButton = document.querySelector<HTMLInputElement>(SELECTORS.nextPageButton);
  if (!nextButton) {
    // No next page after all — re-describe so the adapter sees hasNext:false.
    return describe();
  }
  const sentinel = document.querySelector(SELECTORS.lineItem);
  nextButton.click();
  // Wait for the AJAX swap to replace the old rows with new ones (Chrome), then
  // let the new rows finish rendering before we read — same settle contract as
  // Target's Load more, so we never describe a half-swapped page. On a Firefox
  // reload this context is torn down mid-wait and the fresh page describes
  // itself instead — either way the adapter gets the next result.
  if (sentinel) {
    const swapped = await waitUntil(
      () => !sentinel.isConnected && document.querySelector(SELECTORS.lineItem) !== null,
      { timeoutMs: 15_000 },
    );
    if (swapped) await waitForQuietDom({ quietMs: 400, timeoutMs: 4_000 });
  }
  return describe();
}

function post(result: AmazonPageResult): void {
  // Fire-and-forget: the background's PAGE_RESULT listener has no response.
  browser.runtime.sendMessage({ type: "PAGE_RESULT", result }).catch(() => {});
}
