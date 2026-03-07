import { assertEquals } from "@std/assert";
import { CreateOrderInput, UpdateOrderInput } from "../src/order.ts";

const validDates = {
  delivery_start: "2026-03-01",
  delivery_end: "2026-03-01",
  collection_start: "2026-03-10",
  collection_end: "2026-03-10",
  charge_start: "2026-03-01",
  charge_end: "2026-03-10",
};

const validDestination = {
  delivery: { uid: "dest-1" },
  collection: { uid: "dest-2" },
};

Deno.test("CreateOrderInput validates a complete input", () => {
  const input = {
    uid: "order-1",
    organization: { uid: "org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "item-1", type: "rental", name: "Camera", quantity: 2 }],
    subject: "Film shoot",
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput rejects empty destinations", () => {
  const input = {
    uid: "order-1",
    organization: { uid: "org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid status", () => {
  const input = {
    uid: "order-1",
    organization: { uid: "org-1" },
    status: "invalid",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid tax_profile", () => {
  const input = {
    uid: "order-1",
    organization: { uid: "org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "invalid",
    destinations: [validDestination],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("UpdateOrderInput accepts partial update", () => {
  const input = { status: "active" };
  assertEquals(UpdateOrderInput.safeParse(input).success, true);
});

Deno.test("UpdateOrderInput accepts empty object", () => {
  assertEquals(UpdateOrderInput.safeParse({}).success, true);
});
