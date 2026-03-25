import { assertEquals } from "@std/assert";
import {
  CreateOrganizationInput,
  OrganizationSchema,
  UpdateOrganizationInput,
} from "../src/organization.ts";

const validAddress = {
  city: "Chicago",
  country_name: "US",
  full: "123 Main St, Chicago, IL",
  name: "HQ",
  postcode: "60601",
  region: "IL",
  street: "123 Main St",
};

Deno.test("OrganizationSchema validates a complete document", () => {
  const doc = {
    uid: "org-1",
    name: "Acme Corp",
    crms_id: 100,
    xero_id: "xero-1",
    tax_profile: "tax_applied",
    emails: ["info@acme.com"],
    phones: ["1234567890"],
    billing_address: validAddress,
    contacts: [{ uid: "c1", name: "John", roles: ["admin"] }],
    query_by_contacts: ["c1"],
  };
  assertEquals(OrganizationSchema.safeParse(doc).success, true);
});

Deno.test("OrganizationSchema rejects missing required fields", () => {
  assertEquals(OrganizationSchema.safeParse({ uid: "org-1" }).success, false);
});

Deno.test("OrganizationSchema accepts null billing_address", () => {
  const doc = {
    uid: "org-1",
    name: "Acme",
    crms_id: 1,
    xero_id: null,
    billing_address: null,
  };
  assertEquals(OrganizationSchema.safeParse(doc).success, true);
});

Deno.test("OrganizationSchema rejects invalid tax_profile", () => {
  const doc = {
    uid: "org-1",
    name: "Acme",
    crms_id: 1,
    xero_id: null,
    tax_profile: "invalid",
    billing_address: null,
  };
  assertEquals(OrganizationSchema.safeParse(doc).success, false);
});

Deno.test("OrganizationSchema rejects additional properties", () => {
  const doc = {
    uid: "org-1",
    name: "Acme",
    crms_id: 1,
    xero_id: null,
    billing_address: null,
    bogus: true,
  };
  assertEquals(OrganizationSchema.safeParse(doc).success, false);
});

Deno.test("CreateOrganizationInput accepts valid input", () => {
  const input = {
    uid: "org-1",
    name: "Acme",
    tax_profile: "tax_applied",
    billing_address: validAddress,
  };
  assertEquals(CreateOrganizationInput.safeParse(input).success, true);
});

Deno.test("UpdateOrganizationInput accepts partial update", () => {
  const input = { name: "New Name", version: 1 };
  assertEquals(UpdateOrganizationInput.safeParse(input).success, true);
});
