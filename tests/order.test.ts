import { assertEquals } from "@std/assert";
import { CreateOrderInput, OrderSchema, UpdateOrderInput } from "../src/order.ts";

const validDates = {
  delivery_start: "2026-03-01",
  delivery_end: "2026-03-01",
  collection_start: "2026-03-10",
  collection_end: "2026-03-10",
  charge_start: "2026-03-01",
  charge_end: "2026-03-10",
};

const validDestination = {
  delivery: { uid: "test-dest-1" },
  collection: { uid: "test-dest-2" },
};

// ── CreateOrderInput ─────────────────────────────────────────────

Deno.test("CreateOrderInput validates a complete input", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", name: "Camera", quantity: 2 }],
    subject: "Film shoot",
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput rejects empty destinations", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid status", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "invalid",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid tax_profile", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "invalid",
    destinations: [validDestination],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput strips extra properties on dates", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: { ...validDates, extra_field: "nope" },
    tax_profile: "tax_applied",
    destinations: [validDestination],
  };
  const result = CreateOrderInput.safeParse(input);
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals("extra_field" in result.data.dates, false);
  }
});

Deno.test("CreateOrderInput strips extra properties on destination endpoint", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [{
      delivery: { uid: "test-dest-1", bonus: true },
      collection: { uid: "test-dest-2" },
    }],
  };
  const result = CreateOrderInput.safeParse(input);
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals("bonus" in result.data.destinations[0].delivery!, false);
  }
});

Deno.test("CreateOrderInput accepts destination with null contact", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [{
      delivery: { uid: "test-dest-1", contact: null },
      collection: { uid: "test-dest-2" },
    }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput accepts destination with complete contact", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [{
      delivery: { uid: "test-dest-1", contact: { uid: "test-contact-1", name: "Jane", phones: ["312-555-0100"] } },
      collection: { uid: "test-dest-2" },
    }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput rejects destination contact missing name", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [{
      delivery: { uid: "test-dest-1", contact: { uid: "test-contact-1" } },
      collection: { uid: "test-dest-2" },
    }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects destination contact missing uid", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [{
      delivery: { uid: "test-dest-1", contact: { name: "Jane" } },
      collection: { uid: "test-dest-2" },
    }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid item inclusion_type", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", inclusion_type: "invalid" }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput accepts null inclusion_type", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", inclusion_type: null }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput rejects invalid item price formula", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", price: { formula: "daily" } }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput rejects invalid item discount type", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", price: { discount: { rate: 10, type: "invalid" } } }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

Deno.test("CreateOrderInput accepts item with discount and taxes", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{
      uid: "test-item-1",
      type: "rental",
      price: {
        base: 100,
        discount: { rate: 20, type: "percent" },
        taxes: [{ uid: "test-chi-rental-tax" }],
      },
    }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput accepts item with null discount", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", price: { discount: null } }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, true);
});

Deno.test("CreateOrderInput rejects float quantity on items", () => {
  const input = {
    uid: "test-order-1",
    organization: { uid: "test-org-1" },
    status: "draft",
    dates: validDates,
    tax_profile: "tax_applied",
    destinations: [validDestination],
    items: [{ uid: "test-item-1", type: "rental", quantity: 1.5 }],
  };
  assertEquals(CreateOrderInput.safeParse(input).success, false);
});

// ── UpdateOrderInput ─────────────────────────────────────────────

Deno.test("UpdateOrderInput accepts partial update", () => {
  const input = { status: "active", version: 1 };
  assertEquals(UpdateOrderInput.safeParse(input).success, true);
});

Deno.test("UpdateOrderInput rejects missing version", () => {
  assertEquals(UpdateOrderInput.safeParse({}).success, false);
});

// ── OrderSchema (document) ───────────────────────────────────────

const validDocDestination = {
  delivery: {
    uid: null,
    address: null,
    instructions: null,
    contact: null,
  },
  collection: {
    uid: null,
    address: null,
    instructions: null,
    contact: null,
  },
};

