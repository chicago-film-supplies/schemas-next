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
  version: number;
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
  version: z.int().min(0).default(0),
  prefs_firestore: z.record(z.string(), FirestoreDisplayPrefsSchema),
  prefs_typesense: z.record(z.string(), TypesenseDisplayPrefsSchema),
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

// ── Input schema for user update endpoint ───────────────────────────

/** Payload for updating user preferences via PUT /users/:uid. */
export interface UpdateUserInputType {
  version: number;
  prefs_firestore?: Record<string, FirestoreDisplayPrefs>;
  prefs_typesense?: Record<string, TypesenseDisplayPrefs>;
}

/** Input schema for updating user preferences (only pref fields are accepted). */
export const UpdateUserInput: z.ZodType<UpdateUserInputType> = z.object({
  version: z.int().min(0),
  prefs_firestore: z.record(z.string(), FirestoreDisplayPrefsSchema).optional(),
  prefs_typesense: z.record(z.string(), TypesenseDisplayPrefsSchema).optional(),
});
