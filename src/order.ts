/**
 * Order schemas — Firestore collection: orders
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  FirestoreTimestamp,
  type FirestoreTimestampType,
  InclusionTypeEnum,
  type InclusionTypeType,
  Phone,
  PriceFormulaEnum,
  type PriceFormulaType,
  RateTypeEnum,
  type RateType,
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

const ITEM_TYPES = ["destination", "group", "rental", "replacement", "sale", "service", "surcharge", "transaction_fee"] as const;
type ItemTypeType = typeof ITEM_TYPES[number];

/** Line item types in the full document (superset of input types). */
const DOC_LINE_ITEM_TYPES = [
  "rental", "replacement", "sale", "service", "surcharge", "transaction_fee",
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

export const OrderDates: z.ZodType<OrderDatesType> = z.object({
  delivery_start: z.string(),
  delivery_end: z.string(),
  collection_start: z.string(),
  collection_end: z.string(),
  charge_start: z.string(),
  charge_end: z.string(),
});

/**
 * Contact reference embedded in a destination endpoint.
 * When present (not null), uid and name are required.
 */
export interface DestinationContactType {
  uid: string;
  name: string;
  phones?: string[];
}

export const DestinationContact: z.ZodType<DestinationContactType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(100).meta({ pii: "mask" }),
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
  name: z.string().min(1).max(100).meta({ pii: "mask" }),
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

export const DestinationEndpoint: z.ZodType<DestinationEndpointType> = z.object({
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

export const Destination: z.ZodType<DestinationType> = z.object({
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

// ── Shared modifier types ─────────────────────────────────────────

/**
 * A rate-based charge applied to an item or order (tax or transaction fee).
 * uid references a tax doc (for taxes) or a product doc (for transaction fees).
 */
export interface PriceModifierType {
  uid: string;
  name: string;
  rate: number;
  type: RateType;
  amount: number;
}

export const PriceModifier: z.ZodType<PriceModifierType> = z.strictObject({
  uid: z.string(),
  name: z.string(),
  rate: z.number(),
  type: RateTypeEnum,
  amount: z.number(),
});

/**
 * Denormalized tax snapshot without computed amount — used on product catalog entries.
 * PriceModifier extends this shape with `amount` for order-time computation.
 */
export interface TaxRefType {
  uid: string;
  name: string;
  rate: number;
  type: RateType;
}

export const TaxRef: z.ZodType<TaxRefType> = z.strictObject({
  uid: z.string(),
  name: z.string(),
  rate: z.number(),
  type: RateTypeEnum,
});

/**
 * Discount applied to an item price. Nullable — null means no discount.
 * rate is per-unit for flat discounts (rate × quantity × days_factor = amount).
 */
export interface DiscountType {
  rate: number;
  type: RateType;
  amount: number;
}

export const Discount: z.ZodType<DiscountType> = z.strictObject({
  rate: z.number(),
  type: RateTypeEnum,
  amount: z.number(),
});

// ── Input schemas ─────────────────────────────────────────────────

/**
 * Price breakdown for an order item (input — client sends partial data, server computes the rest).
 */
export interface ItemPriceType {
  base?: number;
  chargeable_days?: number | null;
  formula?: PriceFormulaType;
  subtotal?: number;
  discount?: { rate: number; type: RateType } | null;
  taxes?: Array<{ uid: string }>;
  total?: number;
}

export const ItemPrice: z.ZodType<ItemPriceType> = z.object({
  base: z.number().optional(),
  chargeable_days: z.int().nullable().optional(),
  formula: PriceFormulaEnum.optional(),
  subtotal: z.number().optional(),
  discount: z.object({
    rate: z.number(),
    type: RateTypeEnum,
  }).nullable().optional(),
  taxes: z.array(z.object({ uid: z.string() })).optional(),
  total: z.number().optional(),
});

/**
 * An individual order item (rental, replacement, sale, service, surcharge, group header, or destination).
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

export const OrderItem: z.ZodType<OrderItemType> = z.object({
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
  initial: {"description":"","name":"","order_number":0,"price":{"base":0,"chargeable_days":null,"formula":"five_day_week","subtotal":0,"discount":null,"taxes":[],"total":0},"quantity":0,"type":"rental","stock_method":"bulk","uid":"","uid_order":"","uid_component_of":null,"inclusion_type":null,"zero_priced":null},
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
  notes: z.string().meta({ pii: "mask" }).optional(),
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
  version: number;
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
  notes: z.string().meta({ pii: "mask" }).optional(),
  customer_collecting: z.boolean().optional(),
  customer_returning: z.boolean().optional(),
  version: z.int().min(0),
});

// ── Full document schemas ────────────────────────────────────────

/**
 * Line item price in the full order document (all fields required after server compute).
 * subtotal = pre-discount (base × qty × days_factor).
 * subtotal_discounted = post-discount.
 * total = subtotal_discounted + sum(taxes[].amount).
 */
export interface OrderDocItemPriceType {
  base: number;
  chargeable_days: number | null;
  formula: PriceFormulaType;
  subtotal: number;
  subtotal_discounted: number;
  discount: DiscountType | null;
  taxes: PriceModifierType[];
  total: number;
}

const OrderDocItemPrice: z.ZodType<OrderDocItemPriceType> = z.strictObject({
  base: z.number().default(0),
  chargeable_days: z.number().int().nullable().default(null),
  formula: PriceFormulaEnum.default("five_day_week"),
  subtotal: z.number().default(0),
  subtotal_discounted: z.number().default(0),
  discount: Discount.nullable().default(null),
  taxes: z.array(PriceModifier).default([]),
  total: z.number().default(0),
});

/** Line item in the full order document. */
export interface OrderDocLineItemType {
  uid: string;
  type: DocLineItemTypeType;
  name: string;
  description: string;
  quantity: number;
  price?: OrderDocItemPriceType;
  stock_method?: StockMethodType;
  order_number?: number;
  uid_order?: string;
  uid_component_of?: string | null;
  inclusion_type?: "default" | "mandatory" | "optional" | null;
  zero_priced?: boolean | null;
  crms_id?: number | null;
  uid_delivery?: string | null;
  uid_collection?: string | null;
}

const OrderDocLineItem: z.ZodType<OrderDocLineItemType> = z.strictObject({
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
export interface OrderDocGroupItemType {
  uid: string;
  type: "group";
  name: string;
  description: string;
}

const OrderDocGroupItem: z.ZodType<OrderDocGroupItemType> = z.strictObject({
  uid: z.uuid(),
  type: z.literal("group"),
  name: z.string().min(1).max(100),
  description: z.string().default(""),
});

/** Transaction fee line item in the full order document. */
export interface OrderDocTransactionFeeItemType {
  uid: string;
  type: "transaction_fee";
  name: string;
  description: string;
  quantity: number;
  price: PriceModifierType;
  order_number?: number;
  uid_order?: string;
}

export const OrderDocTransactionFeeItem: z.ZodType<OrderDocTransactionFeeItemType> = z.strictObject({
  uid: z.string(),
  type: z.literal("transaction_fee"),
  name: z.string().min(1).max(100),
  description: z.string().default(""),
  quantity: z.number().int().min(0).default(0),
  price: PriceModifier,
  order_number: z.number().optional(),
  uid_order: z.string().optional(),
});

/** Union of all item types in the document. */
export const OrderDocItem: z.ZodType<OrderDocLineItemType | OrderDocDestinationItemType | OrderDocGroupItemType | OrderDocTransactionFeeItemType> = z.union([
  OrderDocLineItem,
  OrderDocDestinationItem,
  OrderDocGroupItem,
  OrderDocTransactionFeeItem,
]);

/** Order dates with Firestore timestamp companions. */
export interface OrderDocDatesType {
  delivery_start: string;
  delivery_start_fs: FirestoreTimestampType;
  delivery_end: string;
  delivery_end_fs: FirestoreTimestampType;
  collection_start: string;
  collection_start_fs: FirestoreTimestampType;
  collection_end: string;
  collection_end_fs: FirestoreTimestampType;
  charge_start: string;
  charge_start_fs: FirestoreTimestampType;
  charge_end: string;
  charge_end_fs: FirestoreTimestampType;
}

export const OrderDocDates: z.ZodType<OrderDocDatesType> = z.strictObject({
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

export type OrderDocItemType = OrderDocLineItemType | OrderDocDestinationItemType | OrderDocGroupItemType | OrderDocTransactionFeeItemType;

/** Denormalized organization snapshot on the order document. */
const OrderDocOrganization = z.strictObject({
  uid: z.string().nullable(),
  name: z.string().min(1).max(100).meta({ pii: "mask" }),
  crms_id: z.number().nullable().optional(),
  xero_id: z.string().nullable().optional(),
  billing_address: Address.optional(),
});

/** Order totals. */
export interface OrderDocTotalsType {
  discount_amount: number;
  subtotal: number;
  subtotal_discounted: number;
  taxes: PriceModifierType[];
  transaction_fees: PriceModifierType[];
  total: number;
}

const OrderDocTotals: z.ZodType<OrderDocTotalsType> = z.strictObject({
  discount_amount: z.number().default(0),
  subtotal: z.number().default(0),
  subtotal_discounted: z.number().default(0),
  taxes: z.array(PriceModifier).default([]),
  transaction_fees: z.array(PriceModifier).default([]),
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
  dates: OrderDocDatesType;
  destinations: DocDestinationType[];
  items: OrderDocItemType[];
  tax_profile: TaxProfileType;
  totals: OrderDocTotalsType;
  query_by_items: string[];
  query_by_contacts: string[];
  crms_id?: number | null;
  crms_status?: string;
  subject?: string;
  reference?: string | null;
  notes?: string;
  customer_collecting?: boolean;
  customer_returning?: boolean;
  version: number;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
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
  notes: z.string().meta({ pii: "mask" }).default(""),
  customer_collecting: z.boolean().default(false),
  customer_returning: z.boolean().default(false),
  version: z.int().min(0).default(0),
  ...TimestampFields,
}).meta({
  title: "Order",
  collection: "orders",
  initial: {"crms_id":null,"customer_collecting":false,"customer_returning":false,"dates":{"delivery_start":"","delivery_end":"","collection_start":"","collection_end":"","charge_start":"","charge_end":""},"destinations":[{"delivery":{"uid":null,"address":null,"instructions":null,"contact":null},"collection":{"uid":null,"address":null,"instructions":null,"contact":null}}],"items":[],"notes":"","organization":{"uid":null,"name":"","billing_address":null},"reference":null,"query_by_items":[],"query_by_contacts":[],"status":"draft","subject":"","tax_profile":"tax_applied","totals":{"discount_amount":0,"subtotal":0,"subtotal_discounted":0,"taxes":[],"transaction_fees":[],"total":0},"uid":null,"version":0},
  displayDefaults: {
    columns: ["number", "organization.name", "subject", "status"],
    filters: { status: [] },
    sort: { column: "number", direction: "desc" },
  },
}) as z.ZodType<Order>;
