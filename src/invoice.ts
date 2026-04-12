/**
 * Invoice document schema — Firestore collection: invoices
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  COARevenueEnum,
  type COARevenueType,
  DocLineItemTypeEnum,
  type DocLineItemTypeType,
  FirestoreTimestamp,
  type FirestoreTimestampType,
  ItemTaxProfileEnum,
  type ItemTaxProfileType,
  PriceFormulaEnum,
  type PriceFormulaType,
  TaxProfileEnum,
  type TaxProfileType,
  TimestampFields,
} from "./common.ts";
import {
  Discount,
  DiscountInput,
  type DiscountInputType,
  type DiscountType,
  OrderDocDestinationItem,
  type OrderDocDestinationItemType,
  OrderDocGroupItem,
  type OrderDocGroupItemType,
  PriceModifier,
  type PriceModifierType,
} from "./order.ts";

const INVOICE_STATUSES = ["draft", "issued", "part_paid", "paid", "void"] as const;
/** Possible invoice statuses. */
export type InvoiceStatusType = typeof INVOICE_STATUSES[number];
const InvoiceStatus: z.ZodType<InvoiceStatusType> = z.enum(INVOICE_STATUSES);

// Invoice item types are a superset of order item types — adds "order" divider.
// Billable types (DOC_LINE_ITEM_TYPES) are shared and unchanged.
const INVOICE_ITEM_TYPES = [
  "rental", "destination", "group", "order", "replacement", "sale", "service", "surcharge", "transaction_fee",
] as const;
/** Possible invoice item types (input — includes structural dividers + order divider). */
export type InvoiceItemTypeType = typeof INVOICE_ITEM_TYPES[number];
const InvoiceItemTypeEnum: z.ZodType<InvoiceItemTypeType> = z.enum(INVOICE_ITEM_TYPES);

const PAYMENT_STATUSES = ["active", "deleted"] as const;

// ── Payment tracking ─────────────────────────────────────────────

/** A payment received against this invoice (synced from Xero). */
export interface InvoicePayment {
  uid: string;
  xero_payment_id: string;
  date: string;
  amount: number;
  reference: string | null;
  status: typeof PAYMENT_STATUSES[number];
  synced_at?: FirestoreTimestampType;
}

const InvoicePaymentSchema: z.ZodType<InvoicePayment> = z.strictObject({
  uid: z.string(),
  xero_payment_id: z.string(),
  date: z.string(),
  amount: z.number(),
  reference: z.string().nullable(),
  status: z.enum(PAYMENT_STATUSES),
  synced_at: FirestoreTimestamp.optional(),
});

// ── Item price ───────────────────────────────────────────────────

/** Pricing breakdown for a single invoice line item. */
export interface InvoiceDocItemPrice {
  base: number;
  chargeable_days: number | null;
  formula: PriceFormulaType;
  subtotal: number;
  subtotal_discounted: number;
  discount: DiscountType | null;
  taxes: PriceModifierType[];
  total: number;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  discount_percent?: number;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  tax_profile?: ItemTaxProfileType;
}

const InvoiceDocItemPriceSchema: z.ZodType<InvoiceDocItemPrice> = z.strictObject({
  base: z.number().default(0),
  chargeable_days: z.number().nullable().default(null),
  formula: PriceFormulaEnum.default("five_day_week"),
  subtotal: z.number().default(0),
  subtotal_discounted: z.number().default(0),
  discount: Discount.nullable().default(null),
  taxes: z.array(PriceModifier).default([]),
  total: z.number().default(0),
  discount_percent: z.number().optional(),
  tax_profile: ItemTaxProfileEnum.optional(),
});

// ── Line items ───────────────────────────────────────────────────

/** A billable line item on an invoice. */
export interface InvoiceDocLineItem {
  uid: string;
  type: DocLineItemTypeType;
  name: string;
  description: string;
  quantity: number;
  price: InvoiceDocItemPrice;
  path?: string[];
  coa_revenue?: COARevenueType | null;
  tracking_category?: string | null;
  xero_id?: string | null;
  xero_tracking_option_id?: string | null;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  crms_opportunity_id?: number | null;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  crms_id?: number | string | null;
}

