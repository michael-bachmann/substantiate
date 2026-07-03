// ---------------------------------------------------------------------------
// Retailer adapter contract — the FSA/HSA receipt export walk.
//
// A RetailerAdapter owns its full walk lifecycle (tab open/close, navigation,
// page-result coordination) and exposes one capability: exportReceipts, which
// walks a retailer's orders in a date range and saves each FSA/HSA-eligible
// invoice as a named PDF. Promoted from the reference fsa-export module's local
// types so the background handler, messaging client, and registry share them.
// ---------------------------------------------------------------------------

/** An adapter that exports a retailer's FSA/HSA-eligible receipts. */
export interface RetailerAdapter {
  /** Retailer identifier, e.g. "amazon". */
  id: string;
  /** Display label, e.g. "Amazon". */
  label: string;
  /** Landing URL where the walk starts (the transactions list). */
  startUrl: string;
  /** Walk orders in the date range and save each FSA-eligible invoice as a PDF. */
  exportReceipts(opts: ExportOptions): Promise<ExportSummary>;
}

export interface ExportOptions {
  /** ISO YYYY-MM-DD, inclusive. */
  fromDate: string;
  /** ISO YYYY-MM-DD, inclusive. */
  toDate: string;
  signal?: AbortSignal;
  onProgress?: (e: ExportProgress) => void;
  /** Sync predicate: is this order already saved from a prior run? Pre-loaded by
   *  the caller so the walk can skip it without navigating. */
  alreadyExported?: (orderId: string) => boolean;
}

/** Two-phase progress: first the transactions-list walk (count unknown), then
 *  one event per order in the export loop carrying that order's result. */
export type ExportProgress =
  | { phase: "collecting" } // paging the tx list; count unknown
  | { phase: "exporting"; index: number; total: number; result: ExportResult };

export type ExportResult =
  | { orderId: string; status: "saved"; filename: string; fsaEligibleCents: number }
  | { orderId: string; status: "skipped"; reason: "no-fsa-line" | "no-order-date" | "already-saved" }
  | { orderId: string; status: "login-required" }
  | { orderId: string; status: "error"; message: string };

export interface ExportSummary {
  saved: ExportResult[];
  skipped: ExportResult[];
  errors: ExportResult[];
  /** True when the walk hit a sign-in wall — results so far are still returned. */
  signedOut: boolean;
  ordersConsidered: number;
}
