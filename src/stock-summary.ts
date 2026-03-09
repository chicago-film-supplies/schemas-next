/**
 * StockSummary document schema — Firestore collection: stock-summaries
 */
import { z } from "zod";
import {
  FirestoreTimestamp,
  type FirestoreTimestampType,
  NoteEntry,
  type NoteEntryType,
  ProductTypeEnum,
  type ProductTypeType,
} from "./common.ts";

const SUMMARY_TYPES = ["sale", "rental"] as const;
type SummaryTypeType = typeof SUMMARY_TYPES[number];

export interface StockSummaryStoreLocation {
  uid_location: string;
  name: string;
  quantity: number;
  default: boolean;
  max: number | null;
  notes: NoteEntryType[];
}

export interface StockSummaryStore {
  uid_store: string;
  name: string;
  default: boolean;
  crms_stock_level_id: number | null;
  quantity: number;
  locations: StockSummaryStoreLocation[];
}

export interface StockSummary {
  uid: string;
  uid_product: string;
  summary_type: SummaryTypeType;
  type: ProductTypeType;
  dates: {
    start: string;
    start_fs: FirestoreTimestampType;
    end: string | null;
    end_fs: FirestoreTimestampType | null;
  };
  bookings: Record<string, unknown>[];
  bookings_breakdown: {
    quoted: number;
    reserved: number;
    prepped: number;
    out: number;
    returned: number;
    lost: number;
    damaged: number;
  };
  out_of_service_breakdown: {
    cleaning: number;
    damaged: number;
    maintenance: number;
    lost: number;
  };
  quantity_available: number;
  quantity_booked: number;
  quantity_held: number;
  quantity_in_service: number;
  quantity_out_of_service: number;
  store_breakdown: StockSummaryStore[];
  query_by_uid_store: string[];
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
  expiresAt: FirestoreTimestampType;
}

const StockSummaryStoreLocationSchema: z.ZodType<StockSummaryStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number(),
  default: z.boolean(),
  max: z.number().nullable(),
  notes: z.array(NoteEntry).default([]),
});

const StockSummaryStoreSchema: z.ZodType<StockSummaryStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  crms_stock_level_id: z.number().nullable(),
  quantity: z.number(),
  locations: z.array(StockSummaryStoreLocationSchema).default([]),
});

export const StockSummarySchema: z.ZodType<StockSummary> = z.strictObject({
  uid: z.string(),
  uid_product: z.string(),
  summary_type: z.enum(SUMMARY_TYPES),
  type: ProductTypeEnum,
  dates: z.strictObject({
    start: z.string(),
    start_fs: FirestoreTimestamp,
    end: z.string().nullable(),
    end_fs: FirestoreTimestamp.nullable(),
  }),
  bookings: z.array(z.record(z.string(), z.unknown())),
  bookings_breakdown: z.strictObject({
    quoted: z.number(),
    reserved: z.number(),
    prepped: z.number(),
    out: z.number(),
    returned: z.number(),
    lost: z.number(),
    damaged: z.number(),
  }),
  out_of_service_breakdown: z.strictObject({
    cleaning: z.number(),
    damaged: z.number(),
    maintenance: z.number(),
    lost: z.number(),
  }),
  quantity_available: z.number(),
  quantity_booked: z.number(),
  quantity_held: z.number(),
  quantity_in_service: z.number(),
  quantity_out_of_service: z.number(),
  store_breakdown: z.array(StockSummaryStoreSchema).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
}).meta({ title: "Stock Summary", collection: "stock-summaries" });