const InvoiceDocLineItemSchema: z.ZodType<InvoiceDocLineItem> = z.strictObject({
  uid: z.string(),
  type: DocLineItemTypeEnum,
  name: z.string(),
  description: z.string().default(""),
  quantity: z.number().default(0),
  price: InvoiceDocItemPriceSchema,
  path: z.array(z.string()).optional(),
  coa_revenue: COARevenueEnum.nullable().optional(),
  tracking_category: z.string().nullable().optional(),
  xero_id: z.string().nullable().optional(),
  xero_tracking_option_id: z.string().nullable().optional(),
  crms_opportunity_id: z.number().nullable().optional(),
  crms_id: z.union([z.number(), z.string()]).nullable().optional(),
});

// ── Order divider ───────────────────────────────────────────────

/** Order divider item — scopes invoice items to a source order for multi-order invoices. */
export interface InvoiceDocOrderItemType {
  uid: string;
  type: "order";
  name: string;
  uid_order: string;
  description: string;
}

/** Zod schema for an order divider item. */
export const InvoiceDocOrderItem: z.ZodType<InvoiceDocOrderItemType> = z.strictObject({
  uid: z.uuid(),
  type: z.literal("order"),
  name: z.string().max(200).default(""),
  uid_order: z.string(),
  description: z.string().default(""),
});

// ── Item union ──────────────────────────────────────────────────

/** Union of all item types stored in an invoice document. */
export type InvoiceDocItemType = InvoiceDocLineItem | OrderDocGroupItemType | OrderDocDestinationItemType | InvoiceDocOrderItemType;

/** Zod schema for any invoice document item (line item, group, destination, or order divider). */
export const InvoiceDocItem: z.ZodType<InvoiceDocItemType> = z.union([
  InvoiceDocLineItemSchema,
  OrderDocGroupItem,
  OrderDocDestinationItem,
  InvoiceDocOrderItem,
]);

/** Type guard that narrows an invoice doc item to a billable line item (excludes structural dividers). */
export function isInvoiceLineItem(item: InvoiceDocItemType): item is InvoiceDocLineItem {
  return item.type !== "destination" && item.type !== "group" && item.type !== "order";
}

// ── Totals ───────────────────────────────────────────────────────

/** Invoice-level totals with payment tracking. */
export interface InvoiceDocTotals {
  subtotal: number;
  subtotal_discounted: number;
  discount_amount: number;
  taxes: PriceModifierType[];
  transaction_fees: PriceModifierType[];
  total: number;
  amount_paid: number;
  amount_due: number;
}

const InvoiceDocTotalsSchema: z.ZodType<InvoiceDocTotals> = z.strictObject({
  subtotal: z.number().default(0),
  subtotal_discounted: z.number().default(0),
  discount_amount: z.number().default(0),
  taxes: z.array(PriceModifier).default([]),
  transaction_fees: z.array(PriceModifier).default([]),
  total: z.number().default(0),
  amount_paid: z.number().default(0),
  amount_due: z.number().default(0),
});

// ── Document schema ──────────────────────────────────────────────

