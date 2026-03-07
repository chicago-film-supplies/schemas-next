/**
 * Session document schema — Firestore collection: sessions
 *
 * Copenhagen Book guidelines:
 * - Session IDs: 20 random bytes, hex-encoded (40 chars)
 * - Absolute expiry: 30 days with sliding window extension at 15 days
 * - TTL policy on expiresAt for automatic Firestore cleanup
 */
import { z } from "zod";

/**
 * Full session document schema (Firestore document shape).
 */
export interface Session {
  id: string;
  userId: string;
  anonymous: boolean;
  expiresAt: unknown;
  createdAt: number;
  userAgent: string;
}

export const SessionSchema: z.ZodType<Session> = z.strictObject({
  id: z.string().length(40),
  userId: z.string(),
  anonymous: z.boolean(),
  expiresAt: z.any(),
  createdAt: z.number(),
  userAgent: z.string(),
});
