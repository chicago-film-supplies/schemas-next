import { assertEquals } from "@std/assert";
import {
  ContactSchema,
  CreateContactInput,
  UpdateContactInput,
} from "../src/contact.ts";

Deno.test("ContactSchema validates a complete contact document", () => {
  const doc = {
    uid: "test-abc-123",
    first_name: "John",
    last_name: "Doe",
    emails: ["john@example.com"],
    phones: ["1234567890"],
    organizations: [{ uid: "test-org-1", name: "Acme" }],
    query_by_organizations: ["test-org-1"],
  };
  assertEquals(ContactSchema.safeParse(doc).success, true);
});

Deno.test("ContactSchema accepts contact without last_name", () => {
  const doc = {
    uid: "test-abc-123",
    first_name: "John",
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
  };
  assertEquals(ContactSchema.safeParse(doc).success, true);
});

Deno.test("ContactSchema rejects missing required fields", () => {
  const doc = { uid: "test-abc-123" };
  assertEquals(ContactSchema.safeParse(doc).success, false);
});

Deno.test("ContactSchema rejects empty first_name", () => {
  const doc = {
    uid: "test-abc-123",
    first_name: "",
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
  };
  assertEquals(ContactSchema.safeParse(doc).success, false);
});

Deno.test("ContactSchema rejects additional properties", () => {
  const doc = {
    uid: "test-abc-123",
    first_name: "John",
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
    uid: "test-abc-123",
    first_name: "John",
    crms_id: 42,
    emails: [],
    phones: [],
    organizations: [],
    query_by_organizations: [],
  };
  assertEquals(ContactSchema.safeParse(doc).success, true);
});

Deno.test("CreateContactInput accepts minimal input", () => {
  const input = { uid: "test-abc-123", first_name: "John" };
  assertEquals(CreateContactInput.safeParse(input).success, true);
});

Deno.test("CreateContactInput accepts full input", () => {
  const input = {
    uid: "test-abc-123",
    first_name: "John",
    last_name: "Doe",
    emails: ["john@example.com"],
    phones: ["1234567890"],
    organizations: [{ uid: "test-org-1", name: "Acme" }],
  };
  assertEquals(CreateContactInput.safeParse(input).success, true);
});

Deno.test("UpdateContactInput accepts partial update", () => {
  const input = { first_name: "Jane", version: 1 };
  assertEquals(UpdateContactInput.safeParse(input).success, true);
});

Deno.test("UpdateContactInput rejects empty first_name", () => {
  const input = { first_name: "", version: 1 };
  assertEquals(UpdateContactInput.safeParse(input).success, false);
});
