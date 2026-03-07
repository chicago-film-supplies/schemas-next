import { assertEquals } from "@std/assert";
import { LocationTypeSchema } from "../src/location-type.ts";

Deno.test("LocationTypeSchema validates a complete document", () => {
  const doc = {
    uid: "lt-1",
    name: "Shelf",
    product_capacities: [{ uid: "p1", max: 10 }],
    active: true,
    dimensions: { width: 100, depth: 50, height: 200, weight_capacity: 500 },
  };
  assertEquals(LocationTypeSchema.safeParse(doc).success, true);
});

Deno.test("LocationTypeSchema accepts null max in capacities", () => {
  const doc = {
    uid: "lt-1",
    name: "Floor",
    product_capacities: [{ uid: "p1", max: null }],
    active: true,
  };
  assertEquals(LocationTypeSchema.safeParse(doc).success, true);
});

Deno.test("LocationTypeSchema accepts null dimensions", () => {
  const doc = {
    uid: "lt-1",
    name: "Bin",
    product_capacities: [],
    active: false,
    dimensions: null,
  };
  assertEquals(LocationTypeSchema.safeParse(doc).success, true);
});

Deno.test("LocationTypeSchema rejects missing name", () => {
  assertEquals(LocationTypeSchema.safeParse({ uid: "lt-1", active: true }).success, false);
});

Deno.test("LocationTypeSchema rejects additional properties", () => {
  const doc = { uid: "lt-1", name: "Shelf", active: true, bogus: true };
  assertEquals(LocationTypeSchema.safeParse(doc).success, false);
});
