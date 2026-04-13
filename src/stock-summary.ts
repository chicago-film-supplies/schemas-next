/**
 * StockSummary document schema — Firestore collection: stock-summaries
 */
import { z } from "zod";
import {
  FirestoreTimestamp,
  type FirestoreTimestampType,
  StoreBreakdownEntrySchema,
  type StoreBreakdownEntry,
  ProductTypeEnum,
  type ProductTypeType,
} from "./common.ts";
import { type Booking, BookingSchema } from "./booking.ts";

const SUMMARY_TYPES = ["sale", "rental"] as const;
type SummaryTypeType = typeof SUMMARY_TYPES[number];


/** A stock summary document aggregating availability and bookings for a product over a date range. */
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
  bookings: Booking[];
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
  store_breakdown: StoreBreakdownEntry[];
  query_by_uid_store: string[];
  query_by_uid_location: string[];
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
  expiresAt: FirestoreTimestampType;
}

/** Zod schema for StockSummary. */
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
  bookings: z.array(BookingSchema),
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
  store_breakdown: z.array(StoreBreakdownEntrySchema).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  query_by_uid_location: z.array(z.string()).default([]),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
}).meta({
  title: "Stock Summary",
  collection: "stock-summaries",
  displayDefaults: {
    columns: ["uid_product", "stores"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
