/**
 * OrderWarehouse schemas — Firestore collection: order-warehouses
 *
 * Sanitized projection of an Order for the warehouse client view.
 * Strips pricing, financial totals, invoice refs, tax profile, CRM/Xero
 * ids, version, notes, and transaction_fee line items. Keeps
 * destination contacts, dates, quantities, and item structure.
 */
import { z } from "zod";
import {
  type FirestoreTimestampType,
  StockMethodEnum,
  type StockMethodType,
  TimestampFields,
} from "./common.ts";
import {
  DocDestination,
  type DocDestinationType,
  OrderDocDates,
  type OrderDocDatesType,
} from "./order.ts";

const WAREHOUSE_ORDER_STATUSES = [
  "draft", "quoted", "reserved", "active", "complete", "canceled",
] as const;
type WarehouseOrderStatusType = typeof WAREHOUSE_ORDER_STATUSES[number];
const WarehouseOrderStatus: z.ZodType<WarehouseOrderStatusType> = z.enum(WAREHOUSE_ORDER_STATUSES);

// Warehouse line items exclude transaction_fee — that type is purely financial.
const WAREHOUSE_LINE_ITEM_TYPES = ["rental", "replacement", "sale", "service", "surcharge"] as const;
type WarehouseLineItemTypeType = typeof WAREHOUSE_LINE_ITEM_TYPES[number];
const WarehouseLineItemTypeEnum: z.ZodType<WarehouseLineItemTypeType> = z.enum(WAREHOUSE_LINE_ITEM_TYPES);

/** Line item in the warehouse order view — no price, no financial flags. */
export interface OrderWarehouseLineItemType {
  uid: string;
  type: WarehouseLineItemTypeType;
  name: string;
  description: string;
  quantity: number;
  stock_method?: StockMethodType;
  path: string[];
  order_number?: number;
  uid_order?: string;
  uid_delivery?: string | null;
  uid_collection?: string | null;
}

export const OrderWarehouseLineItem: z.ZodType<OrderWarehouseLineItemType> = z.strictObject({
  uid: z.string(),
  type: WarehouseLineItemTypeEnum,
  name: z.string().min(1).max(100),
  description: z.string().default(""),
  quantity: z.number().int().min(0).default(0),
  stock_method: StockMethodEnum.optional(),
  path: z.array(z.string()).default([]),
  order_number: z.number().optional(),
  uid_order: z.string().optional(),
  uid_delivery: z.string().nullable().optional(),
  uid_collection: z.string().nullable().optional(),
});

/** Destination divider in the warehouse items array. */
export interface OrderWarehouseDestinationItemType {
  uid: string;
  type: "destination";
  name: string;
  path: string[];
  uid_delivery: string | null;
  uid_collection: string | null;
  description: string;
}

export const OrderWarehouseDestinationItem: z.ZodType<OrderWarehouseDestinationItemType> = z.strictObject({
  uid: z.uuid(),
  type: z.literal("destination"),
  name: z.string().max(200).default(""),
  path: z.array(z.string()).default([]),
  uid_delivery: z.string().nullable().default(null),
  uid_collection: z.string().nullable().default(null),
  description: z.string().default(""),
});

/** Group divider in the warehouse items array. */
export interface OrderWarehouseGroupItemType {
  uid: string;
  type: "group";
  name: string;
  path: string[];
  description: string;
}

export const OrderWarehouseGroupItem: z.ZodType<OrderWarehouseGroupItemType> = z.strictObject({
  uid: z.uuid(),
  type: z.literal("group"),
  name: z.string().min(1).max(100),
  path: z.array(z.string()).default([]),
  description: z.string().default(""),
});

/** Union of all item types in the warehouse order view. */
export type OrderWarehouseItemType =
  | OrderWarehouseLineItemType
  | OrderWarehouseDestinationItemType
  | OrderWarehouseGroupItemType;

export const OrderWarehouseItem: z.ZodType<OrderWarehouseItemType> = z.union([
  OrderWarehouseLineItem,
  OrderWarehouseDestinationItem,
  OrderWarehouseGroupItem,
]);

/** Sanitized organization snapshot — uid and name only. */
const OrderWarehouseOrganization = z.strictObject({
  uid: z.string().nullable(),
  name: z.string().min(1).max(100).meta({ pii: "mask" }),
});

/**
 * Sanitized order document for the warehouse client view.
 * Mirrors the order by uid — one warehouse doc per order.
 */
export interface OrderWarehouse {
  uid: string;
  number: number;
  status: WarehouseOrderStatusType;
  organization: {
    uid: string | null;
    name: string;
  };
  dates: OrderDocDatesType;
  destinations: DocDestinationType[];
  items: OrderWarehouseItemType[];
  subject: string;
  reference: string | null;
  customer_collecting: boolean;
  customer_returning: boolean;
  query_by_items: string[];
  query_by_contacts: string[];
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

export const OrderWarehouseSchema: z.ZodType<OrderWarehouse> = z.strictObject({
  uid: z.string(),
  number: z.int(),
  status: WarehouseOrderStatus,
  organization: OrderWarehouseOrganization,
  dates: OrderDocDates,
  destinations: z.array(DocDestination).min(1),
  items: z.array(OrderWarehouseItem).default([]),
  subject: z.string().default(""),
  reference: z.string().max(255).nullable().default(null),
  customer_collecting: z.boolean().default(false),
  customer_returning: z.boolean().default(false),
  query_by_items: z.array(z.string()).default([]),
  query_by_contacts: z.array(z.string()).default([]),
  ...TimestampFields,
}).meta({
  title: "Order (Warehouse)",
  collection: "order-warehouses",
  displayDefaults: {
    columns: ["number", "organization.name", "subject", "status"],
    filters: { status: [] },
    sort: { column: "number", direction: "desc" },
  },
}) as z.ZodType<OrderWarehouse>;
