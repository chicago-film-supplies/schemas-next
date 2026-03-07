import { assertEquals } from "@std/assert";
import { InventoryLedgerSchema } from "../src/inventory-ledger.ts";

const validLedger = {
  uid: "il-1",
  uid_product: "prod-1",
  type: "rental",
  stock_method: "bulk",
  quantity_held: 20,
  quantity_in_service: 18,
  quantity_out_of_service: 2,
  out_of_service_breakdown: { damaged: 1, maintenance: 1 },
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

Deno.test("InventoryLedgerSchema validates a complete document", () => {
  assertEquals(InventoryLedgerSchema.safeParse(validLedger).success, true);
});

Deno.test("InventoryLedgerSchema rejects invalid type", () => {
  const doc = { ...validLedger, type: "invalid" };
  assertEquals(InventoryLedgerSchema.safeParse(doc).success, false);
});

Deno.test("InventoryLedgerSchema rejects invalid stock_method", () => {
  const doc = { ...validLedger, stock_method: "none" };
  assertEquals(InventoryLedgerSchema.safeParse(doc).success, false);
});

Deno.test("InventoryLedgerSchema accepts optional cost fields", () => {
  const doc = {
    ...validLedger,
    average_unit_cost: 250.50,
    total_cost_basis: 5010,
  };
  assertEquals(InventoryLedgerSchema.safeParse(doc).success, true);
});

Deno.test("InventoryLedgerSchema rejects additional properties", () => {
  const doc = { ...validLedger, bogus: true };
  assertEquals(InventoryLedgerSchema.safeParse(doc).success, false);
});
