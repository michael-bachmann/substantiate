// @vitest-environment happy-dom
import { describe, expect, it, beforeEach } from "vitest";
import {
  parseCents,
  parseNaturalDate,
  parseTransactionsFromDocument,
  parseInvoicePrintPage,
} from "./scraper";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("parseCents", () => {
  // These values become the dollar amount in the saved filename
  // (Amazon_YYYY-MM-DD_$amount.pdf), so the parse must be exact.
  it("parses a plain dollar string to integer cents", () => {
    expect(parseCents("$54.86")).toBe(5486);
  });

  it("ignores a leading sign (refund/credit rows read as absolute cents)", () => {
    expect(parseCents("+$3.50")).toBe(350);
  });

  it("strips thousands separators", () => {
    expect(parseCents("$1,234.56")).toBe(123456);
  });

  it("returns 0 for empty or non-numeric input", () => {
    expect(parseCents("")).toBe(0);
    expect(parseCents("—")).toBe(0);
  });
});

describe("parseNaturalDate", () => {
  it("parses 'Month D, YYYY' to an ISO date", () => {
    expect(parseNaturalDate("May 17, 2026")).toBe("2026-05-17");
    expect(parseNaturalDate("June 25, 2026")).toBe("2026-06-25");
  });

  it("zero-pads single-digit days and tolerates a missing comma", () => {
    expect(parseNaturalDate("May 5 2026")).toBe("2026-05-05");
  });

  it("returns null for an unparseable string or an unknown month", () => {
    expect(parseNaturalDate("not a date")).toBeNull();
    expect(parseNaturalDate("Smarch 5, 2026")).toBeNull();
  });
});

describe("parseTransactionsFromDocument", () => {
  // Mirrors the transactions list: a date container followed by its sibling
  // block of line-item rows. An order-linked purchase and a refund row.
  const list = () => `
    <div class="apx-transaction-date-container"><span>June 25, 2026</span></div>
    <div>
      <div class="apx-transactions-line-item-component-container">
        <a href="/gp/css/summary/edit.html?orderID=113-1234567-1234567&ref=abc">Order details</a>
        <div class="a-text-right"><span>$54.86</span></div>
      </div>
      <div class="apx-transactions-line-item-component-container">
        <span>Refund: Amazon.com</span>
        <div class="a-text-right"><span>+$10.00</span></div>
      </div>
    </div>`;

  it("reads date, cents, and orderId, and flags refund rows", () => {
    document.body.innerHTML = list();
    expect(parseTransactionsFromDocument(document)).toEqual([
      { date: "2026-06-25", amountCents: 5486, orderId: "113-1234567-1234567", isRefund: false },
      { date: "2026-06-25", amountCents: 1000, orderId: null, isRefund: true },
    ]);
  });

  it("returns nothing when the date can't be parsed", () => {
    document.body.innerHTML = `
      <div class="apx-transaction-date-container"><span>whenever</span></div>
      <div>
        <div class="apx-transactions-line-item-component-container">
          <div class="a-text-right"><span>$9.99</span></div>
        </div>
      </div>`;
    expect(parseTransactionsFromDocument(document)).toEqual([]);
  });
});

describe("parseInvoicePrintPage", () => {
  // Mirrors the real gp/css/summary/print.html structure: order metadata in
  // data-component blocks, the FSA total as one Order Summary `.od-line-item-row`
  // among several. The label text wraps across lines on the live page.
  const summaryRow = (label: string, amount: string) => `
    <div class="a-row od-line-item-row">
      <div class="a-column a-span7 od-line-item-row-label">
        <span class="a-size-base"><span>${label}</span></span>
      </div>
      <div class="a-column a-span5 od-line-item-row-content a-span-last">
        <span class="a-size-base a-color-base"> ${amount} </span>
      </div>
    </div>`;

  const page = (rows: string) => `
    <div data-component="orderDate">
      <span>June 25, 2026 <i class="a-icon a-icon-text-separator"></i></span>
    </div>
    <div data-component="orderId"><span>113-5188431-8096216</span></div>
    <!-- a per-item return-eligibility badge: contains "Eligible" but is NOT a
         summary row, so it must not be mistaken for the FSA total. -->
    <div data-component="itemReturnEligibility">
      <span class="a-size-small">Return items: Eligible through July 27, 2026</span>
    </div>
    <ul>${rows}</ul>`;

  it("reads orderId, ISO date, and FSA-eligible cents from the FSA row", () => {
    document.body.innerHTML = page(
      summaryRow("Items subtotal:", "$50.00") +
        summaryRow("Total before tax:", "$50.00") +
        summaryRow("FSA or HSA eligible: <br />(inc. tax and shipping)", "$54.86") +
        summaryRow("Grand Total:", "$54.86"),
    );
    expect(parseInvoicePrintPage(document)).toEqual({
      orderId: "113-5188431-8096216",
      orderDate: "2026-06-25",
      fsaEligibleCents: 5486,
    });
  });

  it("returns null fsaEligibleCents when the order has no FSA line", () => {
    document.body.innerHTML = page(
      summaryRow("Items subtotal:", "$50.00") + summaryRow("Grand Total:", "$53.00"),
    );
    expect(parseInvoicePrintPage(document).fsaEligibleCents).toBeNull();
  });
});
