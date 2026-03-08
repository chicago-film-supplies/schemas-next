/**
 * Availability input schemas for stock summary lookups.
 */
import { z } from "zod";

export const GetAvailabilityInput = z.object({
  productUid: z.string().min(1),
  type: z.enum(["rental", "sale"]),
  start: z.string().optional(),
  end: z.string().optional(),
  date: z.string().optional(),
});
export type GetAvailabilityInputType = z.infer<typeof GetAvailabilityInput>;
