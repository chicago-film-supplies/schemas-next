/**
 * Shared schema fragments used across multiple collections.
 */
import { z } from "zod";

/**
 * Firestore server timestamp — passthrough since it's a Firestore
 * FieldValue at write time and a Firestore Timestamp at read time.
 */
export const FirestoreTimestamp: z.ZodType<unknown> = z.any().optional();

/**
 * Standard timestamp fields present on most documents.
 */
export const TimestampFields: {
  created_at: z.ZodType<unknown>;
  updated_at: z.ZodType<unknown>;
} = {
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
};

/**
 * Email string with format and length constraints.
 */
export const Email: z.ZodType<string> = z.email("Must be a valid email address").min(5).max(254);

/**
 * Phone string with length constraints.
 */
export const Phone: z.ZodType<string> = z
  .string()
  .min(10, "Phone number must be at least 10 characters")
  .max(20, "Phone number must not exceed 20 characters");

/**
 * Coordinates object (latitude/longitude).
 */
export interface CoordinatesType {
  latitude: number;
  longitude: number;
}

export const Coordinates: z.ZodType<CoordinatesType | null> = z.strictObject({
  latitude: z.number(),
  longitude: z.number(),
}).nullable();

/**
 * Address object — shared between organizations and order destinations.
 */
export interface AddressType {
  city: string;
  country_name: string;
  full: string;
  name: string;
  postcode: string;
  region: string;
  street: string;
  street2?: string;
  mapbox_id?: string;
  address_coordinates?: CoordinatesType | null;
  user_coordinates?: CoordinatesType | null;
}

export const Address: z.ZodType<AddressType | null> = z.strictObject({
  city: z.string().default(""),
  country_name: z.string().default(""),
  full: z.string().default(""),
  name: z.string().max(100).default(""),
  postcode: z.string().default(""),
  region: z.string().default(""),
  street: z.string().default(""),
  street2: z.string().default("").optional(),
  mapbox_id: z.string().default("").optional(),
  address_coordinates: Coordinates.optional(),
  user_coordinates: Coordinates.optional(),
}).nullable();
