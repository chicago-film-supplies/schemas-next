/**
 * Order schemas — Firestore collection: orders
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  FirestoreTimestamp,
  InclusionTypeEnum,
  type InclusionTypeType,
  ItemTaxProfileEnum,
  type ItemTaxProfileType,
  Phone,
  PriceFormulaEnum,
  type PriceFormulaType,
  StockMethodEnum,
  type StockMethodType,
  TaxProfileEnum,
  type TaxProfileType,
  TimestampFields,
} from "./common.ts";

const ORDER_STATUSES = [
  "draft", "quoted", "reserved", "active", "complete", "canceled",
] as const;
type OrderStatusType = typeof ORDER_STATUSES[number];
const OrderStatus: z.ZodType<OrderStatusType> = z.enum(ORDER_STATUSES);

const ITEM_TYPES = ["destination", "group", "rental", "sale", "service"] as const;
type ItemTypeType = typeof ITEM_TYPES[number];

/** Line item types in the full document (superset of input types). */
const DOC_LINE_ITEM_TYPES = [
  "custom", "rental", "replacement", "sale", "service", "surcharge",
] as const;
type DocLineItemTypeType = typeof DOC_LINE_ITEM_TYPES[number];

const INCLUSION_TYPES_NULLABLE = ["default", "mandatory", "optional"] as const;

/**
 * Order dates — all six date boundaries as ISO strings.
 */
export interface OrderDatesType {
  delivery_start: string;
  delivery_end: string;
  collection_start: string;
  collection_end: string;
  charge_start: string;
  charge_end: string;
}

export const OrderDates: z.ZodType<OrderDatesType> = z.strictObject({
  delivery_start: z.string(),
  delivery_end: z.string(),
  collection_start: z.string(),
  collection_end: z.string(),
  charge_start: z.string(),
  charge_end: z.string(),
});

/**
 * Contact reference embedded in a destination endpoint.
 */
export interface DestinationContactType {
  uid?: string;
  name?: string;
  phones?: string[];
}

export const DestinationContact: z.ZodType<DestinationContactType> = z.strictObject({
  uid: z.string().optional(),
  name: z.string().optional(),
  phones: z.array(Phone).optional(),
});

/**
 * Contact reference in a destination endpoint (document schema — uid & name required).
 */
export interface DocDestinationContactType {
  uid: string;
  name: string;
  phones?: string[];
}

export const DocDestinationContact: z.ZodType<DocDestinationContactType> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(100),
  phones: z.array(Phone).default([]),
});

/**
 * A single destination endpoint (delivery or collection).
 */
export interface DestinationEndpointType {
  uid?: string | null;
  address?: AddressType | null;
  instructions?: string | null;
  contact?: DestinationContactType | null;
}

export const DestinationEndpoint: z.ZodType<DestinationEndpointType> = z.strictObject({
  uid: z.string().nullable().optional(),
  address: Address.optional(),
  instructions: z.string().nullable().optional(),
  contact: DestinationContact.nullable().optional(),
}).meta({
  initial: {"uid":null,"address":null,"instructions":null,"contact":null},
});

/**
 * Destination endpoint in the full document (uid is nullable, contact uses doc version).
 */
export interface DocDestinationEndpointType {
  uid: string | null;
  address: AddressType | null;
  instructions: string | null;
  contact: DocDestinationContactType | null;
}

export const DocDestinationEndpoint: z.ZodType<DocDestinationEndpointType> = z.strictObject({
  uid: z.string().nullable(),
  address: Address,
  instructions: z.string().nullable(),
  contact: DocDestinationContact.nullable(),
});

/**
 * A destination pair — delivery and collection endpoints.
 */
export interface DestinationType {
  delivery: DestinationEndpointType;
  collection: DestinationEndpointType;
}

export const Destination: z.ZodType<DestinationType> = z.strictObject({
  delivery: DestinationEndpoint,
  collection: DestinationEndpoint,
});

/**
 * Document-level destination pair.
 */
export interface DocDestinationType {
  delivery: DocDestinationEndpointType;
  collection: DocDestinationEndpointType;
}

export const DocDestination: z.ZodType<DocDestinationType> = z.strictObject({
  delivery: DocDestinationEndpoint,
  collection: DocDestinationEndpoint,
});

/**
 * Price breakdown for an order item.
 */
export interface ItemPriceType {
  base?: number;
  chargeable_days?: number | null;
  discount_percent?: number;
  formula?: PriceFormulaType;
  tax_profile?: ItemTaxProfileType;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total?: number;
}

export const ItemPrice: z.ZodType<ItemPriceType> = z.strictObject({
  base: z.number().optional(),
  chargeable_days: z.int().nullable().optional(),
  discount_percent: z.number().optional(),
  formula: PriceFormulaEnum.optional(),
  tax_profile: ItemTaxProfileEnum.optional(),
  subtotal: z.number().optional(),
  tax_amount: z.number().optional(),
  discount_amount: z.number().optional(),
  total: z.number().optional(),
});

