export const SELECTORS = {
  // Transactions page
  dateContainer: ".apx-transaction-date-container",
  lineItem: ".apx-transactions-line-item-component-container",
  amountSpan: ".a-span3 span, .a-text-right span",
  orderLink: "a[href*='orderID=']",
  // Amazon's pagination widget emits an input whose `name` encodes the event
  // (`ppw-widgetEvent:DefaultNextPageNavigationEvent:...`). Stable across pages;
  // `aria-labelledby` is present on page 0 only.
  nextPageButton:
    'span.a-button:not(.a-button-disabled) input[type="submit"][name*="NextPageNavigationEvent"]',

  // Invoice print page (gp/css/summary/print.html). Order metadata lives in
  // `data-component` blocks; the FSA total is the one Order Summary row
  // (`.od-line-item-row`) whose label reads "FSA or HSA eligible:".
  orderDateComponent: "[data-component='orderDate']",
  orderIdComponent: "[data-component='orderId']",
  summaryLineRow: ".od-line-item-row",
  summaryLineLabel: ".od-line-item-row-label",
  summaryLineContent: ".od-line-item-row-content",
} as const;

// Distinguishes the order-summary "FSA or HSA eligible:" total row from the
// per-item return-eligibility badges (which aren't `.od-line-item-row`).
export const FSA_ELIGIBLE_LABEL_REGEX = /fsa\s+or\s+hsa\s+eligible/i;

// Amazon's auth URLs appear as `/ap/signin?...` (query, no trailing slash) as
// well as `/ap/signin/...`. Match the segment when followed by `/`, `?`, or
// end-of-string so a logged-out redirect is detected rather than scraped.
export const AUTH_PAGE_REGEX = /\/ap\/(signin|challenge|cvf)(?:[/?]|$)/i;

export const TRANSACTIONS_URL =
  "https://www.amazon.com/cpe/yourpayments/transactions";

export function invoicePrintUrl(orderId: string): string {
  return `https://www.amazon.com/gp/css/summary/print.html?orderID=${encodeURIComponent(orderId)}`;
}
