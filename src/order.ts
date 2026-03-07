/**
 * Order input schemas — Firestore collection: orders
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  StockMethodEnum,
  type StockMethodType,
  TaxProfileEnum,
  type TaxProfileType,
} from "./common.ts";

const ORDER_STATUSES = [
  "draft", "quoted", "reserved", "active", "complete", "canceled",
] as const;
type OrderStatusType = typeof ORDER_STATUSES[number];
const OrderStatus: z.ZodType<OrderStatusType> = z.enum(ORDER_STATUSES);

const ITEM_TYPES = ["destination", "group", "rental", "sale", "service"] as const;
type ItemTypeType = typeof ITEM_TYPES[number];

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
 */
export interface DestinationContactType {
  uid?: string;
  name?: string;
  phones?: string[];
}

export const DestinationContact: z.ZodType<DestinationContactType> = z.object({
  uid: z.string().optional(),
  name: z.string().optional(),
  phones: z.array(z.string()).optional(),
});

/**
 * A single destination endpoint (delivery or collection).
 */
export interface DestinationEndpointType {
  uid?: string;
  address?: AddressType | null;
  instructions?: string | null;
  contact?: DestinationContactType | null;
}

export const DestinationEndpoint: z.ZodType<DestinationEndpointType> = z.object({
  uid: z.string().optional(),
  address: Address.optional(),
  instructions: z.string().nullable().optional(),
  contact: DestinationContact.nullable().optional(),
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
 * Price breakdown for an order item.
 */
export interface ItemPriceType {
  base?: number;
  chargeable_days?: number | null;
  discount_percent?: number;
  formula?: string;
  tax_profile?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total?: number;
}

export const ItemPrice: z.ZodType<ItemPriceType> = z.object({
  base: z.number().optional(),
  chargeable_days: z.number().nullable().optional(),
  discount_percent: z.number().optional(),
  formula: z.string().optional(),
  tax_profile: z.string().optional(),
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
  inclusion_type?: string | null;
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
  inclusion_type: z.string().nullable().optional(),
  zero_priced: z.boolean().nullable().optional(),
  uid_delivery: z.string().optional(),
  uid_collection: z.string().optional(),
  order_number: z.number().optional(),
  uid_order: z.string().optional(),
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
