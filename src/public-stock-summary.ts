/**
 * PublicStockSummary document schema — Firestore collection: public-stock-summaries
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType, ProductTypeEnum, type ProductTypeType } from "./common.ts";

const SUMMARY_TYPES = ["sale", "rental"] as const;
type SummaryTypeType = typeof SUMMARY_TYPES[number];

export interface PublicStockSummaryStore {
  uid_store: string;
  quantity: number;
}

export interface PublicStockSummary {
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
  quantity_available: number;
  store_breakdown: PublicStockSummaryStore[];
  query_by_uid_store: string[];
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
  expiresAt: FirestoreTimestampType;
}

export const PublicStockSummarySchema: z.ZodType<PublicStockSummary> = z.strictObject({
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
  quantity_available: z.number(),
  store_breakdown: z.array(z.strictObject({
    uid_store: z.string(),
    quantity: z.number(),
  })).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
}).meta({
  title: "Public Stock Summary",
  collection: "public-stock-summaries",
  displayDefaults: {
    columns: ["uid_product", "stores"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
