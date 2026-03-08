/**
 * Transaction document schema — Firestore collection: transactions
 */
import { z } from "zod";
import { FirestoreTimestamp, NoteEntry, type NoteEntryType } from "./common.ts";

export const TRANSACTION_TYPES = [
  "purchase", "find", "make", "opening_balance", "adjustment_increase",
  "sale", "write_off", "trade_in", "adjustment_decrease",
  "transfer_increase", "transfer_decrease",
  "acquisition", "disposal", "partial_disposal",
  "depreciation_tax", "depreciation_gaap",
] as const;
export type TransactionTypeType = typeof TRANSACTION_TYPES[number];
const TransactionType: z.ZodType<TransactionTypeType> = z.enum(TRANSACTION_TYPES);

const INCREASE_TYPES: TransactionTypeType[] = [
  "purchase", "make", "find", "opening_balance", "adjustment_increase", "transfer_increase",
];
const DECREASE_TYPES: TransactionTypeType[] = [
  "sale", "trade_in", "write_off", "adjustment_decrease", "transfer_decrease",
];

/**
 * Returns +1 for increase types, -1 for decrease types.
 * Throws for financial-only types (acquisition, disposal, depreciation).
 */
export function getTransactionMultiplier(type: TransactionTypeType): 1 | -1 {
  if (INCREASE_TYPES.includes(type)) return 1;
  if (DECREASE_TYPES.includes(type)) return -1;
  throw new Error("Transaction type does not have a quantity multiplier: " + type);
}

const TRANSACTION_SOURCE_TYPES = ["manual", "order", "internal"] as const;
type TransactionSourceTypeType = typeof TRANSACTION_SOURCE_TYPES[number];

export interface TransactionStoreLocation {
  uid_location: string;
  name: string;
  quantity: number;
  transactionQuantity: number;
  default: boolean;
  notes: string[];
  max: number | null;
}

export interface TransactionStore {
  uid_store: string;
  name: string;
  default: boolean;
  quantity: number;
  locations: TransactionStoreLocation[];
}

export interface TransactionSource {
  type: TransactionSourceTypeType;
  number: string | number | null;
  uid: string | null;
}

export interface Transaction {
  uid: string;
  uid_product: string;
  type: TransactionTypeType;
  quantity: number;
  total_cost: number;
  unit_cost: number;
  unit_costs: number[];
  date: string;
  date_fs: unknown;
  reference: string;
  source: TransactionSource;
  stores: TransactionStore[];
  query_by_uid_store: string[];
  notes: NoteEntryType[];
  serialized_details: {
    asset_tags: string[];
    serial_numbers: string[];
  } | null;
  crms_sync: Record<string, {
    stock_level_id: number | null;
    transaction_id: number | null;
  }>;
  created_at: unknown;
  updated_at: unknown;
}

const TransactionStoreLocationSchema: z.ZodType<TransactionStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number(),
  transactionQuantity: z.number(),
  default: z.boolean(),
  notes: z.array(z.string()).default([]),
  max: z.number().nullable(),
});

const TransactionStoreSchema: z.ZodType<TransactionStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number(),
  locations: z.array(TransactionStoreLocationSchema).default([]),
});

const SourceSchema: z.ZodType<TransactionSource> = z.strictObject({
  type: z.enum(TRANSACTION_SOURCE_TYPES),
  number: z.union([z.string(), z.number()]).nullable(),
  uid: z.string().nullable(),
});

