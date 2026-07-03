import { beforeEach, describe, expect, it, vi } from "vitest";

// In-memory stand-in for browser.storage.local — WXT's test setup doesn't
// provide one, and the store's whole job is round-tripping through it.
const store = new Map<string, unknown>();
vi.mock("wxt/browser", () => ({
  browser: {
    storage: {
      local: {
        get: async (key: string) => (store.has(key) ? { [key]: store.get(key) } : {}),
        set: async (items: Record<string, unknown>) => {
          for (const [k, v] of Object.entries(items)) store.set(k, v);
        },
      },
    },
  },
}));

import {
  getExportedOrderIds,
  addExportedOrderId,
  flushExportedWrites,
} from "./exported-store";

beforeEach(() => {
  store.clear();
});

describe("exported-store", () => {
  it("returns an empty set from a missing/empty store", async () => {
    await expect(getExportedOrderIds("amazon")).resolves.toEqual(new Set());
  });

  it("records an order id and reads it back", async () => {
    await addExportedOrderId("amazon", "111-222");
    await expect(getExportedOrderIds("amazon")).resolves.toEqual(new Set(["111-222"]));
  });

  it("dedupes a repeated order id", async () => {
    await addExportedOrderId("amazon", "111-222");
    await addExportedOrderId("amazon", "111-222");
    await expect(getExportedOrderIds("amazon")).resolves.toEqual(new Set(["111-222"]));
  });

  it("keeps retailers independent", async () => {
    await addExportedOrderId("amazon", "a-1");
    await addExportedOrderId("target", "t-1");
    await expect(getExportedOrderIds("amazon")).resolves.toEqual(new Set(["a-1"]));
    await expect(getExportedOrderIds("target")).resolves.toEqual(new Set(["t-1"]));
  });

  it("serializes concurrent writes without dropping ids, and flushes them all", async () => {
    // Fire without awaiting each — the read-modify-write must not interleave.
    const ids = ["o-1", "o-2", "o-3", "o-4", "o-5"];
    ids.forEach((id) => void addExportedOrderId("amazon", id));
    await flushExportedWrites();
    await expect(getExportedOrderIds("amazon")).resolves.toEqual(new Set(ids));
  });
});
