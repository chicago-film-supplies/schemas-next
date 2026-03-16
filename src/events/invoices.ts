/**
 * Invoice aggregate events.
 *
 * Invoices are created/updated via CRMS webhooks, not direct API calls.
 */
import type { EventEnvelope } from "./common.ts";
import type { Invoice } from "../invoice.ts";

export type InvoiceCreated = EventEnvelope<Invoice> & { event: "invoice.created" };
export type InvoiceUpdated = EventEnvelope<Invoice> & { event: "invoice.updated" };
