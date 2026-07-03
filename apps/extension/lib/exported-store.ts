import { browser } from "wxt/browser";

// ---------------------------------------------------------------------------
// Saved-order-id persistence — the dedupe memory for the FSA export walk.
//
// One `browser.storage.local` key holds a `{ [retailer]: orderId[] }` map. The
// background loads a retailer's set once per scan for the sync `alreadyExported`
// predicate, and appends each newly-saved order id so a re-run skips it without
// re-navigating its invoice. Robust to a missing/empty store.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "exportedOrderIds";

type ExportedMap = Record<string, string[]>;

async function readMap(): Promise<ExportedMap> {
  const stored = await browser.storage.local.get(STORAGE_KEY);
  const map = stored[STORAGE_KEY];
  // Missing or malformed store → start empty.
  return map && typeof map === "object" ? (map as ExportedMap) : {};
}

/** The set of order ids already exported for a retailer (empty if none). */
export async function getExportedOrderIds(retailer: string): Promise<Set<string>> {
  const map = await readMap();
  return new Set(map[retailer] ?? []);
}

// Writes are serialized through this chain so overlapping fire-and-forget calls
// can't interleave their read-modify-write on the shared key and drop an id.
// (Saves are sequential in practice, but this makes correctness structural, not
// timing-dependent.)
let writeChain: Promise<void> = Promise.resolve();

async function appendExportedOrderId(retailer: string, orderId: string): Promise<void> {
  const map = await readMap();
  const ids = map[retailer] ?? [];
  if (ids.includes(orderId)) return;
  map[retailer] = [...ids, orderId];
  await browser.storage.local.set({ [STORAGE_KEY]: map });
}

/** Record a newly-saved order id for a retailer. Idempotent — a duplicate id is
 *  a no-op, so the stored list stays a set. Serialized against concurrent calls. */
export function addExportedOrderId(retailer: string, orderId: string): Promise<void> {
  const next = writeChain.then(() => appendExportedOrderId(retailer, orderId));
  // Advance the chain past a rejected write so one storage failure can't stall
  // every later write (or make flushExportedWrites reject). The returned promise
  // still surfaces the error to a direct awaiter.
  writeChain = next.catch(() => {});
  return next;
}

/** Resolve once all pending {@link addExportedOrderId} writes have flushed. */
export function flushExportedWrites(): Promise<void> {
  return writeChain;
}
