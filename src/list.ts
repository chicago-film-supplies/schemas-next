/**
 * List document schema — Firestore collection: lists
 *
 * A list is a user-visible bucket of cards (Field service, In-store, To do,
 * Purchases, custom). Shared across the org — not per-user. Lists are
 * reorderable via a fractional `position` (float); cards within a list carry
 * their own `uid_list` pointer + `position`.
 *
 * Lists are small (tens, not thousands) and rarely change, so they're not
 * synced to Typesense — the manager loads them once into a store.
 */
import { z } from "zod";
import {
  ActorRef,
  type ActorRefType,
  type FirestoreTimestampType,
  TimestampFields,
} from "./common.ts";

// ── Firestore document ──────────────────────────────────────────────

/** List Firestore document shape. */
export interface List {
  uid: string;
  name: string;
  description: string;
  icon: string | null;
  color: string | null;
  position: number;
  created_by: ActorRefType;
  updated_by: ActorRefType;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for a list Firestore document. */
export const ListSchema: z.ZodType<List> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(80).meta({ pii: "none" }),
  description: z.string().max(500).meta({ pii: "none" }).default(""),
  icon: z.string().max(64).nullable(),
  color: z.string().max(16).nullable(),
  position: z.number(),
  created_by: ActorRef,
  updated_by: ActorRef,
  ...TimestampFields,
}).meta({
  title: "List",
  collection: "lists",
  displayDefaults: {
    columns: ["name", "description", "position"],
    filters: {},
    sort: { column: "position", direction: "asc" },
  },
});

// ── Input schemas ───────────────────────────────────────────────────

/** Input for POST /lists. */
export interface CreateListInputType {
  name: string;
  description?: string;
  icon?: string | null;
  color?: string | null;
  position?: number;
}

/** Zod schema for creating a list. */
export const CreateListInput: z.ZodType<CreateListInputType> = z.object({
  name: z.string().min(1).max(80).meta({ pii: "none" }),
  description: z.string().max(500).meta({ pii: "none" }).optional(),
  icon: z.string().max(64).nullable().optional(),
  color: z.string().max(16).nullable().optional(),
  position: z.number().optional(),
});

/** Input for PATCH /lists/:uid — all fields optional. */
export interface UpdateListInputType {
  name?: string;
  description?: string;
  icon?: string | null;
  color?: string | null;
  position?: number;
}

/** Zod schema for updating a list. */
export const UpdateListInput: z.ZodType<UpdateListInputType> = z.object({
  name: z.string().min(1).max(80).meta({ pii: "none" }).optional(),
  description: z.string().max(500).meta({ pii: "none" }).optional(),
  icon: z.string().max(64).nullable().optional(),
  color: z.string().max(16).nullable().optional(),
  position: z.number().optional(),
});