export const TransactionSchema: z.ZodType<Transaction> = z.strictObject({
  uid: z.string(),
  uid_product: z.string(),
  type: TransactionType,
  quantity: z.number(),
  total_cost: z.number(),
  unit_cost: z.number(),
  unit_costs: z.array(z.number()).default([]),
  date: z.string(),
  date_fs: FirestoreTimestamp,
  reference: z.string(),
  source: SourceSchema,
  stores: z.array(TransactionStoreSchema).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  notes: z.array(NoteEntry).default([]),
  serialized_details: z.strictObject({
    asset_tags: z.array(z.string()).default([]),
    serial_numbers: z.array(z.string()).default([]),
  }).nullable(),
  crms_sync: z.record(z.string(), z.strictObject({
    stock_level_id: z.number().nullable(),
    transaction_id: z.number().nullable(),
  })).default({}),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({
  title: "Transaction",
  collection: "transactions",
  initial: {"date":"","notes":[],"quantity":0,"query_by_uid_store":[],"reference":"","serialized_details":null,"type":"opening_balance","uid":null,"uid_product":null,"source":{"type":"manual","number":null,"uid":null},"stores":[],"total_cost":0,"unit_cost":0,"unit_costs":[]},
});

// ── Input schemas for manual transactions ────────────────────────

const MANUAL_TRANSACTION_TYPES = [
  "purchase", "find", "make", "opening_balance", "adjustment_increase",
  "sale", "write_off", "trade_in", "adjustment_decrease",
] as const;

const InputTransactionStoreLocationSchema = z.object({
  uid_location: z.string(),
  name: z.string(),
  transactionQuantity: z.number().int(),
  default: z.boolean(),
  max: z.number().nullable(),
  notes: z.array(z.string()).default([]),
});

const InputTransactionStoreSchema = z.object({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number(),
  locations: z.array(InputTransactionStoreLocationSchema).min(1),
});

export const CreateTransactionInput = z.object({
  uid: z.string().min(1),
  uid_product: z.string().min(1),
  type: z.enum(MANUAL_TRANSACTION_TYPES),
  quantity: z.number().int().positive(),
  total_cost: z.number().min(0),
  date: z.string().min(1),
  reference: z.string(),
  stores: z.array(InputTransactionStoreSchema).min(1),
  note: z.string().optional(),
  serialized_details: z.object({
    asset_tags: z.array(z.string()).default([]),
    serial_numbers: z.array(z.string()).default([]),
  }).nullable().optional(),
});
export type CreateTransactionInputType = z.infer<typeof CreateTransactionInput>;

export const UpdateTransactionInput = z.object({
  uid: z.string().min(1),
  uid_product: z.string().min(1),
  type: z.enum(MANUAL_TRANSACTION_TYPES),
  quantity: z.number().int().positive(),
  total_cost: z.number().min(0),
  date: z.string().min(1),
  reference: z.string(),
  stores: z.array(InputTransactionStoreSchema).min(1),
  note: z.string().optional(),
  serialized_details: z.object({
    asset_tags: z.array(z.string()).default([]),
    serial_numbers: z.array(z.string()).default([]),
  }).nullable().optional(),
});
export type UpdateTransactionInputType = z.infer<typeof UpdateTransactionInput>;

export const CreateStoreTransferInput = z.object({
  uid_product: z.string().min(1),
  quantity: z.number().int().positive(),
  date: z.string().min(1),
  reference: z.string(),
  stores_from: z.array(InputTransactionStoreSchema).min(1),
  stores_to: z.array(InputTransactionStoreSchema).min(1),
  total_cost: z.number().min(0).optional().default(0),
  serialized_details: z.object({
    asset_tags: z.array(z.string()).default([]),
    serial_numbers: z.array(z.string()).default([]),
  }).nullable().optional(),
});
export type CreateStoreTransferInputType = z.infer<typeof CreateStoreTransferInput>;

export const UpdateStoreTransferInput = z.object({
  uid_product: z.string().min(1),
  transfer_number: z.number().int(),
  quantity: z.number().int().positive(),
  date: z.string().min(1),
  reference: z.string(),
  stores_from: z.array(InputTransactionStoreSchema).min(1),
  stores_to: z.array(InputTransactionStoreSchema).min(1),
  total_cost: z.number().min(0).optional().default(0),
  serialized_details: z.object({
    asset_tags: z.array(z.string()).default([]),
    serial_numbers: z.array(z.string()).default([]),
  }).nullable().optional(),
});
export type UpdateStoreTransferInputType = z.infer<typeof UpdateStoreTransferInput>;
