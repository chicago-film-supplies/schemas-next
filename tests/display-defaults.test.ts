import { assertEquals } from "@std/assert";
import { z } from "zod";
import { getTypesenseDisplayDefaults } from "../src/display-defaults.ts";
import { firestoreDisplayDefaults, schemas } from "../src/mod.ts";
import { typesenseSchemas } from "../src/typesense/mod.ts";

/** Collections that are not client-readable and don't need display prefs. */
const EXCLUDED_COLLECTIONS = new Set(["session", "sessions"]);

/**
 * Deduplicate the schemas record by identity — returns one [key[], schema]
 * tuple per unique schema.
 */
function uniqueSchemas(): [string[], z.ZodType][] {
  const map = new Map<z.ZodType, string[]>();
  for (const [key, schema] of Object.entries(schemas)) {
    const existing = map.get(schema);
    if (existing) {
      existing.push(key);
    } else {
      map.set(schema, [key]);
    }
  }
  return [...map.entries()].map(([schema, keys]) => [keys, schema]);
}

Deno.test("every schema (except sessions) has displayDefaults in meta", () => {
  for (const [keys, schema] of uniqueSchemas()) {
    if (keys.every((k) => EXCLUDED_COLLECTIONS.has(k))) continue;
    const meta = z.globalRegistry.get(schema) as
      | { displayDefaults?: unknown }
      | undefined;
    assertEquals(
      meta?.displayDefaults != null,
      true,
      `schema [${keys.join(", ")}] is missing displayDefaults in .meta()`,
    );
  }
});

Deno.test("firestoreDisplayDefaults is derived for every non-session schema key", () => {
  for (const key of Object.keys(schemas)) {
    if (EXCLUDED_COLLECTIONS.has(key)) continue;
    assertEquals(
      key in firestoreDisplayDefaults,
      true,
      `"${key}" missing from firestoreDisplayDefaults`,
    );
  }
});

Deno.test("sessions are excluded from firestoreDisplayDefaults", () => {
  assertEquals("session" in firestoreDisplayDefaults, false);
  assertEquals("sessions" in firestoreDisplayDefaults, false);
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

Deno.test("every Typesense collection has displayDefaults", () => {
  for (const alias of Object.keys(typesenseSchemas)) {
    const defaults = getTypesenseDisplayDefaults(alias);
    assertEquals(
      defaults !== undefined,
      true,
      `Typesense collection "${alias}" is missing displayDefaults`,
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
