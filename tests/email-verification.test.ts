import { assertEquals } from "@std/assert";
import { EmailVerificationSchema } from "../src/email-verification.ts";

Deno.test("EmailVerificationSchema validates a complete token document", () => {
  const result = EmailVerificationSchema.safeParse({
    user_id: "test-user-1",
    email: "test@example.com",
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    created_at: 1700000000000,
  });
  assertEquals(result.success, true);
});

Deno.test("EmailVerificationSchema rejects missing user_id", () => {
  const result = EmailVerificationSchema.safeParse({
    email: "test@example.com",
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    created_at: 1700000000000,
  });
  assertEquals(result.success, false);
});

Deno.test("EmailVerificationSchema rejects empty user_id", () => {
  const result = EmailVerificationSchema.safeParse({
    user_id: "",
    email: "test@example.com",
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    created_at: 1700000000000,
  });
  assertEquals(result.success, false);
});

Deno.test("EmailVerificationSchema rejects invalid email", () => {
  const result = EmailVerificationSchema.safeParse({
    user_id: "test-user-1",
    email: "not-an-email",
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    created_at: 1700000000000,
  });
  assertEquals(result.success, false);
});

Deno.test("EmailVerificationSchema rejects additional properties", () => {
  const result = EmailVerificationSchema.safeParse({
    user_id: "test-user-1",
    email: "test@example.com",
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    created_at: 1700000000000,
    extra: "not allowed",
  });
  assertEquals(result.success, false);
});
