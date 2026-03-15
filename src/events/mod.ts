/**
 * Domain events — typed envelopes wrapping full Firestore documents.
 *
 * Each event is an EventEnvelope<T> where T is the unchanged document type.
 * Events are grouped by aggregate root.
 */
export type { EventEnvelope } from "./common.ts";

// ── Order aggregate ─────────────────────────────────────────────────

export type {
  OrderCreated,
  OrderUpdated,
  OrderStatusChanged,
  OrderCanceled,
  BookingCreated,
  BookingUpdated,
  BookingStatusChanged,
  StockSummaryRecalculated,
  PublicStockSummaryRecalculated,
  QuoteCreated,
  QuoteRestored,
  QuoteDeleted,
} from "./orders.ts";
