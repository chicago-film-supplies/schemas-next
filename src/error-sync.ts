/**
 * ErrorSync document schema — Firestore collection: errors-sync
 *
 * Records external API sync failures (CRMS, Xero, Typesense, etc.)
 * so the manager app can surface and resolve them.
 *
 * TTL: 3 months via expiresAt Firestore policy.
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

const SYNC_SERVICES = ["crms", "xero", "typesense", "trello", "calendar", "uploadcare"] as const;
export type SyncServiceType = typeof SYNC_SERVICES[number];

export interface ErrorSync {
  uid: string;
  service: SyncServiceType;
  operation: string;
  document_path: string;
  status: number | null;
  method: string | null;
  url: string | null;
  error: string;
  resolved: boolean;
  resolved_at: FirestoreTimestampType | null;
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
  expiresAt: FirestoreTimestampType;
}

export const ErrorSyncSchema: z.ZodType<ErrorSync> = z.strictObject({
  uid: z.string(),
  service: z.enum(SYNC_SERVICES),
  operation: z.string(),
  document_path: z.string(),
  status: z.number().nullable(),
  method: z.string().nullable(),
  url: z.string().nullable(),
  error: z.string().max(5000),
  resolved: z.boolean(),
  resolved_at: FirestoreTimestamp.nullable(),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
}).meta({ title: "ErrorSync", collection: "errors-sync" });
