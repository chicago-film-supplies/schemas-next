/**
 * Password reset token schema — Firestore collection: password-resets
 * Tokens are single-use with a 1-hour expiry.
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

export interface PasswordReset {
  user_id: string;
  email: string;
  expiresAt: FirestoreTimestampType;
  created_at: number;
}

export const PasswordResetSchema: z.ZodType<PasswordReset> = z.strictObject({
  user_id: z.string().min(1),
  email: z.string().email(),
  expiresAt: FirestoreTimestamp,
  created_at: z.number(),
}).meta({
  title: "Password Reset",
  collection: "password-resets",
  displayDefaults: {
    columns: ["email"],
    filters: {},
    sort: { column: null, direction: "desc" },
  },
});
