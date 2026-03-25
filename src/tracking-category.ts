/**
 * TrackingCategory document schema — Firestore collection: tracking-categories
 */
import { z } from "zod";
import { type FirestoreFieldValue, type FirestoreTimestampType, TimestampFields, UidNameRef, type UidNameRefType } from "./common.ts";

export interface TrackingCategory {
  uid: string;
  name: string;
  count?: Record<string, FirestoreFieldValue> | number;
  crms_product_group_id?: number;
  crms_service_group_id?: number;
  crms_product_group_name: string;
  products: Record<string, UidNameRefType>;
  xero_tracking_option_id: string | null;
  updated_by: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const TrackingCategorySchema: z.ZodType<TrackingCategory> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  count: z.union([z.record(z.string(), z.custom<FirestoreFieldValue>()), z.number()]).optional(),
  crms_product_group_id: z.number().optional(),
  crms_service_group_id: z.number().optional(),
  crms_product_group_name: z.string(),
  products: z.record(z.string(), UidNameRef),
  xero_tracking_option_id: z.string().nullable(),
  updated_by: z.string(),
  ...TimestampFields,
}).meta({
  title: "Tracking Category",
  collection: "tracking-categories",
  displayDefaults: {
    columns: ["name", "count"],
    filters: {},
    sort: { column: "name", direction: "asc" },
  },
});

export interface CreateTrackingCategoryInputType {
  name: string;
  crms_product_group_id: number;
  crms_product_group_name: string;
}
export const CreateTrackingCategoryInput: z.ZodType<CreateTrackingCategoryInputType> = z.object({
  name: z.string().min(1).max(100),
  crms_product_group_id: z.number(),
  crms_product_group_name: z.string(),
});

export interface UpdateTrackingCategoryInputType {
  uid: string;
  name: string;
}
export const UpdateTrackingCategoryInput: z.ZodType<UpdateTrackingCategoryInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100),
});
