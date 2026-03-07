import { assertEquals } from "@std/assert";
import { LocationSchema } from "../src/location.ts";

const validLocation = {
  uid: "loc-1",
  uid_store: "store-1",
  name: "Aisle A",
  default: true,
  uid_location_type: null,
  active: true,
  product_capacities: [{ uid: "p1", max: 50, max_default: 40 }],
  query_by_product_capacities: ["p1"],
  products: [{ uid: "p1", name: "LED Panel", quantity: 10, default: true }],
  query_by_products: ["p1"],
  created_at: null,
  updated_at: null,
};

Deno.test("LocationSchema validates a complete document", () => {
  assertEquals(LocationSchema.safeParse(validLocation).success, true);
});

Deno.test("LocationSchema defaults arrays when omitted", () => {
  const { product_capacities: _, query_by_product_capacities: _q, products: _p, query_by_products: _qp, ...doc } = validLocation;
  assertEquals(LocationSchema.safeParse(doc).success, true);
});

Deno.test("LocationSchema rejects missing uid_store", () => {
  const { uid_store: _, ...doc } = validLocation;
  assertEquals(LocationSchema.safeParse(doc).success, false);
});

Deno.test("LocationSchema accepts null max_default", () => {
  const doc = {
    ...validLocation,
    product_capacities: [{ uid: "p1", max: 50, max_default: null }],
  };
  assertEquals(LocationSchema.safeParse(doc).success, true);
});

Deno.test("LocationSchema rejects additional properties", () => {
  const doc = { ...validLocation, bogus: true };
  assertEquals(LocationSchema.safeParse(doc).success, false);
});
