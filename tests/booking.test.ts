import { assertEquals } from "@std/assert";
import { BookingSchema } from "../src/booking.ts";

const validBooking = {
  uid: "b-1",
  uid_order: "order-1",
  uid_product: "prod-1",
  type: "rental",
  status: "reserved",
  quantity: 5,
  breakdown: { reserved: 5 },
  dates: {
    start: "2026-03-01",
    end: "2026-03-10",
    charge_start: "2026-03-01",
    charge_end: "2026-03-10",
  },
  organization: { uid: "org-1", name: "Acme Corp" },
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
