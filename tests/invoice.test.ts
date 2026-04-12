import { assertEquals } from "@std/assert";
import { CreateInvoiceInput, InvoiceSchema, UpdateInvoiceInput } from "../src/invoice.ts";

const validInvoice = {
  uid: "test-inv-1",
  number: 1001,
  status: "draft",
  uid_orders: ["test-order-1"],
  tax_profile: "tax_applied",
  date: "2026-03-01",
  organization: {
    uid: "test-org-1",
    name: "Acme Corp",
    tax_profile: "tax_applied",
    xero_id: null,
    billing_address: null,
  },
  items: [{
    uid: "item-1",
    type: "rental",
    name: "Camera Rental",
    quantity: 1,
    price: {
      base: 500,
      chargeable_days: 5,
      formula: "five_day_week",
      subtotal: 500,
      subtotal_discounted: 500,
      discount: null,
      taxes: [],
      total: 500,
    },
  }],
  totals: {
    subtotal: 500,
    subtotal_discounted: 500,
    discount_amount: 0,
    taxes: [],
    total: 500,
    amount_paid: 0,
    amount_due: 500,
  },
  payments: [],
  xero_id: null,
  updated_by: "test-user-1",
};

Deno.test("InvoiceSchema validates a complete document", () => {
  assertEquals(InvoiceSchema.safeParse(validInvoice).success, true);
});

Deno.test("InvoiceSchema rejects invalid status", () => {
  const doc = { ...validInvoice, status: "pending" };
  assertEquals(InvoiceSchema.safeParse(doc).success, false);
});

Deno.test("InvoiceSchema accepts part_paid and void statuses", () => {
  assertEquals(InvoiceSchema.safeParse({ ...validInvoice, status: "part_paid" }).success, true);
  assertEquals(InvoiceSchema.safeParse({ ...validInvoice, status: "void" }).success, true);
});

Deno.test("InvoiceSchema accepts optional fields", () => {
  const doc = {
    ...validInvoice,
    subject: "March rental",
    reference: "PO-123",
    external_notes: "Thanks!",
    internal_notes: null,
    due_date: "2026-04-01",
  };
  assertEquals(InvoiceSchema.safeParse(doc).success, true);
});

Deno.test("InvoiceSchema accepts legacy CRMS fields", () => {
  const doc = {
    ...validInvoice,
    crms_id: 500,
    crms_opportunity_ids: [100, 200],
    organization: {
      ...validInvoice.organization,
      crms_id: 100,
    },
    items: [{
      ...validInvoice.items[0],
      crms_opportunity_id: 100,
      crms_id: 42,
      price: {
        ...validInvoice.items[0].price,
        discount_percent: 0,
        tax_profile: "tax_chicago_rental_tax",
      },
    }],
  };
  assertEquals(InvoiceSchema.safeParse(doc).success, true);
});

Deno.test("InvoiceSchema accepts payments", () => {
  const doc = {
    ...validInvoice,
    status: "part_paid",
    payments: [{
      uid: "pay-1",
      xero_payment_id: "xero-pay-1",
      date: "2026-03-15",
      amount: 250,
      reference: "CHK-001",
      status: "active",
    }],
    totals: {
      ...validInvoice.totals,
      amount_paid: 250,
      amount_due: 250,
    },
  };
  assertEquals(InvoiceSchema.safeParse(doc).success, true);
});

Deno.test("InvoiceSchema rejects additional properties", () => {
  const doc = { ...validInvoice, bogus: true };
  assertEquals(InvoiceSchema.safeParse(doc).success, false);
});

Deno.test("CreateInvoiceInput accepts valid input", () => {
  const input = {
    uid: "new-inv-1",
    uid_orders: ["order-1"],
    organization: { uid: "org-1" },
    tax_profile: "tax_applied",
  };
  assertEquals(CreateInvoiceInput.safeParse(input).success, true);
});

Deno.test("CreateInvoiceInput requires at least one order", () => {
  const input = {
    uid: "new-inv-1",
    uid_orders: [],
    organization: { uid: "org-1" },
    tax_profile: "tax_applied",
  };
  assertEquals(CreateInvoiceInput.safeParse(input).success, false);
});

Deno.test("UpdateInvoiceInput requires version", () => {
  const input = { status: "issued" };
  assertEquals(UpdateInvoiceInput.safeParse(input).success, false);
  assertEquals(UpdateInvoiceInput.safeParse({ ...input, version: 1 }).success, true);
});
