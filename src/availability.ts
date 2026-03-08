/**
 * Availability input schemas for stock summary lookups.
 */
import { z } from "zod";

export interface GetAvailabilityInputType {
  productUid: string;
  type: "rental" | "sale";
  start?: string;
  end?: string;
  date?: string;
}

export const GetAvailabilityInput: z.ZodType<GetAvailabilityInputType> = z.object({
  productUid: z.string().min(1),
  type: z.enum(["rental", "sale"]),
  start: z.string().optional(),
  end: z.string().optional(),
  date: z.string().optional(),
});
