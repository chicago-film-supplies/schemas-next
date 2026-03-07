/**
 * Store document schema — Firestore collection: stores
 */
import { z } from "zod";
import { TimestampFields } from "./common.ts";

export interface Store {
  uid: string;
  name: string;
  default: boolean;
  crms_store_id: number;
  active: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export const StoreSchema: z.ZodType<Store> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  default: z.boolean().default(false),
  crms_store_id: z.number(),
  active: z.boolean().default(true),
  ...TimestampFields,
});
