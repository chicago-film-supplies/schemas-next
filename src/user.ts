/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, TimestampFields } from "./common.ts";

/**
 * Full user document schema (Firestore document shape).
 */
export interface User {
  uid: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  customer_uid?: string | null;
  roles?: string[];
  created_at?: unknown;
  updated_at?: unknown;
}

export const UserSchema: z.ZodType<User> = z.strictObject({
  uid: z.string(),
  email: Email,
  password_hash: z.string().min(1),
  email_verified: z.boolean().default(false),
  customer_uid: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
  ...TimestampFields,
}).meta({ title: "User", collection: "users" });
