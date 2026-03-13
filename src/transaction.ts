/**
 * Transaction document schema — Firestore collection: transactions
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType, NoteEntry, type NoteEntryType } from "./common.ts";

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

/** Financial-only types that don't involve physical inventory movement. */
const FINANCIAL_ONLY_TYPES: TransactionTypeType[] = [
  "acquisition", "disposal", "partial_disposal",
  "depreciation_tax", "depreciation_gaap",
];

/**
 * Determines if a transaction type should track costs (total_cost / unit_cost).
 * Returns false for transfers and financial-only types.
 */
export function hasCosts(type: TransactionTypeType): boolean {
  if (FINANCIAL_ONLY_TYPES.includes(type)) return false;
  if (type === "transfer_increase" || type === "transfer_decrease") return false;
  return true;
}

/**
 * Returns transaction types suitable for UI display in manual transaction forms.
 * Excludes financial-only types (acquisition, disposal, depreciation) and transfers.
 * When `increaseOnly` is true, returns only types that increase inventory
 * (for first transactions / opening balance scenarios).
 */
export function getDisplayTransactionTypes(increaseOnly?: boolean): TransactionTypeType[] {
  if (increaseOnly) {
    return ["purchase", "make", "find"];
  }
  return TRANSACTION_TYPES.filter(
    (t) => !FINANCIAL_ONLY_TYPES.includes(t) && t !== "transfer_increase" && t !== "transfer_decrease" && t !== "opening_balance",
  );
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
  date_fs: FirestoreTimestampType;
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
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
}

export const TransactionStoreLocationSchema: z.ZodType<TransactionStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number(),
  transactionQuantity: z.number(),
  default: z.boolean(),
  notes: z.array(z.string()).default([]),
  max: z.number().nullable(),
});

export const TransactionStoreSchema: z.ZodType<TransactionStore> = z.strictObject({
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
  displayDefaults: {
    columns: ["date", "quantity", "source.type", "type", "reference"],
    filters: {},
    sort: { column: "date", direction: "desc" },
  },
});

// ── Input schemas for manual transactions ────────────────────────

const MANUAL_TRANSACTION_TYPES = [
  "purchase", "find", "make", "opening_balance", "adjustment_increase",
  "sale", "write_off", "trade_in", "adjustment_decrease",
] as const;

interface InputTransactionStoreLocation {
  uid_location: string;
  name: string;
  transactionQuantity: number;
  default: boolean;
  max: number | null;
  notes: string[];
}

const InputTransactionStoreLocationSchema: z.ZodType<InputTransactionStoreLocation> = z.object({
  uid_location: z.string(),
  name: z.string(),
  transactionQuantity: z.number().int(),
  default: z.boolean(),
  max: z.number().nullable(),
  notes: z.array(z.string()).default([]),
});

interface InputTransactionStore {
  uid_store: string;
  name: string;
  default: boolean;
  quantity: number;
  locations: InputTransactionStoreLocation[];
}

const InputTransactionStoreSchema: z.ZodType<InputTransactionStore> = z.object({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number(),
  locations: z.array(InputTransactionStoreLocationSchema).min(1),
});

export interface CreateTransactionInputType {
  uid: string;
  uid_product: string;
  type: typeof MANUAL_TRANSACTION_TYPES[number];
  quantity: number;
  total_cost: number;
  date: string;
  reference: string;
  stores: InputTransactionStore[];
  note?: string;
  serialized_details?: {
    asset_tags: string[];
    serial_numbers: string[];
  } | null;
}

export const CreateTransactionInput: z.ZodType<CreateTransactionInputType> = z.object({
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

export interface UpdateTransactionInputType {
  uid: string;
  uid_product: string;
  type: typeof MANUAL_TRANSACTION_TYPES[number];
  quantity: number;
  total_cost: number;
  date: string;
  reference: string;
  stores: InputTransactionStore[];
  note?: string;
  serialized_details?: {
    asset_tags: string[];
    serial_numbers: string[];
  } | null;
}

export const UpdateTransactionInput: z.ZodType<UpdateTransactionInputType> = z.object({
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

export interface CreateStoreTransferInputType {
  uid_product: string;
  quantity: number;
  date: string;
  reference: string;
  stores_from: InputTransactionStore[];
  stores_to: InputTransactionStore[];
  total_cost?: number;
  serialized_details?: {
    asset_tags: string[];
    serial_numbers: string[];
  } | null;
}

export const CreateStoreTransferInput: z.ZodType<CreateStoreTransferInputType> = z.object({
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

export interface UpdateStoreTransferInputType {
  uid_product: string;
  transfer_number: number;
  quantity: number;
  date: string;
  reference: string;
  stores_from: InputTransactionStore[];
  stores_to: InputTransactionStore[];
  total_cost?: number;
  serialized_details?: {
    asset_tags: string[];
    serial_numbers: string[];
  } | null;
}

export const UpdateStoreTransferInput: z.ZodType<UpdateStoreTransferInputType> = z.object({
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
