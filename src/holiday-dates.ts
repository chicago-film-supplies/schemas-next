/**
 * HolidayDates document schema — Firestore collection: holiday-dates
 */
import { z } from "zod";
import { FirestoreTimestamp } from "./common.ts";

export interface HolidayDates {
  uid: string;
  uid_holiday: string;
  date: string;
  date_fs?: unknown;
  name: string;
  type: "fixed" | "variable";
  created_at?: unknown;
  updated_at?: unknown;
}

export const HolidayDatesSchema: z.ZodType<HolidayDates> = z.strictObject({
  uid: z.string(),
  uid_holiday: z.string(),
  date: z.string(),
  date_fs: FirestoreTimestamp,
  name: z.string().min(1).max(100),
  type: z.enum(["fixed", "variable"]),
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
}).meta({ title: "Holiday Dates", collection: "holiday-dates" });
