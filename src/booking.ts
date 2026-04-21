/**
 * Booking document schema — Firestore collection: bookings
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  ComponentTypeEnum,
  type ComponentTypeType,
  FirestoreTimestamp,
  type FirestoreTimestampType,
} from "./common.ts";

const BOOKING_STATUSES = [
  "draft", "quoted", "reserved", "part-prepped", "prepped", "active", "complete",
] as const;
type BookingStatusType = typeof BOOKING_STATUSES[number];
const BookingStatus: z.ZodType<BookingStatusType> = z.enum(BOOKING_STATUSES);

/** A reference to a destination with its address, used in booking delivery/collection. */
export interface BookingDestinationRef {
  uid: string;
  address: AddressType | null;
}

/** A specific location within a store allocated for a booking. */
export interface BookingStoreLocation {
  uid_location: string;
  name: string;
  quantity: number;
  default: boolean;
}

/** A store and its locations assigned to a booking. */
export interface BookingStore {
  uid_store: string;
  name: string;
  default: boolean;
  quantity: number;
  locations: BookingStoreLocation[];
}

/** Full Firestore document for a booking (a single product line within an order). */
export interface Booking {
  uid: string;
  uid_order: string;
  uid_product: string;
  name: string;
  number: number;
  type: ComponentTypeType;
  status: BookingStatusType;
  quantity: number;
  shortage: number;
  subject: string;
  unit_price: number;
  total_price: number;
  crms_id?: number | null;
  crms_product_id?: number | null;
  breakdown: {
    damaged: number;
    lost: number;
    out: number;
    prepped: number;
    quoted: number;
    reserved: number;
    returned: number;
  };
  dates: {
    start: string;
    start_fs: FirestoreTimestampType;
    end: string | null;
    end_fs: FirestoreTimestampType | null;
    charge_start: string;
    charge_start_fs: FirestoreTimestampType;
    charge_end: string | null;
    charge_end_fs: FirestoreTimestampType | null;
  };
  destinations: {
    delivery: BookingDestinationRef | null;
    collection: BookingDestinationRef | null;
  };
  organization: {
    uid: string | null;
    name: string;
    crms_id: number | null;
  };
  stores: BookingStore[];
  query_by_uid_store: string[];
  query_by_uid_location: string[];
  uid_destination_delivery: string;
  uid_destination_collection: string;
  version: number;
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
}

const BookingDestinationRefSchema: z.ZodType<BookingDestinationRef> = z.strictObject({
  uid: z.string(),
  address: Address,
});

const BookingStoreLocationSchema: z.ZodType<BookingStoreLocation> = z.strictObject({
  uid_location: z.string(),
  name: z.string(),
  quantity: z.number(),
  default: z.boolean(),
});

const BookingStoreSchema: z.ZodType<BookingStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number(),
  locations: z.array(BookingStoreLocationSchema).default([]),
});

/** Zod schema for Booking. */
export const BookingSchema: z.ZodType<Booking> = z.strictObject({
  uid: z.string(),
  uid_order: z.string(),
  uid_product: z.string(),
  name: z.string(),
  number: z.int().meta({ label: "#", linkTo: "orderDetail" }),
  type: ComponentTypeEnum,
  status: BookingStatus,
  quantity: z.number(),
  shortage: z.number(),
  subject: z.string(),
  unit_price: z.number(),
  total_price: z.number(),
  // crms_id and crms_product_id are written back post-transaction by CRMS sync
  crms_id: z.number().nullable().optional(),
  crms_product_id: z.number().nullable().optional(),
  breakdown: z.strictObject({
    damaged: z.number(),
    lost: z.number(),
    out: z.number(),
    prepped: z.number(),
    quoted: z.number(),
    reserved: z.number(),
    returned: z.number(),
  }),
  dates: z.strictObject({
    start: z.string(),
    start_fs: FirestoreTimestamp,
    end: z.string().nullable(),
    end_fs: FirestoreTimestamp.nullable(),
    charge_start: z.string(),
    charge_start_fs: FirestoreTimestamp,
    charge_end: z.string().nullable(),
    charge_end_fs: FirestoreTimestamp.nullable(),
  }),
  destinations: z.strictObject({
    delivery: BookingDestinationRefSchema.nullable(),
    collection: BookingDestinationRefSchema.nullable(),
  }),
  organization: z.strictObject({
    uid: z.string().nullable(),
    name: z.string().meta({ pii: "mask" }),
    crms_id: z.number().nullable(),
  }),
  stores: z.array(BookingStoreSchema).default([]),
  query_by_uid_store: z.array(z.string()).default([]),
  query_by_uid_location: z.array(z.string()).default([]),
  uid_destination_delivery: z.string(),
  uid_destination_collection: z.string(),
  version: z.int().min(0).default(0),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({
  title: "Booking",
  collection: "bookings",
  displayDefaults: {
    columns: ["number", "status", "organization.name", "quantity", "dates.start", "dates.end"],
    filters: {},
    sort: { column: "number", direction: "desc" },
  },
});
