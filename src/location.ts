/**
 * Location document schema — Firestore collection: locations
 */
import { z } from "zod";
import { TimestampFields } from "./common.ts";

export interface LocationProductCapacity {
  uid: string;
  max: number | null;
  max_default?: number | null;
}

export interface LocationProduct {
  uid: string;
  name: string;
  quantity: number;
  default: boolean;
}

export interface Location {
  uid: string;
  uid_store: string;
  name: string;
  default?: boolean;
  uid_location_type?: string | null;
  product_capacities: LocationProductCapacity[];
  query_by_product_capacities?: string[];
  active: boolean;
  products?: LocationProduct[];
  query_by_products?: string[];
  created_at?: unknown;
  updated_at?: unknown;
}

export const LocationSchema: z.ZodType<Location> = z.strictObject({
  uid: z.string(),
  uid_store: z.string(),
  name: z.string().min(1).max(100),
  default: z.boolean().default(false).optional(),
  uid_location_type: z.string().nullable().optional(),
  product_capacities: z.array(z.strictObject({
    uid: z.string(),
    max: z.number().nullable(),
    max_default: z.number().nullable().optional(),
  })).default([]),
  query_by_product_capacities: z.array(z.string()).default([]).optional(),
  active: z.boolean().default(true),
  products: z.array(z.strictObject({
    uid: z.string(),
    name: z.string(),
    quantity: z.number(),
    default: z.boolean(),
  })).default([]).optional(),
  query_by_products: z.array(z.string()).default([]).optional(),
  ...TimestampFields,
}).meta({ title: "Location", collection: "locations" });
