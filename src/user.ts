/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, type FirestoreTimestampType, TimestampFields } from "./common.ts";

// ── Preference sub-schemas ──────────────────────────────────────────

/** Sort configuration for a display preference (column + direction). */
export interface DisplaySort {
  column: string | null;
  direction: "asc" | "desc";
}

const DisplaySortSchema: z.ZodType<DisplaySort> = z.strictObject({
  column: z.string().nullable(),
  direction: z.enum(["asc", "desc"]),
});

/** User display preferences for a Firestore-backed collection view. */
export interface FirestoreDisplayPrefs {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: DisplaySort;
}

const FirestoreDisplayPrefsSchema: z.ZodType<FirestoreDisplayPrefs> = z.strictObject({
  columns: z.array(z.string()),
  filters: z.record(z.string(), z.array(z.union([z.string(), z.boolean()]))),
  sort: DisplaySortSchema,
});

/** User display preferences for a Typesense-backed collection view. */
export interface TypesenseDisplayPrefs {
  columns: string[];
  filters: Record<string, (string | boolean)[]>;
  sort: DisplaySort;
  group: string | null;
  facet: string[];
}

const TypesenseDisplayPrefsSchema: z.ZodType<TypesenseDisplayPrefs> = z.strictObject({
  columns: z.array(z.string()),
  filters: z.record(z.string(), z.array(z.union([z.string(), z.boolean()]))),
  sort: DisplaySortSchema,
  group: z.string().nullable(),
  facet: z.array(z.string()),
});

/**
 * Full user document schema (Firestore document shape).
 */
export interface User {
  uid: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  uid_customer?: string | null;
  roles?: string[];
  prefs_firestore: Record<string, FirestoreDisplayPrefs>;
  prefs_typesense: Record<string, TypesenseDisplayPrefs>;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for a full user Firestore document. */
export const UserSchema: z.ZodType<User> = z.strictObject({
  uid: z.string(),
  email: Email,
  password_hash: z.string().min(1).meta({ pii: "redact" }),
  email_verified: z.boolean().default(false),
  uid_customer: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
  prefs_firestore: z.record(z.string(), FirestoreDisplayPrefsSchema),
  prefs_typesense: z.record(z.string(), TypesenseDisplayPrefsSchema),
  ...TimestampFields,
}).meta({
  title: "User",
  collection: "users",
  initial: {"uid":null,"email":"","password_hash":"","email_verified":false,"uid_customer":null,"roles":[],"prefs_firestore":{},"prefs_typesense":{}},
  displayDefaults: {
    columns: ["email", "roles"],
    filters: {},
    sort: { column: "email", direction: "asc" },
  },
});

// ── Input schemas for preference endpoints ──────────────────────────

/** Payload for saving Firestore display preferences. */
export interface SaveFirestorePrefsInputType {
  context: string;
  prefs: FirestoreDisplayPrefs;
}

/** Input schema for saving Firestore display preferences. */
export const SaveFirestorePrefsInput: z.ZodType<SaveFirestorePrefsInputType> = z.object({
  context: z.string().min(1),
  prefs: FirestoreDisplayPrefsSchema,
});

/** Payload for saving Typesense display preferences. */
export interface SaveTypesensePrefsInputType {
  collection: string;
  prefs: TypesenseDisplayPrefs;
}

/** Input schema for saving Typesense display preferences. */
export const SaveTypesensePrefsInput: z.ZodType<SaveTypesensePrefsInputType> = z.object({
  collection: z.string().min(1),
  prefs: TypesenseDisplayPrefsSchema,
});
