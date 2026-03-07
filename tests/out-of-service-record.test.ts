import { assertEquals } from "@std/assert";
import { OutOfServiceRecordSchema } from "../src/out-of-service-record.ts";

const validOOS = {
  uid: "oos-1",
  uid_product: "prod-1",
  reason: "damaged",
  quantity: 2,
  quantity_return_to_service: 1,
  quantity_write_off: 1,
  date_start: "2026-03-01",
  source: { type: "order", number: 1001, uid: "order-1" },
};

Deno.test("OutOfServiceRecordSchema validates a complete document", () => {
  assertEquals(OutOfServiceRecordSchema.safeParse(validOOS).success, true);
});

Deno.test("OutOfServiceRecordSchema validates all reasons", () => {
  const reasons = ["cleaning", "damaged", "maintenance", "lost"];
  for (const reason of reasons) {
    const doc = { ...validOOS, reason };
    assertEquals(doc.reason, reason);
    assertEquals(OutOfServiceRecordSchema.safeParse(doc).success, true, `reason "${reason}" should be valid`);
  }
});

Deno.test("OutOfServiceRecordSchema rejects invalid reason", () => {
  const doc = { ...validOOS, reason: "stolen" };
  assertEquals(OutOfServiceRecordSchema.safeParse(doc).success, false);
});

Deno.test("OutOfServiceRecordSchema validates with stores and transactions", () => {
  const doc = {
    ...validOOS,
    complete: true,
    date_end: "2026-03-15",
    stores: [{
      uid_store: "store-1",
      name: "Main",
      locations: [{
        uid_location: "loc-1",
        name: "Shelf A",
        transactionQuantity: 2,
        default: true,
      }],
    }],
    transactions: [{
      date: "2026-03-01",
      out_of_service_uid: "oos-1",
      quantity: 2,
      type: "quarantine",
    }],
  };
  assertEquals(OutOfServiceRecordSchema.safeParse(doc).success, true);
});

Deno.test("OutOfServiceRecordSchema rejects additional properties", () => {
  const doc = { ...validOOS, bogus: true };
  assertEquals(OutOfServiceRecordSchema.safeParse(doc).success, false);
});
