import { assertEquals } from "@std/assert";
import { StockSummarySchema } from "../src/stock-summary.ts";

const validSummary = {
  uid: "ss-1",
  uid_product: "prod-1",
  summary_type: "rental",
  type: "rental",
  dates: { start: "2026-03-01" },
  bookings: [],
  bookings_breakdown: { reserved: 3, out: 2 },
  out_of_service_breakdown: { damaged: 1 },
  quantity_available: 10,
  quantity_booked: 5,
  quantity_held: 20,
  quantity_in_service: 18,
  quantity_out_of_service: 2,
  store_breakdown: [{
    uid_store: "store-1",
    name: "Main",
    quantity: 20,
    locations: [{
      uid_location: "loc-1",
      name: "Shelf A",
      quantity: 20,
      default: true,
      notes: [],
    }],
  }],
  query_by_uid_store: ["store-1"],
};

Deno.test("StockSummarySchema validates a complete document", () => {
  assertEquals(StockSummarySchema.safeParse(validSummary).success, true);
});

Deno.test("StockSummarySchema rejects invalid summary_type", () => {
  const doc = { ...validSummary, summary_type: "lease" };
  assertEquals(StockSummarySchema.safeParse(doc).success, false);
});

Deno.test("StockSummarySchema rejects invalid type", () => {
  const doc = { ...validSummary, type: "invalid" };
  assertEquals(StockSummarySchema.safeParse(doc).success, false);
});

Deno.test("StockSummarySchema accepts sale summary_type", () => {
  const doc = { ...validSummary, summary_type: "sale", type: "sale" };
  assertEquals(StockSummarySchema.safeParse(doc).success, true);
});

Deno.test("StockSummarySchema rejects additional properties", () => {
  const doc = { ...validSummary, bogus: true };
  assertEquals(StockSummarySchema.safeParse(doc).success, false);
});