/**
 * An individual order item (rental, sale, service, group header, or destination).
 */
export interface OrderItemType {
  uid: string;
  type?: ItemTypeType;
  name?: string;
  description?: string;
  quantity?: number;
  price?: ItemPriceType;
  stock_method?: StockMethodType;
  uid_component_of?: string | null;
  inclusion_type?: InclusionTypeType | null;
  zero_priced?: boolean | null;
  uid_delivery?: string;
  uid_collection?: string;
  order_number?: number;
  uid_order?: string;
}

export const OrderItem: z.ZodType<OrderItemType> = z.strictObject({
  uid: z.string(),
  type: z.enum(ITEM_TYPES).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.int().optional(),
  price: ItemPrice.optional(),
  stock_method: StockMethodEnum.optional(),
  uid_component_of: z.string().nullable().optional(),
  inclusion_type: InclusionTypeEnum.nullable().optional(),
  zero_priced: z.boolean().nullable().optional(),
  uid_delivery: z.string().optional(),
  uid_collection: z.string().optional(),
  order_number: z.number().optional(),
  uid_order: z.string().optional(),
}).meta({
  initial: {"description":"","name":"","order_number":0,"price":{"base":0,"chargeable_days":null,"discount_amount":0,"discount_percent":0,"formula":"five_day_week","subtotal":0,"tax_amount":0,"tax_profile":"tax_none","total":0},"quantity":0,"type":"rental","stock_method":"bulk","uid":"","uid_order":"","uid_component_of":null,"inclusion_type":null,"zero_priced":null},
});

/**
 * Input schema for POST /orders — what the endpoint accepts.
 */
export interface CreateOrderInputType {
  uid: string;
  organization: { uid: string };
  status: OrderStatusType;
  dates: OrderDatesType;
  tax_profile: TaxProfileType;
  destinations: DestinationType[];
  items?: OrderItemType[];
  subject?: string;
  reference?: string | null;
  notes?: string;
  customer_collecting?: boolean;
  customer_returning?: boolean;
}

export const CreateOrderInput: z.ZodType<CreateOrderInputType> = z.object({
  uid: z.string(),
  organization: z.object({ uid: z.string() }),
  status: OrderStatus,
  dates: OrderDates,
  tax_profile: TaxProfileEnum,
  destinations: z.array(Destination).min(1, "At least one destination is required"),
  items: z.array(OrderItem).optional(),
  subject: z.string().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().optional(),
  customer_collecting: z.boolean().optional(),
  customer_returning: z.boolean().optional(),
});

/**
 * Input schema for PUT /orders/:uid — partial update.
 */
export interface UpdateOrderInputType {
  uid?: string;
  organization?: { uid: string };
  status?: OrderStatusType;
  dates?: OrderDatesType;
  tax_profile?: TaxProfileType;
  destinations?: DestinationType[];
  items?: OrderItemType[];
  subject?: string;
  reference?: string | null;
  notes?: string;
  customer_collecting?: boolean;
  customer_returning?: boolean;
}

export const UpdateOrderInput: z.ZodType<UpdateOrderInputType> = z.object({
  uid: z.string().optional(),
  organization: z.object({ uid: z.string() }).optional(),
  status: OrderStatus.optional(),
  dates: OrderDates.optional(),
  tax_profile: TaxProfileEnum.optional(),
  destinations: z.array(Destination).min(1, "At least one destination is required").optional(),
  items: z.array(OrderItem).optional(),
  subject: z.string().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().optional(),
  customer_collecting: z.boolean().optional(),
  customer_returning: z.boolean().optional(),
});

// ── Full document schemas ────────────────────────────────────────

/**
 * Line item price in the full order document (all fields required after server compute).
 */
const OrderDocItemPrice = z.strictObject({
  base: z.number().default(0),
  chargeable_days: z.number().int().nullable().default(null),
  discount_amount: z.number().default(0),
  discount_percent: z.number().default(0),
  formula: PriceFormulaEnum.default("five_day_week"),
  subtotal: z.number().default(0),
  tax_amount: z.number().default(0),
  tax_profile: ItemTaxProfileEnum.default("tax_none"),
  total: z.number().default(0),
});

/** Line item in the full order document. */
const OrderDocLineItem = z.strictObject({
  uid: z.string(),
  type: z.enum(DOC_LINE_ITEM_TYPES),
  name: z.string().min(1).max(100),
  description: z.string().default(""),
  quantity: z.number().int().min(0).default(0),
  price: OrderDocItemPrice.optional(),
  stock_method: StockMethodEnum.optional(),
  order_number: z.number().optional(),
  uid_order: z.string().optional(),
  uid_component_of: z.string().nullable().optional(),
  inclusion_type: z.enum(INCLUSION_TYPES_NULLABLE).nullable().optional(),
  zero_priced: z.boolean().nullable().optional(),
  crms_id: z.number().nullable().optional(),
  uid_delivery: z.string().nullable().optional(),
  uid_collection: z.string().nullable().optional(),
});

