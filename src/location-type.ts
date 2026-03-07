/**
 * LocationType document schema — Firestore collection: location-types
 */
import { z } from "zod";
import { FirestoreTimestamp } from "./common.ts";

export interface LocationTypeProductCapacity {
  uid: string;
  max: number | null;
}

export interface LocationTypeDimensions {
  width?: number;
  depth?: number;
  height?: number;
  weight_capacity?: number;
}

export interface LocationType {
  uid: string;
  name: string;
  product_capacities: LocationTypeProductCapacity[];
  query_by_product_capacities?: string[];
  dimensions?: LocationTypeDimensions | null;
  active: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export const LocationTypeSchema: z.ZodType<LocationType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  product_capacities: z.array(z.strictObject({
    uid: z.string(),
    max: z.number().nullable(),
  })).default([]),
  query_by_product_capacities: z.array(z.string()).default([]).optional(),
  dimensions: z.strictObject({
    width: z.number().optional(),
    depth: z.number().optional(),
    height: z.number().optional(),
    weight_capacity: z.number().optional(),
  }).nullable().optional(),
  active: z.boolean().default(true),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({ title: "Location Type", collection: "location-types" });
