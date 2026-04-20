import { assertEquals } from "@std/assert";
import { CreateListInput, ListSchema, UpdateListInput } from "../src/list.ts";

const validList = {
  uid: "list-1",
  name: "Field service",
  description: "Deliveries and pickups",
  icon: "truck",
  color: "#3b82f6",
  position: 1000,
  created_by: { uid: "user-1", name: "Alex" },
  updated_by: { uid: "user-1", name: "Alex" },
  created_at: null,
  updated_at: null,
};

Deno.test("ListSchema validates a complete document", () => {
  assertEquals(ListSchema.safeParse(validList).success, true);
});

Deno.test("ListSchema rejects empty name", () => {
  const doc = { ...validList, name: "" };
  assertEquals(ListSchema.safeParse(doc).success, false);
});

Deno.test("ListSchema accepts null icon and color", () => {
  const doc = { ...validList, icon: null, color: null };
  assertEquals(ListSchema.safeParse(doc).success, true);
});

Deno.test("ListSchema rejects unknown properties", () => {
  const doc = { ...validList, extra: "nope" };
  assertEquals(ListSchema.safeParse(doc).success, false);
});

Deno.test("CreateListInput accepts minimal payload", () => {
  assertEquals(CreateListInput.safeParse({ name: "To do" }).success, true);
});

Deno.test("CreateListInput rejects empty name", () => {
  assertEquals(CreateListInput.safeParse({ name: "" }).success, false);
});

Deno.test("UpdateListInput accepts position-only payload", () => {
  assertEquals(UpdateListInput.safeParse({ position: 1500 }).success, true);
});
