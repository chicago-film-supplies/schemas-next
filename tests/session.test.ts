import { assertEquals } from "@std/assert";
import { SessionSchema } from "../src/session.ts";

Deno.test("SessionSchema validates a complete session document", () => {
  const result = SessionSchema.safeParse({
    id: "a".repeat(40),
    userId: "user123",
    anonymous: false,
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    createdAt: 1700000000000,
    userAgent: "Mozilla/5.0",
  });
  assertEquals(result.success, true);
});

Deno.test("SessionSchema validates an anonymous session", () => {
  const result = SessionSchema.safeParse({
    id: "b".repeat(40),
    userId: "",
    anonymous: true,
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    createdAt: 1700000000000,
    userAgent: "",
  });
  assertEquals(result.success, true);
});

Deno.test("SessionSchema rejects session ID with wrong length", () => {
  const result = SessionSchema.safeParse({
    id: "tooshort",
    userId: "user123",
    anonymous: false,
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    createdAt: 1700000000000,
    userAgent: "Mozilla/5.0",
  });
  assertEquals(result.success, false);
});

Deno.test("SessionSchema rejects missing required fields", () => {
  const result = SessionSchema.safeParse({ id: "a".repeat(40) });
  assertEquals(result.success, false);
});

Deno.test("SessionSchema rejects additional properties", () => {
  const result = SessionSchema.safeParse({
    id: "a".repeat(40),
    userId: "user123",
    anonymous: false,
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    createdAt: 1700000000000,
    userAgent: "Mozilla/5.0",
    extraField: "not allowed",
  });
  assertEquals(result.success, false);
});

Deno.test("SessionSchema rejects non-number createdAt", () => {
  const result = SessionSchema.safeParse({
    id: "a".repeat(40),
    userId: "user123",
    anonymous: false,
    expiresAt: { _seconds: 1700000000, _nanoseconds: 0 },
    createdAt: "not a number",
    userAgent: "Mozilla/5.0",
  });
  assertEquals(result.success, false);
});
