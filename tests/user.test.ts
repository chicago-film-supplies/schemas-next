import { assertEquals } from "@std/assert";
import { UserSchema, SaveFirestorePrefsInput, SaveTypesensePrefsInput } from "../src/user.ts";

const emptyPrefs = {
  prefs_firestore: {},
  prefs_typesense: {},
};

Deno.test("UserSchema validates a complete user document", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$m=19456,t=2,p=1$abc$def",
    email_verified: false,
    ...emptyPrefs,
    created_at: { _seconds: 1700000000, _nanoseconds: 0 },
    updated_at: { _seconds: 1700000000, _nanoseconds: 0 },
  });
  assertEquals(result.success, true);
});

Deno.test("UserSchema rejects missing required fields", () => {
  const result = UserSchema.safeParse({ uid: "test-user-1" });
  assertEquals(result.success, false);
});

Deno.test("UserSchema rejects invalid email", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "not-an-email",
    password_hash: "$argon2id$v=19$hash",
    email_verified: false,
  });
  assertEquals(result.success, false);
});

Deno.test("UserSchema rejects empty password_hash", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "",
    email_verified: false,
  });
  assertEquals(result.success, false);
});

Deno.test("UserSchema defaults email_verified to false", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$hash",
    ...emptyPrefs,
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.email_verified, false);
  }
});

Deno.test("UserSchema rejects additional properties", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$hash",
    email_verified: true,
    ...emptyPrefs,
    extraField: "not allowed",
  });
  assertEquals(result.success, false);
});

Deno.test("UserSchema rejects old preference field names", () => {
  const base = {
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$hash",
    email_verified: true,
  };
  for (const old of ["tablePreferences", "columnPreferences", "filterPreferences"]) {
    const result = UserSchema.safeParse({ ...base, [old]: {} });
    assertEquals(result.success, false, `should reject "${old}"`);
  }
});

Deno.test("UserSchema accepts prefs_firestore", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$hash",
    email_verified: true,
    prefs_firestore: {
      orders: {
        columns: ["number", "status"],
        filters: { status: ["active"] },
        sort: { column: "number", direction: "desc" },
      },
    },
    prefs_typesense: {},
  });
  assertEquals(result.success, true);
});

Deno.test("UserSchema accepts prefs_typesense", () => {
  const result = UserSchema.safeParse({
    uid: "test-user-1",
    email: "test@example.com",
    password_hash: "$argon2id$v=19$hash",
    email_verified: true,
    prefs_firestore: {},
    prefs_typesense: {
      bookings: {
        columns: ["number", "name"],
        filters: { status: [] },
        sort: { column: "number", direction: "desc" },
        group: null,
        facet: [],
      },
    },
  });
  assertEquals(result.success, true);
});

Deno.test("SaveFirestorePrefsInput validates correctly", () => {
  const valid = SaveFirestorePrefsInput.safeParse({
    context: "orders",
    prefs: {
      columns: ["number"],
      filters: {},
      sort: { column: "number", direction: "asc" },
    },
  });
  assertEquals(valid.success, true);

  const invalid = SaveFirestorePrefsInput.safeParse({ context: "" });
  assertEquals(invalid.success, false);
});

Deno.test("SaveTypesensePrefsInput validates correctly", () => {
  const valid = SaveTypesensePrefsInput.safeParse({
    collection: "bookings",
    prefs: {
      columns: ["number", "name"],
      filters: {},
      sort: { column: "number", direction: "desc" },
      group: null,
      facet: [],
    },
  });
  assertEquals(valid.success, true);

  const invalid = SaveTypesensePrefsInput.safeParse({ collection: "" });
  assertEquals(invalid.success, false);
});