const validDocDates = {
  delivery_start: "2026-03-01",
  delivery_start_fs: null,
  delivery_end: "2026-03-01",
  delivery_end_fs: null,
  collection_start: "2026-03-10",
  collection_start_fs: null,
  collection_end: "2026-03-10",
  collection_end_fs: null,
  charge_start: "2026-03-01",
  charge_start_fs: null,
  charge_end: "2026-03-10",
  charge_end_fs: null,
};

const minimalDoc = {
  uid: "test-order-1",
  number: 1001,
  status: "draft",
  organization: {
    uid: null,
    name: "Test Acme Corp",
  },
  dates: validDocDates,
  destinations: [validDocDestination],
  totals: {
    discount_amount: 0,
    subtotal: 100,
    subtotal_discounted: 100,
    taxes: [],
    transaction_fees: [],
    total: 100,
  },
};

Deno.test("OrderSchema validates a minimal document", () => {
  assertEquals(OrderSchema.safeParse(minimalDoc).success, true);
});

Deno.test("OrderSchema validates a complete document", () => {
  const doc = {
    ...minimalDoc,
    tax_profile: "tax_applied",
    items: [
      {
        uid: "test-prod-1",
        type: "rental",
        name: "Camera",
        quantity: 2,
        price: {
          base: 100,
          chargeable_days: 5,
          formula: "five_day_week",
          subtotal: 200,
          subtotal_discounted: 200,
          discount: null,
          taxes: [{
            uid: "test-chi-rental-tax",
            name: "Chicago Rental Tax",
            rate: 15,
            type: "percent",
            amount: 30,
          }],
          total: 230,
        },
        stock_method: "bulk",
      },
      {
        uid: "550e8400-e29b-41d4-a716-446655440000",
        type: "destination",
        name: "Test Chicago Office",
        uid_delivery: "test-dest-1",
        uid_collection: "test-dest-2",
      },
      {
        uid: "550e8400-e29b-41d4-a716-446655440001",
        type: "group",
        name: "Test Lighting",
      },
    ],
    query_by_items: ["test-prod-1"],
    query_by_contacts: ["test-contact-1"],
    crms_id: 12345,
    crms_status: "active",
    subject: "Film shoot",
    reference: "PO-123",
    notes: "Handle with care",
    customer_collecting: true,
    customer_returning: false,
  };
  assertEquals(OrderSchema.safeParse(doc).success, true);
});

