import { assertEquals } from "@std/assert";
import { TrackingCategorySchema } from "../src/tracking-category.ts";

Deno.test("TrackingCategorySchema validates a complete document", () => {
  const doc = {
    uid: "tc-1",
    name: "Cameras",
    count: 3,
    crms_product_group_id: 10,
    crms_product_group_name: "Camera Group",
    products: { "p1": { uid: "p1", name: "Canon C300" } },
    xero_tracking_option_id: "xero-1",
    updated_by: "user-1",
  };
  assertEquals(TrackingCategorySchema.safeParse(doc).success, true);
});

Deno.test("TrackingCategorySchema accepts count as record", () => {
  const doc = {
    uid: "tc-1",
    name: "Lenses",
    count: { total: 5 },
    crms_product_group_name: "Lens Group",
    products: {},
    xero_tracking_option_id: null,
    updated_by: "user-1",
  };
  assertEquals(TrackingCategorySchema.safeParse(doc).success, true);
});

Deno.test("TrackingCategorySchema rejects missing required fields", () => {
  assertEquals(TrackingCategorySchema.safeParse({ uid: "tc-1" }).success, false);
});

Deno.test("TrackingCategorySchema rejects additional properties", () => {
  const doc = {
    uid: "tc-1",
    name: "Audio",
    count: 0,
    crms_product_group_name: "Audio",
    products: {},
    xero_tracking_option_id: null,
    updated_by: "user-1",
    bogus: true,
  };
  assertEquals(TrackingCategorySchema.safeParse(doc).success, false);
});
