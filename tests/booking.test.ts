import { assertEquals } from "@std/assert";
import { BookingSchema } from "../src/booking.ts";

const validBooking = {
  uid: "b-1",
  uid_order: "order-1",
  uid_product: "prod-1",
  name: "LED Panel",
  number: 1,
  type: "rental",
  status: "reserved",
  quantity: 5,
  shortage: 0,
  subject: "Event lighting",
  unit_price: 100,
  total_price: 500,
  breakdown: {
    damaged: 0,
    lost: 0,
    out: 0,
    prepped: 0,
    quoted: 0,
    reserved: 5,
    returned: 0,
  },
  dates: {
    start: "2026-03-01",
    start_fs: null,
    end: "2026-03-10",
    end_fs: null,
    charge_start: "2026-03-01",
    charge_start_fs: null,
    charge_end: "2026-03-10",
    charge_end_fs: null,
  },
  destinations: {
    delivery: null,
    collection: null,
  },
  organization: { uid: "org-1", name: "Acme Corp", crms_id: null },
  stores: [],
  query_by_uid_store: [],
  uid_destination_delivery: "dest-1",
  uid_destination_collection: "dest-2",
  created_at: null,
  updated_at: null,
};

Deno.test("BookingSchema validates a complete document", () => {
  assertEquals(BookingSchema.safeParse(validBooking).success, true);
});

Deno.test("BookingSchema validates with stores", () => {
  const doc = {
    ...validBooking,
    stores: [{
      uid_store: "store-1",
      name: "Main",
      default: true,
      quantity: 5,
      locations: [{
        uid_location: "loc-1",
        name: "Shelf A",
        quantity: 5,
        default: true,
        notes: [{ note: "Handle with care" }],
      }],
    }],
    query_by_uid_store: ["store-1"],
  };
  assertEquals(BookingSchema.safeParse(doc).success, true);
});

Deno.test("BookingSchema validates with destination refs", () => {
  const doc = {
    ...validBooking,
    destinations: {
      delivery: { uid: "dest-1", address: null },
      collection: null,
    },
  };
  assertEquals(BookingSchema.safeParse(doc).success, true);
});

Deno.test("BookingSchema accepts optional crms_id fields", () => {
  const doc = {
    ...validBooking,
    crms_id: 123,
    crms_product_id: 456,
  };
  assertEquals(BookingSchema.safeParse(doc).success, true);
});

Deno.test("BookingSchema rejects invalid status", () => {
  const doc = { ...validBooking, status: "invalid" };
  assertEquals(BookingSchema.safeParse(doc).success, false);
});

Deno.test("BookingSchema rejects invalid type", () => {
  const doc = { ...validBooking, type: "surcharge" };
  assertEquals(BookingSchema.safeParse(doc).success, false);
});

Deno.test("BookingSchema accepts part-prepped status", () => {
  const doc = { ...validBooking, status: "part-prepped" };
  assertEquals(BookingSchema.safeParse(doc).success, true);
});

Deno.test("BookingSchema rejects additional properties", () => {
  const doc = { ...validBooking, bogus: true };
  assertEquals(BookingSchema.safeParse(doc).success, false);
});
