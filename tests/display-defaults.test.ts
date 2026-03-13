import { assertEquals } from "@std/assert";
import type { z } from "zod";
import { firestoreDisplayDefaults, getTypesenseDisplayDefaults } from "../src/display-defaults.ts";
import { schemas } from "../src/mod.ts";
import { typesenseSchemas } from "../src/typesense/mod.ts";

/** Collections that are not client-readable and don't need display prefs. */
const EXCLUDED_COLLECTIONS = new Set(["session", "sessions"]);

/**
 * Group schema record keys by unique schema identity.
 * Returns arrays of alias keys that map to the same schema.
 */
function schemaKeyGroups(): string[][] {
  const map = new Map<z.ZodType, string[]>();
  for (const [key, schema] of Object.entries(schemas)) {
    const existing = map.get(schema);
    if (existing) {
      existing.push(key);
    } else {
      map.set(schema, [key]);
    }
  }
  return [...map.values()];
}

Deno.test("every Firestore collection (except sessions) has display defaults", () => {
  const groups = schemaKeyGroups();
  for (const keys of groups) {
    if (keys.every((k) => EXCLUDED_COLLECTIONS.has(k))) continue;
    const hasDefault = keys.some((k) => k in firestoreDisplayDefaults);
    assertEquals(
      hasDefault,
      true,
      `missing firestore display defaults for any of: ${keys.join(", ")}`,
    );
  }
});

Deno.test("every Firestore collection with a Typesense mirror has a typesense schema", () => {
  for (const alias of Object.keys(typesenseSchemas)) {
    const defaults = getTypesenseDisplayDefaults(alias);
    assertEquals(
      defaults !== undefined,
      true,
      `Typesense collection "${alias}" is missing displayDefaults`,
    );
  }
});

Deno.test("no Firestore collection has empty columns", () => {
  for (const [key, defaults] of Object.entries(firestoreDisplayDefaults)) {
    assertEquals(defaults.columns.length > 0, true, `"${key}" has empty columns`);
  }
});

Deno.test("Firestore display defaults have correct shape", () => {
  for (const [key, defaults] of Object.entries(firestoreDisplayDefaults)) {
    assertEquals(Array.isArray(defaults.columns), true, `${key}: columns should be array`);
    assertEquals(typeof defaults.filters, "object", `${key}: filters should be object`);
    assertEquals(typeof defaults.sort, "object", `${key}: sort should be object`);
    assertEquals(
      defaults.sort.direction === "asc" || defaults.sort.direction === "desc",
      true,
      `${key}: sort.direction should be asc or desc`,
    );
  }
});

Deno.test("getTypesenseDisplayDefaults returns defaults for known aliases", () => {
  const defaults = getTypesenseDisplayDefaults("bookings");
  assertEquals(defaults !== undefined, true);
  assertEquals(defaults!.columns.length > 0, true);
});

Deno.test("getTypesenseDisplayDefaults returns undefined for unknown alias", () => {
  const defaults = getTypesenseDisplayDefaults("nonexistent");
  assertEquals(defaults, undefined);
});
