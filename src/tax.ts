/**
 * Tax document schema — Firestore collection: taxes
 *
 * Tax definitions used for computing item-level and order-level tax amounts.
 * Tax data is denormalized onto order items at order time.
 */
import { z } from "zod";
import {
  FirestoreTimestamp,
  type FirestoreTimestampType,
  RateTypeEnum,
  type RateType,
} from "./common.ts";

export interface Tax {
  uid: string;
  name: string;
  rate: number;
  type: RateType;
  active: boolean;
  valid_from: FirestoreTimestampType;
  valid_to: FirestoreTimestampType | null;
  created_by: string;
  updated_by: string;
  created_at: FirestoreTimestampType;
  updated_at: FirestoreTimestampType;
}

export const TaxSchema: z.ZodType<Tax> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  rate: z.number(),
  type: RateTypeEnum,
  active: z.boolean().default(true),
  valid_from: FirestoreTimestamp,
  valid_to: FirestoreTimestamp.nullable().default(null),
  created_by: z.string(),
  updated_by: z.string(),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({
  title: "Tax",
  collection: "taxes",
  initial: {
    uid: null,
    name: "",
    rate: 0,
    type: "percent",
    active: true,
    valid_from: null,
    valid_to: null,
    created_by: "",
    updated_by: "",
  },
  displayDefaults: {
    columns: ["name", "rate", "type", "active"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
});

export interface CreateTaxInputType {
  name: string;
  rate: number;
  type: RateType;
  active?: boolean;
  valid_from: FirestoreTimestampType;
  valid_to?: FirestoreTimestampType | null;
}

export const CreateTaxInput: z.ZodType<CreateTaxInputType> = z.object({
  name: z.string().min(1).max(100),
  rate: z.number(),
  type: RateTypeEnum,
  active: z.boolean().optional(),
  valid_from: FirestoreTimestamp,
  valid_to: FirestoreTimestamp.nullable().optional(),
});

export interface UpdateTaxInputType {
  uid: string;
  name?: string;
  rate?: number;
  type?: RateType;
  active?: boolean;
  valid_from?: FirestoreTimestampType;
  valid_to?: FirestoreTimestampType | null;
  version: number;
}

export const UpdateTaxInput: z.ZodType<UpdateTaxInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100).optional(),
  rate: z.number().optional(),
  type: RateTypeEnum.optional(),
  active: z.boolean().optional(),
  valid_from: FirestoreTimestamp.optional(),
  valid_to: FirestoreTimestamp.nullable().optional(),
  version: z.int().min(0),
});
