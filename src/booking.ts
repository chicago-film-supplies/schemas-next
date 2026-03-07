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
  NoteEntry,
  type NoteEntryType,
  TimestampFields,
} from "./common.ts";

const BOOKING_STATUSES = [
  "draft", "quoted", "reserved", "part-prepped", "prepped", "active", "complete",
] as const;
type BookingStatusType = typeof BOOKING_STATUSES[number];
const BookingStatus: z.ZodType<BookingStatusType> = z.enum(BOOKING_STATUSES);

export interface BookingDestinationRef {
  uid: string;
  address: AddressType | null;
}

export interface BookingStoreLocation {
  uid_location: string;
  name: string;
  quantity: number;
  default: boolean;
  notes: NoteEntryType[];
}

export interface BookingStore {
  uid_store: string;
  name: string;
  default: boolean;
  quantity: number;
  locations: BookingStoreLocation[];
}

export interface Booking {
  uid: string;
  uid_order: string;
  uid_product: string;
  name?: string;
  number?: number;
  type: ComponentTypeType;
  status: BookingStatusType;
  quantity: number;
  shortage?: number;
  subject?: string;
  unit_price?: number;
  total_price?: number;
  crms_id?: number;
  crms_product_id?: number;
  breakdown: {
    damaged?: number;
    lost?: number;
    out?: number;
    prepped?: number;
    quoted?: number;
    reserved?: number;
    returned?: number;
  };
  dates: {
    start?: string;
    start_fs?: unknown;
    end?: string | null;
    end_fs?: unknown;
    charge_start?: string;
    charge_start_fs?: unknown;
    charge_end?: string | null;
    charge_end_fs?: unknown;
  };
  destinations?: {
    delivery?: BookingDestinationRef | null;
    collection?: BookingDestinationRef | null;
  };
  organization: {
    uid: string | null;
    name: string;
    crms_id?: number | null;
  };
  stores?: BookingStore[];
  query_by_uid_store?: string[];
  uid_destination_delivery?: string;
  uid_destination_collection?: string;
  created_at?: unknown;
  updated_at?: unknown;
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
  notes: z.array(NoteEntry).default([]),
});

const BookingStoreSchema: z.ZodType<BookingStore> = z.strictObject({
  uid_store: z.string(),
  name: z.string(),
  default: z.boolean(),
  quantity: z.number(),
  locations: z.array(BookingStoreLocationSchema).default([]),
});

export const BookingSchema: z.ZodType<Booking> = z.strictObject({
  uid: z.string(),
  uid_order: z.string(),
  uid_product: z.string(),
  name: z.string().optional(),
  number: z.number().optional(),
  type: ComponentTypeEnum,
  status: BookingStatus,
  quantity: z.number(),
  shortage: z.number().optional(),
  subject: z.string().optional(),
  unit_price: z.number().optional(),
  total_price: z.number().optional(),
  crms_id: z.number().optional(),
  crms_product_id: z.number().optional(),
  breakdown: z.strictObject({
    damaged: z.number().optional(),
    lost: z.number().optional(),
    out: z.number().optional(),
    prepped: z.number().optional(),
    quoted: z.number().optional(),
    reserved: z.number().optional(),
    returned: z.number().optional(),
  }),
  dates: z.strictObject({
    start: z.string().optional(),
    start_fs: FirestoreTimestamp,
    end: z.string().nullable().optional(),
    end_fs: FirestoreTimestamp,
    charge_start: z.string().optional(),
    charge_start_fs: FirestoreTimestamp,
    charge_end: z.string().nullable().optional(),
    charge_end_fs: FirestoreTimestamp,
  }),
  destinations: z.strictObject({
    delivery: BookingDestinationRefSchema.nullable().optional(),
    collection: BookingDestinationRefSchema.nullable().optional(),
  }).optional(),
  organization: z.strictObject({
    uid: z.string().nullable(),
    name: z.string(),
    crms_id: z.number().nullable().optional(),
  }),
  stores: z.array(BookingStoreSchema).default([]).optional(),
  query_by_uid_store: z.array(z.string()).default([]).optional(),
  uid_destination_delivery: z.string().optional(),
  uid_destination_collection: z.string().optional(),
  ...TimestampFields,
});
