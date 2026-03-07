import { assertEquals } from "@std/assert";
import { TagSchema } from "../src/tag.ts";

Deno.test("TagSchema validates a complete document", () => {
  const doc = {
    uid: "tag-1",
    name: "Lighting",
    count: 5,
    products: [{ uid: "p1", name: "LED Panel" }],
    query_by_products: ["p1"],
    updated_by: "user-1",
  };
  assertEquals(TagSchema.safeParse(doc).success, true);
});

Deno.test("TagSchema accepts count as record", () => {
  const doc = {
    uid: "tag-1",
    name: "Audio",
    count: { total: 3 },
  };
  assertEquals(TagSchema.safeParse(doc).success, true);
});

Deno.test("TagSchema rejects missing name", () => {
  assertEquals(TagSchema.safeParse({ uid: "tag-1" }).success, false);
});

Deno.test("TagSchema rejects additional properties", () => {
  const doc = { uid: "tag-1", name: "Audio", bogus: true };
  assertEquals(TagSchema.safeParse(doc).success, false);
});
