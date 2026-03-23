/**
 * Log record schema — defines the structured log envelope.
 *
 * Every structured log emitted by the API matches this schema.
 * `.passthrough()` allows per-call data fields beyond the envelope.
 */
import { z } from "zod";

const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;
export type LogLevelType = typeof LOG_LEVELS[number];

export interface LogRecord {
  level: LogLevelType;
  msg: string;
  ts: string;
  request_id?: string;
  method?: string;
  path?: string;
  route?: string;
  user_id?: string;
  trace_id?: string;
  span_id?: string;
  duration_ms?: number;
  [key: string]: unknown;
}

export const LogRecordSchema: z.ZodType<LogRecord> = z.object({
  level: z.enum(LOG_LEVELS),
  msg: z.string(),
  ts: z.string(),
  request_id: z.string().optional(),
  method: z.string().optional(),
  path: z.string().optional(),
  route: z.string().optional(),
  user_id: z.string().meta({ pii: "hash" }).optional(),
  trace_id: z.string().optional(),
  span_id: z.string().optional(),
  duration_ms: z.number().optional(),
}).passthrough().meta({ title: "LogRecord" });

// ── PII meta type ───────────────────────────────────────────────────

/**
 * PII classification for schema fields.
 *
 * Optional `.meta({ pii: "..." })` on any zod field:
 * - "none"   — safe field, no processing
 * - "mask"   — partial reveal (emails: j***@example.com, strings: last 4 chars)
 * - "hash"   — deterministic HMAC-SHA256
 * - "redact" — full removal → "[REDACTED]"
 */
export type PiiClassification = "none" | "mask" | "hash" | "redact";