export interface OrderDocDestinationItemType {
  uid: string;
  type: "destination";
  name: string;
  uid_delivery: string | null;
  uid_collection: string | null;
  description: string;
}

/** Destination divider in items array. */
export const OrderDocDestinationItem: z.ZodType<OrderDocDestinationItemType> = z.strictObject({
  uid: z.uuid(),
  type: z.literal("destination"),
  name: z.string().max(200).default(""),
  uid_delivery: z.string().nullable().default(null),
  uid_collection: z.string().nullable().default(null),
  description: z.string().default(""),
}).meta({
  initial: {"name":"","uid_delivery":null,"uid_collection":null,"description":""},
});

/** Group divider in items array. */
const OrderDocGroupItem = z.strictObject({
  uid: z.uuid(),
  type: z.literal("group"),
  name: z.string().min(1).max(100),
  description: z.string().default(""),
});

/** Union of all item types in the document. */
const OrderDocItem = z.union([
  OrderDocLineItem,
  OrderDocDestinationItem,
  OrderDocGroupItem,
]);

/** Order dates with Firestore timestamp companions. */
const OrderDocDates = z.strictObject({
  delivery_start: z.string().default(""),
  delivery_start_fs: FirestoreTimestamp,
  delivery_end: z.string().default(""),
  delivery_end_fs: FirestoreTimestamp,
  collection_start: z.string().default(""),
  collection_start_fs: FirestoreTimestamp,
  collection_end: z.string().default(""),
  collection_end_fs: FirestoreTimestamp,
  charge_start: z.string().default(""),
  charge_start_fs: FirestoreTimestamp,
  charge_end: z.string().default(""),
  charge_end_fs: FirestoreTimestamp,
});

/** Denormalized organization snapshot on the order document. */
const OrderDocOrganization = z.strictObject({
  uid: z.string().nullable(),
  name: z.string().min(1).max(100),
  crms_id: z.number().nullable().optional(),
  xero_id: z.string().nullable().optional(),
  billing_address: Address.optional(),
});

/** Order totals. */
const OrderDocTotals = z.strictObject({
  discount_amount: z.number().default(0),
  subtotal: z.number().default(0),
  taxes: z.record(z.string(), z.number()).default({}),
  total: z.number().default(0),
});

/**
 * Full order document schema (Firestore document shape).
 * Used for validation before writing to Firestore.
 */
export interface Order {
  uid: string;
  number: number;
  status: OrderStatusType;
  organization: {
    uid: string | null;
    name: string;
    crms_id?: number | null;
    xero_id?: string | null;
    billing_address?: AddressType | null;
  };
  dates: Record<string, unknown>;
  destinations: DocDestinationType[];
  items: Record<string, unknown>[];
  tax_profile: TaxProfileType;
  totals: { discount_amount: number; subtotal: number; taxes: Record<string, number>; total: number };
  query_by_items: string[];
  query_by_contacts: string[];
  crms_id?: number | null;
  crms_status?: string;
  subject?: string;
  reference?: string | null;
  notes?: string;
  customer_collecting?: boolean;
  customer_returning?: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export const OrderSchema: z.ZodType<Order> = z.strictObject({
  uid: z.string(),
  number: z.int(),
  status: OrderStatus,
  organization: OrderDocOrganization,
  dates: OrderDocDates,
  destinations: z.array(DocDestination).min(1),
  items: z.array(OrderDocItem).default([]),
  tax_profile: TaxProfileEnum.default("tax_applied"),
  totals: OrderDocTotals,
  query_by_items: z.array(z.string()).default([]),
  query_by_contacts: z.array(z.string()).default([]),
  crms_id: z.number().nullable().optional(),
  crms_status: z.string().optional(),
  subject: z.string().default(""),
  reference: z.string().max(255).nullable().default(null),
  notes: z.string().default(""),
  customer_collecting: z.boolean().default(false),
  customer_returning: z.boolean().default(false),
  ...TimestampFields,
}).meta({
  title: "Order",
  collection: "orders",
  initial: {"crms_id":null,"customer_collecting":false,"customer_returning":false,"dates":{"delivery_start":"","delivery_end":"","collection_start":"","collection_end":"","charge_start":"","charge_end":""},"destinations":[{"delivery":{"uid":null,"address":null,"instructions":null,"contact":null},"collection":{"uid":null,"address":null,"instructions":null,"contact":null}}],"items":[],"notes":"","organization":{"uid":null,"name":"","billing_address":null},"reference":null,"query_by_items":[],"query_by_contacts":[],"status":"draft","subject":"","tax_profile":"tax_applied","totals":{"discount_amount":0,"subtotal":0,"taxes":{},"total":0},"uid":null},
}) as z.ZodType<Order>;