Deno.test("OrderSchema rejects non-integer number", () => {
  const doc = { ...minimalDoc, number: 1.5 };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects additional properties", () => {
  const doc = { ...minimalDoc, bonus_field: true };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects additional properties on organization", () => {
  const doc = {
    ...minimalDoc,
    organization: { uid: null, name: "Acme", extra: true },
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects additional properties on totals", () => {
  const doc = {
    ...minimalDoc,
    totals: { discount_amount: 0, subtotal: 0, subtotal_discounted: 0, taxes: [], transaction_fees: [], total: 0, extra: 1 },
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects additional properties on dates", () => {
  const doc = {
    ...minimalDoc,
    dates: { ...validDocDates, extra: "nope" },
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects missing organization name", () => {
  const doc = {
    ...minimalDoc,
    organization: { uid: null },
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects destination item with non-uuid uid", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "not-a-uuid",
      type: "destination",
      name: "Test",
      uid_delivery: null,
      uid_collection: null,
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects group item with non-uuid uid", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "not-a-uuid",
      type: "group",
      name: "Test Group",
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects line item with invalid type", () => {
  const doc = {
    ...minimalDoc,
    items: [{ uid: "test-prod-1", type: "invalid", name: "Thing" }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema accepts all doc line item types", () => {
  for (const type of ["rental", "replacement", "sale", "service", "surcharge"]) {
    const doc = {
      ...minimalDoc,
      items: [{ uid: "test-prod-1", type, name: "Thing" }],
    };
    assertEquals(OrderSchema.safeParse(doc).success, true, `type "${type}" should be valid`);
  }
});

Deno.test("OrderSchema rejects custom line item type", () => {
  const doc = {
    ...minimalDoc,
    items: [{ uid: "test-prod-1", type: "custom", name: "Thing" }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects float chargeable_days in price", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "test-prod-1",
      type: "rental",
      name: "Camera",
      price: {
        base: 100,
        chargeable_days: 3.5,
        formula: "five_day_week",
        subtotal: 100,
        subtotal_discounted: 100,
        discount: null,
        taxes: [],
        total: 100,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects invalid price formula", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "test-prod-1",
      type: "rental",
      name: "Camera",
      price: {
        base: 100,
        chargeable_days: null,
        formula: "daily",
        subtotal: 100,
        subtotal_discounted: 100,
        discount: null,
        taxes: [],
        total: 100,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects invalid discount type", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "test-prod-1",
      type: "rental",
      name: "Camera",
      price: {
        base: 100,
        chargeable_days: null,
        formula: "fixed",
        subtotal: 100,
        subtotal_discounted: 90,
        discount: { rate: 10, type: "invalid", amount: 10 },
        taxes: [],
        total: 90,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema validates destination with contact", () => {
  const doc = {
    ...minimalDoc,
    destinations: [{
      delivery: {
        uid: "test-dest-1",
        address: {
          city: "Chicago",
          country_name: "US",
          full: "123 Main St, Chicago, IL",
          name: "Office",
          postcode: "60601",
          region: "IL",
          street: "123 Main St",
        },
        instructions: "Ring bell",
        contact: {
          uid: "test-contact-1",
          name: "John Doe",
          phones: ["1234567890"],
        },
      },
      collection: {
        uid: null,
        address: null,
        instructions: null,
        contact: null,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, true);
});

Deno.test("OrderSchema rejects doc destination contact missing name", () => {
  const doc = {
    ...minimalDoc,
    destinations: [{
      delivery: {
        uid: "test-dest-1",
        address: null,
        instructions: null,
        contact: { uid: "test-contact-1" },
      },
      collection: {
        uid: null,
        address: null,
        instructions: null,
        contact: null,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects doc destination contact with short phone", () => {
  const doc = {
    ...minimalDoc,
    destinations: [{
      delivery: {
        uid: "test-dest-1",
        address: null,
        instructions: null,
        contact: {
          uid: "test-contact-1",
          name: "John Doe",
          phones: ["123"],
        },
      },
      collection: {
        uid: null,
        address: null,
        instructions: null,
        contact: null,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects reference over 255 chars", () => {
  const doc = { ...minimalDoc, reference: "x".repeat(256) };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects empty destinations array", () => {
  const doc = { ...minimalDoc, destinations: [] };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects extra properties on line item price", () => {
  const doc = {
    ...minimalDoc,
    items: [{
      uid: "test-prod-1",
      type: "rental",
      name: "Camera",
      price: {
        base: 100,
        chargeable_days: null,
        formula: "fixed",
        subtotal: 100,
        subtotal_discounted: 100,
        discount: null,
        taxes: [],
        total: 100,
        extra: true,
      },
    }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects float quantity on line items", () => {
  const doc = {
    ...minimalDoc,
    items: [{ uid: "test-prod-1", type: "rental", name: "Camera", quantity: 1.5 }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema rejects negative quantity on line items", () => {
  const doc = {
    ...minimalDoc,
    items: [{ uid: "test-prod-1", type: "rental", name: "Camera", quantity: -1 }],
  };
  assertEquals(OrderSchema.safeParse(doc).success, false);
});

Deno.test("OrderSchema accepts valid inclusion_type values", () => {
  for (const val of ["default", "mandatory", "optional", null]) {
    const doc = {
      ...minimalDoc,
      items: [{ uid: "test-prod-1", type: "rental", name: "Camera", inclusion_type: val }],
    };
    assertEquals(OrderSchema.safeParse(doc).success, true, `inclusion_type "${val}" should be valid`);
  }
});
