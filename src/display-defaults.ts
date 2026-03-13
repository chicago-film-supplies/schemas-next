/**
 * Display defaults for Firestore collections and a helper for Typesense defaults.
 *
 * Firestore defaults are derived from each schema's .meta() `displayDefaults`
 * field, keyed by the `schemas` record keys from mod.ts.
 */
import { z } from "zod";
import { schemas } from "./mod.ts";
import { typesenseSchemas, type TypesenseDisplayDefaults } from "./typesense/mod.ts";

/** Display defaults for a Firestore collection in the UI. */
export interface FirestoreDisplayDefaults {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: { column: string | null; direction: "asc" | "desc" };
}

/** Display defaults for every Firestore collection, derived from schema meta. */
export const firestoreDisplayDefaults: Record<string, FirestoreDisplayDefaults> =
  Object.fromEntries(
    Object.entries(schemas)
      .map(([key, schema]) => {
        const meta = z.globalRegistry.get(schema) as
          | { displayDefaults?: FirestoreDisplayDefaults }
          | undefined;
        return [key, meta?.displayDefaults] as const;
      })
      .filter((entry): entry is [string, FirestoreDisplayDefaults] => entry[1] != null),
  );

/** Display defaults for every Typesense collection, derived from collection config. */
export const typesenseDisplayDefaults: Record<string, TypesenseDisplayDefaults> =
  Object.fromEntries(
    Object.entries(typesenseSchemas).map(([alias, config]) => [alias, config.displayDefaults])
  );

/** Get the display defaults for a Typesense collection by alias. */
export function getTypesenseDisplayDefaults(alias: string): TypesenseDisplayDefaults | undefined {
  return typesenseSchemas[alias]?.displayDefaults;
}
