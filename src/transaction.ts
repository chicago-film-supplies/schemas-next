/**
 * Transaction document schema — Firestore collection: transactions
 */
import { z } from "zod";
import { FirestoreTimestamp, NoteEntry, type NoteEntryType, TimestampFields } from "./common.ts";

const TRANSACTION_TYPES = [
  "purchase", "find", "make", "opening_balance", "adjustment_increase",
  "sale", "write_off", "trade_in", "adjustment_decrease",
  "transfer_increase", "transfer_decrease",
  "acquisition", "disposal", "partial_disposal",
  "depreciation_tax", "depreciation_gaap",
] as const;
type TransactionTypeType = typeof TRANSACTION_TYPES[number];
const TransactionType: z.ZodType<TransactionTypeType> = z.enum(TRANSACTION_TYPES);

const TRANSACTION_SOURCE_TYPES = ["manual", "order", "internal"] as const;
type TransactionSourceTypeType = typeof TRANSACTION_SOURCE_TYPES[number];

export interface TransactionStoreLocation {
  uid_location: string;
  name: string;
  quantity?: number;
  transactionQuantity: number;
  default: boolean;
  notes?: string[];
  max?: number | null;
}

export interface TransactionStore {
  uid_store: string;
  name: string;
  default: boolean;
  quantity?: number;
  locations: TransactionStoreLocation[];
}

export interface TransactionSource {
  type: TransactionSourceTypeType;
  number?: string | number | null;
  uid?: string | null;
}

export interface Transaction {
  uid: string;
  uid_product: string;
  type: TransactionTypeType;
  quantity: number;
  total_cost: number;
  unit_cost: number;
  unit_costs?: number[];
  date?: string;
  date_fs?: unknown;
  reference: string;
  source?: TransactionSource;
  stores?: TransactionStore[];
  query_by_uid_store?: string[];
  notes?: NoteEntryType[];
  serialized_details?: {
    asset_tags?: string[];
    serial_numbers?: string[];
  } | null;
  crms_sync?: Record<string, {
    stock_level_id: number | null;
    transaction_id: number | null;
  }>;
  created_at?: unknown;
  updated_at?: unknown;
}

const TransactionStoreLocationSchema: z.ZodType<TransactionStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number().optional(),
  transactionQuantity: z.number(),
  default: z.boolean(),
  notes: z.array(z.string()).optional(),
  max: z.number().nullable().optional(),
});

const TransactionStoreSchema: z.ZodType<TransactionStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number().optional(),
  locations: z.array(TransactionStoreLocationSchema).default([]),
});

const SourceSchema: z.ZodType<TransactionSource> = z.strictObject({
  type: z.enum(TRANSACTION_SOURCE_TYPES),
  number: z.union([z.string(), z.number()]).nullable().optional(),
  uid: z.string().nullable().optional(),
});

export const TransactionSchema: z.ZodType<Transaction> = z.strictObject({
  uid: z.string(),
  uid_product: z.string(),
  type: TransactionType,
  quantity: z.number(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit_costs: z.array(z.number()).optional(),
  date: z.string().optional(),
  date_fs: FirestoreTimestamp,
  reference: z.string(),
  source: SourceSchema.optional(),
  stores: z.array(TransactionStoreSchema).default([]).optional(),
  query_by_uid_store: z.array(z.string()).default([]).optional(),
  notes: z.array(NoteEntry).optional(),
  serialized_details: z.strictObject({
    asset_tags: z.array(z.string()).optional(),
    serial_numbers: z.array(z.string()).optional(),
  }).nullable().optional(),
  crms_sync: z.record(z.string(), z.strictObject({
    stock_level_id: z.number().nullable(),
    transaction_id: z.number().nullable(),
  })).optional(),
  ...TimestampFields,
});
