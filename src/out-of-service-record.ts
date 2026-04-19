/**
 * OutOfServiceRecord document schema — Firestore collection: out-of-service
 */
import { z } from "zod";
import {
  FirestoreTimestamp,
  type FirestoreTimestampType,
  OOSReasonEnum,
  type OOSReasonType,
  TimestampFields,
} from "./common.ts";

const OOS_SOURCE_TYPES = ["manual", "order"] as const;
type OOSSourceTypeType = typeof OOS_SOURCE_TYPES[number];

/** A location within a store affected by an out-of-service record. */
export interface OOSStoreLocation {
  uid_location: string;
  name: string;
  transactionQuantity: number;
  default: boolean;
  max?: number | null;
}

/** A store affected by an out-of-service record. */
export interface OOSStore {
  uid_store: string;
  name: string;
  locations: OOSStoreLocation[];
}

/** A transaction entry within an out-of-service record. */
export interface OOSTransaction {
  crms_id?: number | null;
  crms_quarantine_id?: number | null;
  crms_stock_level_id?: number | null;
  date: string;
  date_fs?: FirestoreTimestampType;
  out_of_service_uid: string;
  quantity: number;
  stock_level_uid?: string;
  type: string;
}

/** The origin source of an out-of-service record (manual or order). */
export interface OOSSource {
  type: OOSSourceTypeType;
  number?: string | number | null;
  uid?: string | null;
}

/** An out-of-service record tracking inventory removed from active service. */
export interface OutOfServiceRecord {
  uid: string;
  uid_product: string;
  reason: OOSReasonType;
  quantity: number;
  quantity_return_to_service: number;
  quantity_write_off: number;
  complete?: boolean;
  date_start: string;
  date_start_fs?: FirestoreTimestampType;
  date_end?: string;
  date_end_fs?: FirestoreTimestampType;
  crms_id?: number | null;
  crms_stock_level_id?: number | null;
  source: OOSSource;
  stock_level_id?: string | null;
  stores?: OOSStore[];
  query_by_uid_store?: string[];
  query_by_uid_location?: string[];
  transactions?: OOSTransaction[];
  version: number;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

const OOSStoreLocationSchema: z.ZodType<OOSStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  transactionQuantity: z.number(),
  default: z.boolean(),
  max: z.number().nullable().optional(),
});

const OOSStoreSchema: z.ZodType<OOSStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  locations: z.array(OOSStoreLocationSchema).default([]),
});

const OOSTransactionSchema: z.ZodType<OOSTransaction> = z.strictObject({
  crms_id: z.number().nullable().optional(),
  crms_quarantine_id: z.number().nullable().optional(),
  crms_stock_level_id: z.number().nullable().optional(),
  date: z.string(),
  date_fs: FirestoreTimestamp,
  out_of_service_uid: z.string(),
  quantity: z.number(),
  stock_level_uid: z.string().optional(),
  type: z.string(),
});

const OOSSourceSchema: z.ZodType<OOSSource> = z.strictObject({
  type: z.enum(OOS_SOURCE_TYPES),
  number: z.union([z.string(), z.number()]).nullable().optional(),
  uid: z.string().nullable().optional(),
});

/** Zod schema for OutOfServiceRecord. */
export const OutOfServiceRecordSchema: z.ZodType<OutOfServiceRecord> = z.strictObject({
  uid: z.string(),
  uid_product: z.string(),
  reason: OOSReasonEnum,
  quantity: z.number(),
  quantity_return_to_service: z.number(),
  quantity_write_off: z.number(),
  complete: z.boolean().optional(),
  date_start: z.string(),
  date_start_fs: FirestoreTimestamp,
  date_end: z.string().optional(),
  date_end_fs: FirestoreTimestamp,
  crms_id: z.number().nullable().optional(),
  crms_stock_level_id: z.number().nullable().optional(),
  source: OOSSourceSchema,
  stock_level_id: z.string().nullable().optional(),
  stores: z.array(OOSStoreSchema).default([]).optional(),
  query_by_uid_store: z.array(z.string()).default([]).optional(),
  query_by_uid_location: z.array(z.string()).default([]).optional(),
  transactions: z.array(OOSTransactionSchema).optional(),
  version: z.int().min(0).default(0),
  ...TimestampFields,
}).meta({
  title: "Out of Service Record",
  collection: "out-of-service",
  displayDefaults: {
    columns: ["source.type", "reason", "quantity", "date_start", "date_end"],
    filters: {},
    sort: { column: "date_start", direction: "desc" },
  },
});
