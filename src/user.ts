/**
 * User document schema — Firestore collection: users
 */
import { z } from "zod";
import { Email, type FirestoreTimestampType, TimestampFields } from "./common.ts";

/**
 * Full user document schema (Firestore document shape).
 */
export interface User {
  uid: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  uid_customer?: string | null;
  roles?: string[];
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const UserSchema: z.ZodType<User> = z.strictObject({
  uid: z.string(),
  email: Email,
  password_hash: z.string().min(1),
  email_verified: z.boolean().default(false),
  uid_customer: z.string().nullable().optional(),
  roles: z.array(z.string()).optional(),
  ...TimestampFields,
}).meta({ title: "User", collection: "users" });
