/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, type FirestoreTimestampType, TimestampFields } from "./common.ts";

// ── Preference sub-schemas ──────────────────────────────────────────

export interface DisplaySort {
  column: string | null;
  direction: "asc" | "desc";
}

const DisplaySortSchema: z.ZodType<DisplaySort> = z.strictObject({
  column: z.string().nullable(),
  direction: z.enum(["asc", "desc"]),
});

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
  prefs_firestore?: Record<string, FirestoreDisplayPrefs>;
  prefs_typesense?: Record<string, TypesenseDisplayPrefs>;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const UserSchema: z.ZodType<User> = z.strictObject({
  uid: z.string(),
  email: Email,
  password_hash: z.string().min(1),
  email_verified: z.boolean().default(false),
  uid_customer: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
  prefs_firestore: z.record(z.string(), FirestoreDisplayPrefsSchema).optional(),
  prefs_typesense: z.record(z.string(), TypesenseDisplayPrefsSchema).optional(),
  ...TimestampFields,
}).meta({
  title: "User",
  collection: "users",
  displayDefaults: {
    columns: ["email", "roles"],
    filters: {},
    sort: { column: "email", direction: "asc" },
  },
});

// ── Input schemas for preference endpoints ──────────────────────────

export interface SaveFirestorePrefsInputType {
  context: string;
  prefs: FirestoreDisplayPrefs;
}

export const SaveFirestorePrefsInput: z.ZodType<SaveFirestorePrefsInputType> = z.object({
  context: z.string().min(1),
  prefs: FirestoreDisplayPrefsSchema,
});

export interface SaveTypesensePrefsInputType {
  collection: string;
  prefs: TypesenseDisplayPrefs;
}

export const SaveTypesensePrefsInput: z.ZodType<SaveTypesensePrefsInputType> = z.object({
  collection: z.string().min(1),
  prefs: TypesenseDisplayPrefsSchema,
});
