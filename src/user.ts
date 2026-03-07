/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, TimestampFields } from "./common.ts";

/**
 * Full user document schema (Firestore document shape).
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  email_verified: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export const UserSchema: z.ZodType<User> = z.strictObject({
  id: z.string(),
  email: Email,
  passwordHash: z.string().min(1),
  email_verified: z.boolean().default(false),
  ...TimestampFields,
});
