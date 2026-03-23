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

// ── Propagation log record ──────────────────────────────────────────

const PROPAGATION_MODES = ["embed", "fan-out", "co-write", "derive", "reference"] as const;
const PROPAGATION_STATUSES = ["completed", "skipped", "failed"] as const;

export type PropagationStatusType = typeof PROPAGATION_STATUSES[number];

export const PropagationLogRecordSchema = z.object({
  level: z.enum(LOG_LEVELS),
  msg: z.literal("propagation"),
  ts: z.string(),
  rule_id: z.string(),
  source: z.string(),
  target: z.string(),
  mode: z.enum(PROPAGATION_MODES),
  transaction: z.string().optional(),
  fields_mapped: z.number(),
  source_doc_id: z.string().optional(),
  target_doc_id: z.string().optional(),
  status: z.enum(PROPAGATION_STATUSES),
  duration_ms: z.number().optional(),
  error: z.string().optional(),
  rules_fired: z.array(z.string()).optional(),
  rules_fired_count: z.number().optional(),
  rules_expected: z.number().optional(),
  target_counts: z.record(z.string(), z.number()).optional(),
  target_count: z.number().optional(),
  // Envelope fields from request context
  request_id: z.string().optional(),
  method: z.string().optional(),
  path: z.string().optional(),
  route: z.string().optional(),
  user_id: z.string().meta({ pii: "hash" }).optional(),
  trace_id: z.string().optional(),
  span_id: z.string().optional(),
}).passthrough().meta({ title: "PropagationLogRecord" });

export type PropagationLogRecord = z.infer<typeof PropagationLogRecordSchema>;

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
