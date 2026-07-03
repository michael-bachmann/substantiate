import { SELECTORS, FSA_ELIGIBLE_LABEL_REGEX } from "./selectors";

// ---------------------------------------------------------------------------
// Raw types — internal to the content-script scraper. The adapter maps these
// into ScrapedOrder for the pipeline.
// ---------------------------------------------------------------------------

export interface RawTransaction {
  date: string; // ISO date
  amountCents: number;
  orderId: string | null;
  isRefund: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

/**
 * Parse a natural-language date like "May 17, 2026" to ISO "2026-05-17".
 * Returns null if the input cannot be parsed.
 */
export function parseNaturalDate(dateStr: string): string | null {
  const m = dateStr.trim().match(/^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS[m[1]];
  if (!month) return null;
  const day = m[2].padStart(2, "0");
  return `${m[3]}-${month}-${day}`;
}

/**
 * Parse a dollar string like "$42.99" or "+$3.50" to integer cents (4299, 350).
 * Strips everything except digits and the decimal point, then rounds.
 */
export function parseCents(dollarStr: string): number {
  const cleaned = dollarStr.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  return Math.round(parseFloat(cleaned) * 100);
}

// ---------------------------------------------------------------------------
// Transaction parsing (transactions page)
// ---------------------------------------------------------------------------

export function parseTransactionsFromDocument(
  doc: Document,
): RawTransaction[] {
  const results: RawTransaction[] = [];
  let currentDate: string | null = null;

  const dateContainers = doc.querySelectorAll(SELECTORS.dateContainer);
  dateContainers.forEach((dateEl) => {
    const dateSpan = dateEl.querySelector("span");
    if (dateSpan) {
      currentDate = parseNaturalDate(dateSpan.textContent?.trim() ?? "");
    }
    if (!currentDate) return;
    const date = currentDate;

    const sibling = dateEl.nextElementSibling;
    if (!sibling) return;

    sibling.querySelectorAll(SELECTORS.lineItem).forEach((item) => {
      const text = item.textContent ?? "";
      const amountEl = item.querySelector(SELECTORS.amountSpan);
      if (!amountEl) return;
      const amountText = amountEl.textContent?.trim() ?? "";
      const isRefund = /refund/i.test(text) || amountText.startsWith("+");
      const amountCents = parseCents(amountText);

      let orderId: string | null = null;
      const orderLink = item.querySelector(SELECTORS.orderLink);
      if (orderLink) {
        const orderMatch = (orderLink.getAttribute("href") ?? "").match(
          /orderID=([^&]+)/,
        );
        if (orderMatch) orderId = orderMatch[1];
      }

      results.push({
        date,
        amountCents,
        orderId,
        isRefund,
      });
    });
  });

  return results;
}

// ---------------------------------------------------------------------------
// Invoice print page parsing (gp/css/summary/print.html) — FSA export
// ---------------------------------------------------------------------------

/** Collapse runs of whitespace (the print markup wraps label text across many
 *  lines) so a label regex can match "FSA or HSA eligible". */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export interface InvoicePrintData {
  orderId: string;
  /** ISO date the order was placed, or null if the date couldn't be parsed. */
  orderDate: string | null;
  /** The "FSA or HSA eligible: (inc. tax and shipping)" total in cents, or null
   *  when the order has no FSA line (i.e. nothing FSA-eligible). */
  fsaEligibleCents: number | null;
}

/**
 * Read the order date, id, and FSA-eligible total off the printable invoice.
 * The page is self-sufficient — it carries all three inline — so the export
 * needs no second navigation to the order-details page.
 */
export function parseInvoicePrintPage(doc: Document): InvoicePrintData {
  const orderId = normalizeWhitespace(
    doc.querySelector(SELECTORS.orderIdComponent)?.textContent ?? "",
  );
  const orderDate = parseNaturalDate(
    normalizeWhitespace(doc.querySelector(SELECTORS.orderDateComponent)?.textContent ?? ""),
  );

  let fsaEligibleCents: number | null = null;
  for (const row of doc.querySelectorAll(SELECTORS.summaryLineRow)) {
    const label = normalizeWhitespace(
      row.querySelector(SELECTORS.summaryLineLabel)?.textContent ?? "",
    );
    if (!FSA_ELIGIBLE_LABEL_REGEX.test(label)) continue;
    const amount = row.querySelector(SELECTORS.summaryLineContent)?.textContent ?? "";
    fsaEligibleCents = parseCents(amount);
    break;
  }

  return { orderId, orderDate, fsaEligibleCents };
}
