import { assertEquals } from "@std/assert";
import { PublicStockSummarySchema } from "../src/public-stock-summary.ts";

const validSummary = {
  uid: "pss-1",
  uid_product: "prod-1",
  summary_type: "rental",
  type: "rental",
  dates: { start: "2026-03-01" },
  quantity_available: 10,
  store_breakdown: [{ uid_store: "store-1", quantity: 10 }],
  query_by_uid_store: ["store-1"],
};

Deno.test("PublicStockSummarySchema validates a complete document", () => {
  assertEquals(PublicStockSummarySchema.safeParse(validSummary).success, true);
});

Deno.test("PublicStockSummarySchema accepts optional uid", () => {
  const { uid: _, ...doc } = validSummary;
  assertEquals(PublicStockSummarySchema.safeParse(doc).success, true);
});

Deno.test("PublicStockSummarySchema rejects invalid summary_type", () => {
  const doc = { ...validSummary, summary_type: "invalid" };
  assertEquals(PublicStockSummarySchema.safeParse(doc).success, false);
});

Deno.test("PublicStockSummarySchema rejects additional properties", () => {
  const doc = { ...validSummary, bogus: true };
  assertEquals(PublicStockSummarySchema.safeParse(doc).success, false);
});
