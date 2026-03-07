/**
 * TrackingCategory document schema — Firestore collection: tracking-categories
 */
import { z } from "zod";
import { TimestampFields, UidNameRef, type UidNameRefType } from "./common.ts";

export interface TrackingCategory {
  uid: string;
  name: string;
  count: Record<string, unknown> | number;
  crms_product_group_id?: number;
  crms_service_group_id?: number;
  crms_product_group_name: string;
  products: Record<string, UidNameRefType>;
  xero_tracking_option_id: string | null;
  updated_by: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export const TrackingCategorySchema: z.ZodType<TrackingCategory> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  count: z.union([z.record(z.string(), z.unknown()), z.number()]),
  crms_product_group_id: z.number().optional(),
  crms_service_group_id: z.number().optional(),
  crms_product_group_name: z.string(),
  products: z.record(z.string(), UidNameRef),
  xero_tracking_option_id: z.string().nullable(),
  updated_by: z.string(),
  ...TimestampFields,
}).meta({ title: "Tracking Category", collection: "tracking-categories" });

export const CreateTrackingCategoryInput = z.object({
  name: z.string().min(1).max(100),
  crms_product_group_id: z.number(),
  crms_product_group_name: z.string(),
});
export type CreateTrackingCategoryInputType = z.infer<typeof CreateTrackingCategoryInput>;

export const UpdateTrackingCategoryInput = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100),
});
export type UpdateTrackingCategoryInputType = z.infer<typeof UpdateTrackingCategoryInput>;
