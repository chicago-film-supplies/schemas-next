/**
 * Tag document schema — Firestore collection: tags
 */
import { z } from "zod";
import { type FirestoreFieldValue, type FirestoreTimestampType, TimestampFields, type UidNameRefType, UidNameRef } from "./common.ts";

export interface Tag {
  uid: string;
  name: string;
  count?: Record<string, FirestoreFieldValue> | number;
  products?: UidNameRefType[];
  query_by_products?: string[];
  updated_by?: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const TagSchema: z.ZodType<Tag> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  count: z.union([z.record(z.string(), z.custom<FirestoreFieldValue>()), z.number()]).optional(),
  products: z.array(UidNameRef).default([]).optional(),
  query_by_products: z.array(z.string()).default([]).optional(),
  updated_by: z.string().optional(),
  ...TimestampFields,
}).meta({
  title: "Tag",
  collection: "tags",
  initial: {"uid":null,"name":"","products":[],"query_by_products":[]},
  displayDefaults: {
    columns: ["name", "count"],
    filters: {},
    sort: { column: "count", direction: "desc" },
  },
});

export interface CreateTagInputType {
  uid?: string;
  name: string;
}
export const CreateTagInput: z.ZodType<CreateTagInputType> = z.object({
  uid: z.string().optional(),
  name: z.string().min(1).max(100),
});

export interface UpdateTagInputType {
  uid: string;
  name: string;
}
export const UpdateTagInput: z.ZodType<UpdateTagInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100),
});

export interface DeleteTagInputType {
  uid: string;
}
export const DeleteTagInput: z.ZodType<DeleteTagInputType> = z.object({
  uid: z.string(),
});
