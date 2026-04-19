/**
 * Order event schemas — Firestore collection: order-events
 *
 * Lightweight schedule projection of orders for dashboard calendar/card views.
 * One event per destination per position (start/end), written atomically in
 * the order create/update transaction.
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  FirestoreTimestamp,
  type FirestoreTimestampType,
} from "./common.ts";
import {
  DocDestinationContact,
  DocDestinationEndpoint,
  type DocDestinationContactType,
  type DocDestinationEndpointType,
} from "./order.ts";

// ── Enums ───────────────────────────────────────────────────────

const ORDER_EVENT_STATUSES = [
  "draft", "quoted", "reserved", "active", "complete", "canceled",
] as const;
type OrderEventStatusType = typeof ORDER_EVENT_STATUSES[number];
const OrderEventStatus: z.ZodType<OrderEventStatusType> = z.enum(ORDER_EVENT_STATUSES);

const EVENT_TYPES = [
  "deliver", "in_store_pickup", "pick_up", "in_store_return",
] as const;
export type EventTypeType = typeof EVENT_TYPES[number];
const EventType: z.ZodType<EventTypeType> = z.enum(EVENT_TYPES);

const EVENT_POSITIONS = ["start", "end"] as const;
export type EventPositionType = typeof EVENT_POSITIONS[number];
const EventPosition: z.ZodType<EventPositionType> = z.enum(EVENT_POSITIONS);

// ── Firestore document type ─────────────────────────────────────

/** Order event document in Firestore. */
export interface OrderEvent {
  uid: string;
  uid_order: string;
  order_number: number;
  position: EventPositionType;
  date: string;
  date_fs: FirestoreTimestampType;
  event_type: EventTypeType;
  status: OrderEventStatusType;
  organization: {
    uid: string | null;
    name: string;
  };
  subject: string;
  destination: DocDestinationEndpointType;
  item_uids: string[];
  item_count: number;
  expires_at: FirestoreTimestampType;
  defaultThreadId?: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for the order event Firestore document. */
export const OrderEventSchema: z.ZodType<OrderEvent> = z.strictObject({
  uid: z.string(),
  uid_order: z.string(),
  order_number: z.int(),
  position: EventPosition,
  date: z.string(),
  date_fs: FirestoreTimestamp,
  event_type: EventType,
  status: OrderEventStatus,
  organization: z.strictObject({
    uid: z.string().nullable(),
    name: z.string(),
  }),
  subject: z.string().default(""),
  destination: DocDestinationEndpoint,
  item_uids: z.array(z.string()).default([]),
  item_count: z.int().min(0),
  expires_at: FirestoreTimestamp,
  defaultThreadId: z.string().optional(),
  created_at: FirestoreTimestamp.optional(),
  updated_at: FirestoreTimestamp.optional(),
}).meta({
  title: "OrderEvent",
  collection: "order-events",
  displayDefaults: {
    columns: ["order_number", "event_type", "status", "date", "organization.name"],
    filters: { status: [], event_type: [] },
    sort: { column: "date", direction: "asc" },
  },
});

// ── Query input (GET /order-events) ─────────────────────────────

/** Input type for querying order events by date range. */
export interface OrderEventsQueryInputType {
  start: string;
  end: string;
  status?: OrderEventStatusType;
}

/** Zod schema for order events query input. */
export const OrderEventsQueryInput: z.ZodType<OrderEventsQueryInputType> = z.object({
  start: z.string().min(1),
  end: z.string().min(1),
  status: OrderEventStatus.optional(),
});

// ── Response type (JSON-serializable) ───────────────────────────

/** Destination endpoint in the API response (no Firestore custom types). */
export interface OrderEventDestinationResponseType {
  uid: string | null;
  address: AddressType | null;
  instructions: string | null;
  contact: DocDestinationContactType | null;
}

/** Order event as returned by the API (no Firestore types). */
export interface OrderEventResponse {
  uid: string;
  uid_order: string;
  order_number: number;
  position: EventPositionType;
  date: string;
  event_type: EventTypeType;
  status: OrderEventStatusType;
  organization: {
    uid: string | null;
    name: string;
  };
  subject: string;
  destination: OrderEventDestinationResponseType;
  item_uids: string[];
  item_count: number;
  created_at: string | null;
  updated_at: string | null;
}

/** Zod schema for the order event API response. */
export const OrderEventResponseSchema: z.ZodType<OrderEventResponse> = z.object({
  uid: z.string(),
  uid_order: z.string(),
  order_number: z.int(),
  position: EventPosition,
  date: z.string(),
  event_type: EventType,
  status: OrderEventStatus,
  organization: z.object({
    uid: z.string().nullable(),
    name: z.string(),
  }),
  subject: z.string(),
  destination: z.object({
    uid: z.string().nullable(),
    address: Address.nullable(),
    instructions: z.string().nullable(),
    contact: DocDestinationContact.nullable(),
  }),
  item_uids: z.array(z.string()),
  item_count: z.int().min(0),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});
