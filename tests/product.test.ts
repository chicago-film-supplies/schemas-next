import { assertEquals } from "@std/assert";
import { ProductSchema } from "../src/product.ts";

const validProduct = {
  uid: "test-product-1",
  name: "Canon C300",
  active: true,
  type: "rental",
  stock_method: "bulk",
  component_only: false,
  crms_id: 100,
  price: {
    base: 500,
    taxes: [{ uid: "test-chi-rental-tax", name: "Chicago Rental Tax", rate: 15, type: "percent" }],
    formula: "five_day_week",
    discountable: true,
  },
  alternates: {},
  components: [],
  component_of: [],
  tags: [{ uid: "test-t1", name: "Camera" }],
  webshop: { available: true },
};

Deno.test("ProductSchema validates a complete document", () => {
  assertEquals(ProductSchema.safeParse(validProduct).success, true);
});

Deno.test("ProductSchema validates with shipping", () => {
  const doc = {
    ...validProduct,
    shipping: {
      weight: 5,
      height: 10,
      width: 15,
      length: 20,
      air_hazardous: false,
      air_un: null,
    },
  };
  assertEquals(ProductSchema.safeParse(doc).success, true);
});

Deno.test("ProductSchema validates with components", () => {
  const doc = {
    ...validProduct,
    components: [
      {
        uid: "test-comp-1",
        path: ["test-product-1"],
        name: "Battery",
        type: "rental",
        stock_method: "bulk",
        crms_id: 200,
        quantity: 2,
        price: {
          base: 0,
          taxes: [{ uid: "test-tax-none", name: "No Tax", rate: 0, type: "percent" }],
          formula: "fixed",
          discountable: false,
        },
      },
    ],
  };
  assertEquals(ProductSchema.safeParse(doc).success, true);
});

Deno.test("ProductSchema rejects invalid type", () => {
  const doc = { ...validProduct, type: "invalid" };
  assertEquals(ProductSchema.safeParse(doc).success, false);
});

Deno.test("ProductSchema rejects invalid stock_method", () => {
  const doc = { ...validProduct, stock_method: "invalid" };
  assertEquals(ProductSchema.safeParse(doc).success, false);
});

Deno.test("ProductSchema rejects missing required fields", () => {
  assertEquals(ProductSchema.safeParse({ uid: "test-product-1", name: "Test" }).success, false);
});

Deno.test("ProductSchema rejects additional properties", () => {
  const doc = { ...validProduct, bogus: true };
  assertEquals(ProductSchema.safeParse(doc).success, false);
});
