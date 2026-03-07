/**
 * Email verification token schema — Firestore collection: email-verifications
 * Tokens are single-use with a 24-hour expiry.
 */
import { z } from "zod";

export interface EmailVerification {
  user_id: string;
  email: string;
  expiresAt: unknown;
  created_at: number;
}

export const EmailVerificationSchema: z.ZodType<EmailVerification> = z.strictObject({
  user_id: z.string().min(1),
  email: z.string().email(),
  expiresAt: z.any(),
  created_at: z.number(),
}).meta({ title: "Email Verification", collection: "email-verifications" });