/** An invoice document in the invoices Firestore collection. */
export interface Invoice {
  uid: string;
  number: number;
  status: InvoiceStatusType;
  uid_orders: string[];
  tax_profile: TaxProfileType;
  date: string;
  date_fs?: FirestoreTimestampType;
  due_date?: string;
  due_date_fs?: FirestoreTimestampType;
  subject?: string | null;
  reference?: string | null;
  external_notes?: string | null;
  internal_notes?: string | null;
  organization: {
    uid: string | null;
    name: string;
    crms_id?: number | null;
    tax_profile: TaxProfileType;
    xero_id: string | null;
    billing_address: AddressType | null;
  };
  items: InvoiceDocItemType[];
  totals: InvoiceDocTotals;
  payments: InvoicePayment[];
  xero_id: string | null;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  crms_id?: number | null;
  /** @deprecated Legacy CRMS field — not set on new invoices. */
  crms_opportunity_ids?: number[];
  version: number;
  updated_by: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

/** Zod schema for an Invoice document. */
export const InvoiceSchema: z.ZodType<Invoice> = z.strictObject({
  uid: z.string(),
  number: z.number(),
  status: InvoiceStatus,
  uid_orders: z.array(z.string()).default([]),
  tax_profile: TaxProfileEnum,
  date: z.string(),
  date_fs: FirestoreTimestamp,
  due_date: z.string().optional(),
  due_date_fs: FirestoreTimestamp,
  subject: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  external_notes: z.string().meta({ pii: "mask" }).nullable().optional(),
  internal_notes: z.string().meta({ pii: "mask" }).nullable().optional(),
  organization: z.strictObject({
    uid: z.string().nullable(),
    name: z.string().meta({ pii: "mask" }),
    crms_id: z.number().nullable().optional(),
    tax_profile: TaxProfileEnum,
    xero_id: z.string().nullable(),
    billing_address: Address,
  }),
  items: z.array(InvoiceDocItem).default([]),
  totals: InvoiceDocTotalsSchema,
  payments: z.array(InvoicePaymentSchema).default([]),
  xero_id: z.string().nullable(),
  crms_id: z.number().nullable().optional(),
  crms_opportunity_ids: z.array(z.number()).optional(),
  version: z.int().min(0).default(0),
  updated_by: z.string(),
  ...TimestampFields,
}).meta({
  title: "Invoice",
  collection: "invoices",
  displayDefaults: {
    columns: ["number", "organization.name", "status", "subject"],
    filters: { status: [] },
    sort: { column: "number", direction: "desc" },
  },
});

// ── Input schemas ────────────────────────────────────────────────

/** Item price input — partial, server computes the rest. */
export interface InvoiceItemInputPrice {
  base?: number;
  chargeable_days?: number | null;
  formula?: PriceFormulaType;
  discount?: DiscountInputType | null;
  taxes?: Array<{ uid: string }>;
}

const InvoiceItemInputPriceSchema: z.ZodType<InvoiceItemInputPrice> = z.object({
  base: z.number().optional(),
  chargeable_days: z.number().nullable().optional(),
  formula: PriceFormulaEnum.optional(),
  discount: DiscountInput.nullable().optional(),
  taxes: z.array(z.object({ uid: z.string() })).optional(),
});

/** Input version of an invoice item (covers line items, groups, destinations, and order dividers). */
export interface InvoiceItemInputType {
  uid: string;
  type?: InvoiceItemTypeType;
  name?: string;
  description?: string;
  quantity?: number;
  price?: InvoiceItemInputPrice;
  path?: string[];
  uid_order?: string;
  uid_delivery?: string;
  uid_collection?: string;
  coa_revenue?: COARevenueType | null;
  tracking_category?: string | null;
}

const InvoiceItemInputSchema: z.ZodType<InvoiceItemInputType> = z.object({
  uid: z.string(),
  type: InvoiceItemTypeEnum.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  price: InvoiceItemInputPriceSchema.optional(),
  path: z.array(z.string()).optional(),
  uid_order: z.string().optional(),
  uid_delivery: z.string().optional(),
  uid_collection: z.string().optional(),
  coa_revenue: COARevenueEnum.nullable().optional(),
  tracking_category: z.string().nullable().optional(),
});

/** Input schema for POST /invoices — create an invoice from orders. */
export interface CreateInvoiceInputType {
  uid: string;
  uid_orders: string[];
  organization: { uid: string };
  tax_profile: TaxProfileType;
  items?: InvoiceItemInputType[];
  date?: string;
  due_date?: string;
  subject?: string;
  reference?: string | null;
  external_notes?: string;
  internal_notes?: string;
}

/** Input schema for creating an invoice. */
export const CreateInvoiceInput: z.ZodType<CreateInvoiceInputType> = z.object({
  uid: z.string(),
  uid_orders: z.array(z.string()).min(1, "At least one source order is required"),
  organization: z.object({ uid: z.string() }),
  tax_profile: TaxProfileEnum,
  items: z.array(InvoiceItemInputSchema).optional(),
  date: z.string().optional(),
  due_date: z.string().optional(),
  subject: z.string().optional(),
  reference: z.string().nullable().optional(),
  external_notes: z.string().meta({ pii: "mask" }).optional(),
  internal_notes: z.string().meta({ pii: "mask" }).optional(),
});

/** Input schema for PUT /invoices/:uid — partial update. */
export interface UpdateInvoiceInputType {
  status?: InvoiceStatusType;
  items?: InvoiceItemInputType[];
  date?: string;
  due_date?: string;
  subject?: string;
  reference?: string | null;
  external_notes?: string;
  internal_notes?: string;
  version: number;
}

/** Input schema for updating an invoice. */
export const UpdateInvoiceInput: z.ZodType<UpdateInvoiceInputType> = z.object({
  status: InvoiceStatus.optional(),
  items: z.array(InvoiceItemInputSchema).optional(),
  date: z.string().optional(),
  due_date: z.string().optional(),
  subject: z.string().optional(),
  reference: z.string().nullable().optional(),
  external_notes: z.string().meta({ pii: "mask" }).optional(),
  internal_notes: z.string().meta({ pii: "mask" }).optional(),
  version: z.int().min(0),
});
