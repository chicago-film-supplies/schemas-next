/**
 * InventoryLedger document schema — Firestore collection: inventory-ledgers
 */
import { z } from "zod";
import {
  FirestoreTimestamp,
  NoteEntry,
  type NoteEntryType,
  ProductTypeEnum,
  type ProductTypeType,
} from "./common.ts";

const INVENTORY_STOCK_METHODS = ["bulk", "serialized"] as const;
type InventoryStockMethodType = typeof INVENTORY_STOCK_METHODS[number];

export interface InventoryLedgerLocation {
  uid_location: string;
  name: string;
  quantity: number;
  default: boolean;
  max?: number | null;
  notes: NoteEntryType[];
}

export interface InventoryLedgerStore {
  uid_store: string;
  name: string;
  default?: boolean;
  crms_stock_level_id?: number | null;
  quantity: number;
  locations: InventoryLedgerLocation[];
}

export interface InventoryLedger {
  uid: string;
  uid_product: string;
  type: ProductTypeType;
  stock_method: InventoryStockMethodType;
  quantity_held: number;
  quantity_in_service: number;
  quantity_out_of_service: number;
  average_unit_cost?: number;
  total_cost_basis?: number;
  out_of_service_breakdown: {
    cleaning?: number;
    damaged?: number;
    maintenance?: number;
    lost?: number;
  };
  store_breakdown: InventoryLedgerStore[];
  query_by_uid_store: string[];
  created_at?: unknown;
  updated_at?: unknown;
}

const InventoryLedgerLocationSchema: z.ZodType<InventoryLedgerLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number(),
  default: z.boolean(),
  max: z.number().nullable().optional(),
  notes: z.array(NoteEntry).default([]),
});

const InventoryLedgerStoreSchema: z.ZodType<InventoryLedgerStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean().optional(),
  crms_stock_level_id: z.number().nullable().optional(),
  quantity: z.number(),
  locations: z.array(InventoryLedgerLocationSchema).default([]),
});

export const InventoryLedgerSchema: z.ZodType<InventoryLedger> = z.strictObject({
  uid: z.string(),
  uid_product: z.string(),
  type: ProductTypeEnum,
  stock_method: z.enum(INVENTORY_STOCK_METHODS),
  quantity_held: z.number(),
  quantity_in_service: z.number(),
  quantity_out_of_service: z.number(),
  average_unit_cost: z.number().optional(),
  total_cost_basis: z.number().optional(),
  out_of_service_breakdown: z.strictObject({
    cleaning: z.number().optional(),
    damaged: z.number().optional(),
    maintenance: z.number().optional(),
    lost: z.number().optional(),
  }),
  store_breakdown: z.array(InventoryLedgerStoreSchema).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
});
