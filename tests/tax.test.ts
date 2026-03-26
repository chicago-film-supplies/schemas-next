import { assertEquals } from "@std/assert";
import { TaxSchema, CreateTaxInput, UpdateTaxInput } from "../src/tax.ts";

const validTax = {
  uid: "chi-rental-tax",
  name: "Chicago Rental Tax",
  rate: 15,
  type: "percent" as const,
  active: true,
  valid_from: null,
  valid_to: null,
  created_by: "user-1",
  updated_by: "user-1",
  created_at: null,
  updated_at: null,
};

Deno.test("TaxSchema validates a complete document", () => {
  assertEquals(TaxSchema.safeParse(validTax).success, true);
});

Deno.test("TaxSchema validates flat rate type", () => {
  const doc = { ...validTax, type: "flat", rate: 0.05 };
  assertEquals(TaxSchema.safeParse(doc).success, true);
});

Deno.test("TaxSchema rejects invalid type", () => {
  const doc = { ...validTax, type: "invalid" };
  assertEquals(TaxSchema.safeParse(doc).success, false);
});

Deno.test("TaxSchema rejects empty name", () => {
  const doc = { ...validTax, name: "" };
  assertEquals(TaxSchema.safeParse(doc).success, false);
});

Deno.test("TaxSchema rejects additional properties", () => {
  const doc = { ...validTax, extra: true };
  assertEquals(TaxSchema.safeParse(doc).success, false);
});

Deno.test("CreateTaxInput accepts valid input", () => {
  const input = {
    name: "Sales Tax",
    rate: 10.25,
    type: "percent" as const,
    valid_from: null,
  };
  assertEquals(CreateTaxInput.safeParse(input).success, true);
});

Deno.test("CreateTaxInput rejects missing name", () => {
  const input = { rate: 10, type: "percent", valid_from: null };
  assertEquals(CreateTaxInput.safeParse(input).success, false);
});

Deno.test("UpdateTaxInput accepts partial update", () => {
  const input = { uid: "chi-rental-tax", rate: 16, version: 1 };
  assertEquals(UpdateTaxInput.safeParse(input).success, true);
});

Deno.test("UpdateTaxInput rejects missing version", () => {
  const input = { uid: "chi-rental-tax", rate: 16 };
  assertEquals(UpdateTaxInput.safeParse(input).success, false);
});
