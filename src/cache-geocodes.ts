/**
 * CacheGeocodes document schema — Firestore collection: cache-geocodes
 */
import { z } from "zod";
import { Coordinates, type CoordinatesType, FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

export interface CacheGeocodesAddress {
  street?: string;
  city?: string;
  region?: string;
  postcode?: string;
  country_name?: string;
  full?: string;
  name?: string;
}

export interface CacheGeocodes {
  query: string;
  coordinates: CoordinatesType | null;
  mapbox_id: string;
  address: CacheGeocodesAddress;
  created_at?: FirestoreTimestampType;
  expiresAt?: FirestoreTimestampType;
}

export const CacheGeocodesSchema: z.ZodType<CacheGeocodes> = z.strictObject({
  query: z.string(),
  coordinates: Coordinates,
  mapbox_id: z.string(),
  address: z.strictObject({
    street: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    postcode: z.string().optional(),
    country_name: z.string().optional(),
    full: z.string().optional(),
    name: z.string().optional(),
  }),
  created_at: FirestoreTimestamp,
  expiresAt: FirestoreTimestamp,
}).meta({
  title: "Cache Geocodes",
  collection: "cache-geocodes",
  displayDefaults: {
    columns: ["address.full", "address.city", "address.region"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
