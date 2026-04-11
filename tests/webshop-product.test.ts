import { assertEquals } from "@std/assert";
import { WebshopProductSchema } from "../src/webshop-product.ts";

const validWebshopProduct = {
  uid: "test-wp-1",
  name: "Canon C300",
  active: true,
  type: "rental",
  price: {
    base: 500,
    taxes: [{ uid: "test-chi-rental-tax", name: "Chicago Rental Tax", rate: 15, type: "percent" }],
    formula: "five_day_week",
    discountable: true,
  },
  alternates: {},
  components: [],
  component_of: [],
  webshop: { available: true, description: "Great camera" },
};

Deno.test("WebshopProductSchema validates a complete document", () => {
  assertEquals(WebshopProductSchema.safeParse(validWebshopProduct).success, true);
});

Deno.test("WebshopProductSchema rejects replacement type", () => {
  const doc = { ...validWebshopProduct, type: "replacement" };
  assertEquals(WebshopProductSchema.safeParse(doc).success, false);
});

Deno.test("WebshopProductSchema accepts optional tags", () => {
  const doc = {
    ...validWebshopProduct,
    tags: [{ uid: "test-t1", name: "Camera" }],
    query_by_tags: ["test-t1"],
  };
  assertEquals(WebshopProductSchema.safeParse(doc).success, true);
});

Deno.test("WebshopProductSchema rejects missing required fields", () => {
  assertEquals(WebshopProductSchema.safeParse({ uid: "test-wp-1" }).success, false);
});

Deno.test("WebshopProductSchema rejects additional properties", () => {
  const doc = { ...validWebshopProduct, bogus: true };
  assertEquals(WebshopProductSchema.safeParse(doc).success, false);
});
