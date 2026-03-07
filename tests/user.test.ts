import { assertEquals } from "@std/assert";
import { UserSchema } from "../src/user.ts";

Deno.test("UserSchema validates a complete user document", () => {
  const result = UserSchema.safeParse({
    id: "abc123",
    email: "test@example.com",
    passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$abc$def",
    email_verified: false,
    created_at: { _seconds: 1700000000, _nanoseconds: 0 },
    updated_at: { _seconds: 1700000000, _nanoseconds: 0 },
  });
  assertEquals(result.success, true);
});

Deno.test("UserSchema rejects missing required fields", () => {
  const result = UserSchema.safeParse({ id: "abc123" });
  assertEquals(result.success, false);
});

Deno.test("UserSchema rejects invalid email", () => {
  const result = UserSchema.safeParse({
    id: "abc123",
    email: "not-an-email",
    passwordHash: "$argon2id$v=19$hash",
    email_verified: false,
  });
  assertEquals(result.success, false);
});

Deno.test("UserSchema rejects empty passwordHash", () => {
  const result = UserSchema.safeParse({
    id: "abc123",
    email: "test@example.com",
    passwordHash: "",
    email_verified: false,
  });
  assertEquals(result.success, false);
});

Deno.test("UserSchema defaults email_verified to false", () => {
  const result = UserSchema.safeParse({
    id: "abc123",
    email: "test@example.com",
    passwordHash: "$argon2id$v=19$hash",
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.email_verified, false);
  }
});

Deno.test("UserSchema rejects additional properties", () => {
  const result = UserSchema.safeParse({
    id: "abc123",
    email: "test@example.com",
    passwordHash: "$argon2id$v=19$hash",
    email_verified: true,
    extraField: "not allowed",
  });
  assertEquals(result.success, false);
});
