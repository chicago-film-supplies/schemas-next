/**
 * Thread document schema — Firestore collection: threads
 *
 * A thread is a conversation attached to one or more source docs (orders,
 * invoices, contacts, organizations, order-events, products, transactions,
 * roles). Each source doc gets a default thread cowritten on creation; some
 * threads (e.g. an order-event's) carry multiple sources so they surface on
 * every linked doc's detail view.
 *
 * Access is purely RBAC-driven — no per-thread ACLs. Threads are deleted
 * only as a side effect of the last source doc being deleted (cascade wiring
 * lives on each entity's delete path, not here).
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType, TimestampFields } from "./common.ts";

// ── Source reference ────────────────────────────────────────────────

/** A {collection, uid} pointer to a source doc that owns/surfaces this thread. */
export interface ThreadSourceType {
  collection: string;
  uid: string;
}

/** Zod schema for a thread source reference. */
export const ThreadSource: z.ZodType<ThreadSourceType> = z.strictObject({
  collection: z.string().min(1),
  uid: z.string().min(1),
});

// ── Firestore document ──────────────────────────────────────────────

/** Thread Firestore document shape. */
export interface Thread {
  uid: string;
  sources: ThreadSourceType[];
  title: string | null;
  last_message_at: FirestoreTimestampType | null;
  last_message_preview: string;
  comment_count: number;
  uid_creator: string;
  updated_by: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for a thread Firestore document. */
export const ThreadSchema: z.ZodType<Thread> = z.strictObject({
  uid: z.string(),
  sources: z.array(ThreadSource).min(1),
  title: z.string().max(200).meta({ pii: "mask" }).nullable(),
  last_message_at: FirestoreTimestamp.nullable(),
  last_message_preview: z.string().max(280).meta({ pii: "mask" }).default(""),
  comment_count: z.int().min(0).default(0),
  uid_creator: z.string(),
  updated_by: z.string().default(""),
  ...TimestampFields,
}).meta({
  title: "Thread",
  collection: "threads",
  displayDefaults: {
    columns: ["title", "last_message_at", "comment_count"],
    filters: {},
    sort: { column: "last_message_at", direction: "desc" },
  },
});

// ── Input schemas ───────────────────────────────────────────────────

/** Input for PATCH /threads/:uid — rename only. */
export interface UpdateThreadInputType {
  title: string | null;
}

/** Zod schema for updating a thread. */
export const UpdateThreadInput: z.ZodType<UpdateThreadInputType> = z.object({
  title: z.string().max(200).meta({ pii: "mask" }).nullable(),
});
