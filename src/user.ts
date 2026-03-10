/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, type FirestoreTimestampType, TimestampFields } from "./common.ts";

// ── Preference sub-schemas ──────────────────────────────────────────

export interface TablePreference {
  columns: string[];
  sort: { column: string | null; direction: "asc" | "desc" };
  pagination?: { itemsPerPage: number; currentPage: number };
}

const TablePreferenceSchema: z.ZodType<TablePreference> = z.strictObject({
  columns: z.array(z.string()),
  sort: z.strictObject({
    column: z.string().nullable(),
    direction: z.enum(["asc", "desc"]),
  }),
  pagination: z.strictObject({
    itemsPerPage: z.number().int().positive(),
    currentPage: z.number().int().positive(),
  }).optional(),
});

export interface FilterPreferences {
  [key: string]: (string | boolean)[];
}

const FilterPreferencesSchema: z.ZodType<FilterPreferences> = z.record(
  z.string(),
  z.array(z.union([z.string(), z.boolean()])),
);

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
  tablePreferences?: Record<string, TablePreference>;
  columnPreferences?: Record<string, string[]>;
  filterPreferences?: Record<string, FilterPreferences>;
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
  tablePreferences: z.record(z.string(), TablePreferenceSchema).optional(),
  columnPreferences: z.record(z.string(), z.array(z.string())).optional(),
  filterPreferences: z.record(z.string(), FilterPreferencesSchema).optional(),
  ...TimestampFields,
}).meta({ title: "User", collection: "users" });

// ── Input schemas for preference endpoints ──────────────────────────

export interface SaveTablePreferenceInputType {
  context: string;
  columns: string[];
  sort: { column: string | null; direction: "asc" | "desc" };
  pagination?: { itemsPerPage: number; currentPage: number };
}

export const SaveTablePreferenceInput: z.ZodType<SaveTablePreferenceInputType> = z.object({
  context: z.string().min(1),
  columns: z.array(z.string()),
  sort: z.object({
    column: z.string().nullable(),
    direction: z.enum(["asc", "desc"]),
  }),
  pagination: z.object({
    itemsPerPage: z.number().int().positive(),
    currentPage: z.number().int().positive(),
  }).optional(),
});

export interface SaveColumnPreferenceInputType {
  collection: string;
  columns: string[];
}

export const SaveColumnPreferenceInput: z.ZodType<SaveColumnPreferenceInputType> = z.object({
  collection: z.string().min(1),
  columns: z.array(z.string()),
});

export interface SaveFilterPreferenceInputType {
  collection: string;
  filters: FilterPreferences;
}

export const SaveFilterPreferenceInput: z.ZodType<SaveFilterPreferenceInputType> = z.object({
  collection: z.string().min(1),
  filters: FilterPreferencesSchema,
});
