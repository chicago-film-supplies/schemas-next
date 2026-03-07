import { assertEquals } from "@std/assert";
import { TransactionSchema } from "../src/transaction.ts";

const validTransaction = {
  uid: "txn-1",
  uid_product: "prod-1",
  type: "purchase",
  quantity: 10,
  total_cost: 2500,
  unit_cost: 250,
  reference: "PO-001",
};

Deno.test("TransactionSchema validates a complete document", () => {
  assertEquals(TransactionSchema.safeParse(validTransaction).success, true);
});

Deno.test("TransactionSchema validates all transaction types", () => {
  const types = [
    "purchase", "find", "make", "opening_balance", "adjustment_increase",
    "sale", "write_off", "trade_in", "adjustment_decrease",
    "transfer_increase", "transfer_decrease",
    "acquisition", "disposal", "partial_disposal",
    "depreciation_tax", "depreciation_gaap",
  ];
  for (const type of types) {
    const doc = { ...validTransaction, type };
    assertEquals(TransactionSchema.safeParse(doc).success, true, `type "${type}" should be valid`);
  }
});

Deno.test("TransactionSchema rejects invalid type", () => {
  const doc = { ...validTransaction, type: "invalid" };
  assertEquals(TransactionSchema.safeParse(doc).success, false);
});

Deno.test("TransactionSchema validates with source", () => {
  const doc = {
    ...validTransaction,
    source: { type: "order", number: 1001, uid: "order-1" },
  };
  assertEquals(TransactionSchema.safeParse(doc).success, true);
});

Deno.test("TransactionSchema validates with stores", () => {
  const doc = {
    ...validTransaction,
    stores: [{
      uid_store: "store-1",
      name: "Main",
      default: true,
      locations: [{
        uid_location: "loc-1",
        name: "Shelf A",
        transactionQuantity: 10,
        default: true,
      }],
    }],
  };
  assertEquals(TransactionSchema.safeParse(doc).success, true);
});

Deno.test("TransactionSchema validates with serialized_details", () => {
  const doc = {
    ...validTransaction,
    serialized_details: {
      asset_tags: ["AT-001", "AT-002"],
      serial_numbers: ["SN-001"],
    },
  };
  assertEquals(TransactionSchema.safeParse(doc).success, true);
});

Deno.test("TransactionSchema rejects additional properties", () => {
  const doc = { ...validTransaction, bogus: true };
  assertEquals(TransactionSchema.safeParse(doc).success, false);
});
