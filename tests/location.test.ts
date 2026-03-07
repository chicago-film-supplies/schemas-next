import { assertEquals } from "@std/assert";
import { LocationSchema } from "../src/location.ts";

Deno.test("LocationSchema validates a complete document", () => {
  const doc = {
    uid: "loc-1",
    uid_store: "store-1",
    name: "Aisle A",
    default: true,
    active: true,
    product_capacities: [{ uid: "p1", max: 50, max_default: 40 }],
    products: [{ uid: "p1", name: "LED Panel", quantity: 10, default: true }],
    query_by_products: ["p1"],
  };
  assertEquals(LocationSchema.safeParse(doc).success, true);
});

Deno.test("LocationSchema accepts minimal fields", () => {
  const doc = {
    uid: "loc-1",
    uid_store: "store-1",
    name: "Bin B",
    active: true,
  };
  assertEquals(LocationSchema.safeParse(doc).success, true);
});

Deno.test("LocationSchema rejects missing uid_store", () => {
  const doc = { uid: "loc-1", name: "Bin", active: true };
  assertEquals(LocationSchema.safeParse(doc).success, false);
});

Deno.test("LocationSchema rejects additional properties", () => {
  const doc = {
    uid: "loc-1",
    uid_store: "store-1",
    name: "Bin",
    active: true,
    bogus: true,
  };
  assertEquals(LocationSchema.safeParse(doc).success, false);
});
