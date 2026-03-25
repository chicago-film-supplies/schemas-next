/**
 * Store document schema — Firestore collection: stores
 */
import { z } from "zod";
import { type FirestoreTimestampType, TimestampFields, UidNameRef, type UidNameRefType } from "./common.ts";

export interface Store {
  uid: string;
  name: string;
  default: boolean;
  default_location: UidNameRefType | null;
  crms_store_id: number;
  active: boolean;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const StoreSchema: z.ZodType<Store> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  default: z.boolean().default(false),
  default_location: UidNameRef.nullable().default(null),
  crms_store_id: z.number(),
  active: z.boolean().default(true),
  ...TimestampFields,
}).meta({
  title: "Store",
  collection: "stores",
  displayDefaults: {
    columns: ["name", "active", "default"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
});

export interface CreateStoreInputType {
  name: string;
  crms_store_id: number;
  default?: boolean;
}
export const CreateStoreInput: z.ZodType<CreateStoreInputType> = z.object({
  name: z.string().min(1).max(100),
  crms_store_id: z.number(),
  default: z.boolean().optional(),
});

export interface UpdateStoreInputType {
  uid: string;
  name?: string;
  crms_store_id?: number;
  default?: boolean;
  active?: boolean;
}
export const UpdateStoreInput: z.ZodType<UpdateStoreInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100).optional(),
  crms_store_id: z.number().optional(),
  default: z.boolean().optional(),
  active: z.boolean().optional(),
});
