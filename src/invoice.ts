/**
 * Invoice document schema — Firestore collection: invoices
 */
import { z } from "zod";
import {
  Address,
  type AddressType,
  COARevenueEnum,
  FirestoreTimestamp,
  type FirestoreTimestampType,
  ItemTaxProfileEnum,
  type ItemTaxProfileType,
  TaxProfileEnum,
  type TaxProfileType,
  TimestampFields,
} from "./common.ts";

const INVOICE_STATUSES = ["draft", "issued", "paid", "voided"] as const;
export type InvoiceStatusType = typeof INVOICE_STATUSES[number];
const InvoiceStatus: z.ZodType<InvoiceStatusType> = z.enum(INVOICE_STATUSES);

const INVOICE_ITEM_TYPES = ["rental", "sale", "service", "surcharge", "replacement", "group"] as const;
export type InvoiceItemTypeType = typeof INVOICE_ITEM_TYPES[number];

export interface InvoiceItemPrice {
  base: number;
  chargeable_days: number | null;
  discount_percent: number;
  formula: string | null;
  tax_profile: ItemTaxProfileType;
  total: number;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: InvoiceItemPrice;
  crms_opportunity_id: number | null;
  coa_revenue?: string | null;
  crms_id?: number | string | null;
  tracking_category?: string | null;
  type?: InvoiceItemTypeType | null;
  uid?: string | null;
  xero_id?: string | null;
  xero_tracking_option_id?: string | null;
}

export interface Invoice {
  uid: string;
  number: number;
  crms_id: number;
  crms_opportunity_ids?: number[];
  status: InvoiceStatusType;
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
    crms_id: number | null;
    tax_profile: TaxProfileType;
    xero_id: string | null;
    billing_address: AddressType | null;
  };
  items: InvoiceItem[];
  items_consolidated: Record<string, InvoiceItem>;
  xero_id: string | null;
  updated_by: string;
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

const InvoiceItemSchema: z.ZodType<InvoiceItem> = z.strictObject({
  name: z.string(),
  quantity: z.number(),
  price: z.strictObject({
    base: z.number(),
    chargeable_days: z.number().nullable(),
    discount_percent: z.number(),
    formula: z.string().nullable(),
    tax_profile: ItemTaxProfileEnum,
    total: z.number(),
  }),
  crms_opportunity_id: z.number().nullable(),
  coa_revenue: COARevenueEnum.nullable().optional(),
  crms_id: z.union([z.number(), z.string()]).nullable().optional(),
  tracking_category: z.string().nullable().optional(),
  type: z.enum(INVOICE_ITEM_TYPES).nullable().optional(),
  uid: z.string().nullable().optional(),
  xero_id: z.string().nullable().optional(),
  xero_tracking_option_id: z.string().nullable().optional(),
});

export const InvoiceSchema: z.ZodType<Invoice> = z.strictObject({
  uid: z.string(),
  number: z.number(),
  crms_id: z.number(),
  crms_opportunity_ids: z.array(z.number()).optional(),
  status: InvoiceStatus,
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
    crms_id: z.number().nullable(),
    tax_profile: TaxProfileEnum,
    xero_id: z.string().nullable(),
    billing_address: Address,
  }),
  items: z.array(InvoiceItemSchema),
  items_consolidated: z.record(z.string(), InvoiceItemSchema),
  xero_id: z.string().nullable(),
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
