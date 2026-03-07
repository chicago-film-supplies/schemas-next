import { assertEquals } from "@std/assert";
import { CacheGeocodesSchema } from "../src/cache-geocodes.ts";

Deno.test("CacheGeocodesSchema validates a complete document", () => {
  const doc = {
    query: "123 Main St, Chicago",
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    mapbox_id: "abc123",
    address: {
      street: "123 Main St",
      city: "Chicago",
      region: "IL",
      postcode: "60601",
      country_name: "United States",
      full: "123 Main St, Chicago, IL 60601",
      name: "123 Main St",
    },
  };
  assertEquals(CacheGeocodesSchema.safeParse(doc).success, true);
});

Deno.test("CacheGeocodesSchema accepts null coordinates", () => {
  const doc = {
    query: "nowhere",
    coordinates: null,
    mapbox_id: "xyz",
    address: {},
  };
  assertEquals(CacheGeocodesSchema.safeParse(doc).success, true);
});

Deno.test("CacheGeocodesSchema rejects missing query", () => {
  const doc = {
    coordinates: { latitude: 0, longitude: 0 },
    mapbox_id: "abc",
    address: {},
  };
  assertEquals(CacheGeocodesSchema.safeParse(doc).success, false);
});

Deno.test("CacheGeocodesSchema rejects additional properties", () => {
  const doc = {
    query: "test",
    coordinates: null,
    mapbox_id: "abc",
    address: {},
    bogus: true,
  };
  assertEquals(CacheGeocodesSchema.safeParse(doc).success, false);
});
