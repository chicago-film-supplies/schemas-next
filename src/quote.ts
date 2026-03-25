/**
 * Quote document schema — Firestore collection: quotes
 *
 * PDF quotes associated with orders.
 * UID scheme: "{orderUid}:draft" for live draft, "{orderUid}:v{N}" for saved versions.
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

export interface Quote {
  uid: string;
  uid_order: string;
  order_number: number;
  version: number | null;
  is_draft: boolean;
  uploadcare_uuid: string | null;
  deleted_at: FirestoreTimestampType | null;
  expires_at: FirestoreTimestampType | null;
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
}

export const QuoteSchema: z.ZodType<Quote> = z.strictObject({
  uid: z.string(),
  uid_order: z.string(),
  order_number: z.number(),
  version: z.int().min(0).nullable(),
  is_draft: z.boolean(),
  uploadcare_uuid: z.string().nullable(),
  deleted_at: FirestoreTimestamp.nullable(),
  expires_at: FirestoreTimestamp.nullable(),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({
  title: "Quote",
  collection: "quotes",
  displayDefaults: {
    columns: ["uid_order", "version"],
    filters: {},
    sort: { column: "version", direction: "desc" },
  },
});

/** Input for saving a new quote version. */
export interface SaveQuoteVersionInputType {
  uid_order: string;
}
export const SaveQuoteVersionInput: z.ZodType<SaveQuoteVersionInputType> = z.object({
  uid_order: z.string().min(1),
});

/** Input for restoring a soft-deleted quote. */
export interface RestoreQuoteInputType {
  uid: string;
}
export const RestoreQuoteInput: z.ZodType<RestoreQuoteInputType> = z.object({
  uid: z.string().min(1),
});
