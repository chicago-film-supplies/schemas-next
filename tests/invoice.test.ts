import { assertEquals } from "@std/assert";
import { InvoiceSchema } from "../src/invoice.ts";

const validInvoice = {
  uid: "inv-1",
  number: 1001,
  crms_id: 500,
  status: "draft",
  tax_profile: "tax_applied",
  date: "2026-03-01",
  organization: {
    uid: "org-1",
    name: "Acme Corp",
    crms_id: 100,
    tax_profile: "tax_applied",
    xero_id: null,
    billing_address: null,
  },
  items: [{
    name: "Camera Rental",
    quantity: 1,
    price: {
      base: 500,
      chargeable_days: 5,
      discount_percent: 0,
      formula: "five_day_week",
      tax_profile: "tax_chicago_rental_tax",
      total: 500,
    },
    crms_opportunity_id: null,
  }],
  items_consolidated: {},
  xero_id: null,
  updated_by: "user-1",
};

Deno.test("InvoiceSchema validates a complete document", () => {
  assertEquals(InvoiceSchema.safeParse(validInvoice).success, true);
});

Deno.test("InvoiceSchema rejects invalid status", () => {
  const doc = { ...validInvoice, status: "pending" };
  assertEquals(InvoiceSchema.safeParse(doc).success, false);
});

Deno.test("InvoiceSchema rejects invalid item tax_profile", () => {
  const doc = {
    ...validInvoice,
    items: [{
      ...validInvoice.items[0],
      price: { ...validInvoice.items[0].price, tax_profile: "invalid" },
    }],
  };
  assertEquals(InvoiceSchema.safeParse(doc).success, false);
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

Deno.test("InvoiceSchema rejects additional properties", () => {
  const doc = { ...validInvoice, bogus: true };
  assertEquals(InvoiceSchema.safeParse(doc).success, false);
});
