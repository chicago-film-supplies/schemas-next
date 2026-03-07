import { assertEquals } from "@std/assert";
import { DestinationSchema } from "../src/destination.ts";

Deno.test("DestinationSchema validates a complete document", () => {
  const doc = {
    uid: "dest-1",
    address: {
      city: "Chicago",
      country_name: "US",
      full: "123 Main St",
      name: "Main",
      postcode: "60601",
      region: "IL",
      street: "123 Main St",
    },
    mapbox_ids: ["mbx-1"],
    organizations: [{ uid: "org-1", name: "Acme" }],
    query_by_organizations: ["org-1"],
  };
  assertEquals(DestinationSchema.safeParse(doc).success, true);
});

Deno.test("DestinationSchema accepts null address", () => {
  const doc = { uid: "dest-1", address: null, mapbox_ids: [] };
  assertEquals(DestinationSchema.safeParse(doc).success, true);
});

Deno.test("DestinationSchema rejects missing uid", () => {
  assertEquals(DestinationSchema.safeParse({ address: null }).success, false);
});

Deno.test("DestinationSchema rejects additional properties", () => {
  const doc = { uid: "dest-1", address: null, mapbox_ids: [], bogus: true };
  assertEquals(DestinationSchema.safeParse(doc).success, false);
});
