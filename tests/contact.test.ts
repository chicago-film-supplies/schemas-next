import { assertEquals } from "@std/assert";
import {
  ContactSchema,
  CreateContactInput,
  UpdateContactInput,
} from "../src/contact.ts";

Deno.test("ContactSchema validates a complete contact document", () => {
  const doc = {
    uid: "abc-123",
    name: "John Doe",
    emails: ["john@example.com"],
    phones: ["1234567890"],
    organizations: [{ uid: "org-1", name: "Acme" }],
    query_by_organizations: ["org-1"],
  };
  assertEquals(ContactSchema.safeParse(doc).success, true);
});

Deno.test("ContactSchema rejects missing required fields", () => {
  const doc = { uid: "abc-123" };
  assertEquals(ContactSchema.safeParse(doc).success, false);
});

Deno.test("ContactSchema rejects empty name", () => {
  const doc = {
    uid: "abc-123",
    name: "",
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
  };
  assertEquals(ContactSchema.safeParse(doc).success, false);
});

Deno.test("ContactSchema rejects additional properties", () => {
  const doc = {
    uid: "abc-123",
    name: "John",
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
    bogus: true,
  };
  assertEquals(ContactSchema.safeParse(doc).success, false);
});

Deno.test("ContactSchema allows optional crms_id", () => {
  const doc = {
    uid: "abc-123",
    name: "John",
    crms_id: 42,
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
  };
  assertEquals(ContactSchema.safeParse(doc).success, true);
});

Deno.test("CreateContactInput accepts minimal input", () => {
  const input = { uid: "abc-123", name: "John" };
  assertEquals(CreateContactInput.safeParse(input).success, true);
});

Deno.test("CreateContactInput accepts full input", () => {
  const input = {
    uid: "abc-123",
    name: "John",
    emails: ["john@example.com"],
    phones: ["1234567890"],
    organizations: [{ uid: "org-1", name: "Acme" }],
  };
  assertEquals(CreateContactInput.safeParse(input).success, true);
});

Deno.test("UpdateContactInput accepts partial update", () => {
  const input = { name: "Jane" };
  assertEquals(UpdateContactInput.safeParse(input).success, true);
});

Deno.test("UpdateContactInput rejects empty name", () => {
  const input = { name: "" };
  assertEquals(UpdateContactInput.safeParse(input).success, false);
});
