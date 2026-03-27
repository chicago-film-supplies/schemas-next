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
  crms_id: number | null;
  valid_from: string;
  valid_from_fs: FirestoreTimestampType;
  valid_to: string | null;
  valid_to_fs: FirestoreTimestampType | null;
  version: number;
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
  crms_id: z.int().nullable().default(null),
  valid_from: z.string().default(""),
  valid_from_fs: FirestoreTimestamp,
  valid_to: z.string().nullable().default(null),
  valid_to_fs: FirestoreTimestamp.nullable().default(null),
  version: z.int().min(0).default(0),
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
    crms_id: null,
    valid_from: "",
    valid_from_fs: null,
    valid_to: null,
    valid_to_fs: null,
    version: 0,
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
  valid_from: string;
  valid_to?: string | null;
}

export const CreateTaxInput: z.ZodType<CreateTaxInputType> = z.object({
  name: z.string().min(1).max(100),
  rate: z.number(),
  type: RateTypeEnum,
  active: z.boolean().optional(),
  valid_from: z.string(),
  valid_to: z.string().nullable().optional(),
});

export interface UpdateTaxInputType {
  uid: string;
  name?: string;
  rate?: number;
  type?: RateType;
  active?: boolean;
  valid_from?: string;
  valid_to?: string | null;
  version: number;
}

export const UpdateTaxInput: z.ZodType<UpdateTaxInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100).optional(),
  rate: z.number().optional(),
  type: RateTypeEnum.optional(),
  active: z.boolean().optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().nullable().optional(),
  version: z.int().min(0),
});
