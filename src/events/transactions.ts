/**
 * Transaction aggregate events.
 *
 * Covers: transactions (inventory), out-of-service-records.
 * Store transfers use the same Transaction type with source.type = "store-transfer".
 */
import type { EventEnvelope } from "./common.ts";
import type { Transaction } from "../transaction.ts";
import type { OutOfServiceRecord } from "../out-of-service-record.ts";

// ── Transaction events ─────────────────────────────────────────────

export type TransactionCreated = EventEnvelope<Transaction> & { event: "transaction.created" };
export type TransactionUpdated = EventEnvelope<Transaction> & { event: "transaction.updated" };

// ── Out-of-service record events ───────────────────────────────────

export type OutOfServiceRecordCreated = EventEnvelope<OutOfServiceRecord> & { event: "out_of_service_record.created" };
export type OutOfServiceRecordUpdated = EventEnvelope<OutOfServiceRecord> & { event: "out_of_service_record.updated" };
