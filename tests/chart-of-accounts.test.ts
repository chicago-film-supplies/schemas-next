import { assertEquals } from "@std/assert";
import { ChartOfAccountsSchema } from "../src/chart-of-accounts.ts";

Deno.test("ChartOfAccountsSchema validates a complete document", () => {
  const doc = {
    uid: "test-coa-1",
    code: 4000,
    name: "Sales",
    type: "Revenue",
    description: "General sales revenue",
    default_tax_profile: "tax_chicago_sales_tax",
    updated_by: "test-user-1",
  };
  assertEquals(ChartOfAccountsSchema.safeParse(doc).success, true);
});

Deno.test("ChartOfAccountsSchema rejects invalid code", () => {
  const doc = {
    uid: "test-coa-1",
    code: 9999,
    name: "Invalid",
    type: "Revenue",
    default_tax_profile: "tax_none",
    updated_by: "test-user-1",
  };
  assertEquals(ChartOfAccountsSchema.safeParse(doc).success, false);
});

Deno.test("ChartOfAccountsSchema rejects invalid type", () => {
  const doc = {
    uid: "test-coa-1",
    code: 4000,
    name: "Sales",
    type: "Fake Type",
    default_tax_profile: "tax_none",
    updated_by: "test-user-1",
  };
  assertEquals(ChartOfAccountsSchema.safeParse(doc).success, false);
});

Deno.test("ChartOfAccountsSchema rejects additional properties", () => {
  const doc = {
    uid: "test-coa-1",
    code: 4000,
    name: "Sales",
    type: "Revenue",
    default_tax_profile: "tax_none",
    updated_by: "test-user-1",
    bogus: true,
  };
  assertEquals(ChartOfAccountsSchema.safeParse(doc).success, false);
});
