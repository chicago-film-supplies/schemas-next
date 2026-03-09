/**
 * Session document schema — Firestore collection: sessions
 *
 * Copenhagen Book guidelines:
 * - Session IDs: 20 random bytes, hex-encoded (40 chars)
 * - Absolute expiry: 30 days with sliding window extension at 15 days
 * - TTL policy on expiresAt for automatic Firestore cleanup
 */
import { z } from "zod";
import { FirestoreTimestamp, type FirestoreTimestampType } from "./common.ts";

/**
 * Full session document schema (Firestore document shape).
 * Note: expiresAt kept in camelCase for Firestore TTL policy.
 */
export interface Session {
  id: string;
  user_id: string;
  anonymous: boolean;
  expiresAt: FirestoreTimestampType;
  created_at: number;
  user_agent: string;
}

export const SessionSchema: z.ZodType<Session> = z.strictObject({
  id: z.string().length(40),
  user_id: z.string(),
  anonymous: z.boolean(),
  expiresAt: FirestoreTimestamp,
  created_at: z.number(),
  user_agent: z.string(),
}).meta({ title: "Session", collection: "sessions" });
