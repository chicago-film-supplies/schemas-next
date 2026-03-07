/**
 * Tag document schema — Firestore collection: tags
 */
import { z } from "zod";
import { TimestampFields, type UidNameRefType, UidNameRef } from "./common.ts";

export interface Tag {
  uid: string;
  name: string;
  count?: Record<string, unknown> | number;
  products?: UidNameRefType[];
  query_by_products?: string[];
  updated_by?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export const TagSchema: z.ZodType<Tag> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  count: z.union([z.record(z.string(), z.unknown()), z.number()]).optional(),
  products: z.array(UidNameRef).default([]).optional(),
  query_by_products: z.array(z.string()).default([]).optional(),
  updated_by: z.string().optional(),
  ...TimestampFields,
});
