/**
 * Shared schema fragments used across multiple collections.
 */
import { z } from "zod";

/**
 * Firestore server timestamp — passthrough since it's a Firestore
 * FieldValue at write time and a Firestore Timestamp at read time.
 */
export const FirestoreTimestamp: z.ZodType<unknown> = z.any().optional();

/**
 * Standard timestamp fields present on most documents.
 */
export const TimestampFields: {
  created_at: z.ZodType<unknown>;
  updated_at: z.ZodType<unknown>;
} = {
  created_at: FirestoreTimestamp,
  updated_at: FirestoreTimestamp,
};

/**
 * Email string with format and length constraints.
 */
export const Email: z.ZodType<string> = z.email("Must be a valid email address").min(5).max(254);

/**
 * Phone string with length constraints.
 */
export const Phone: z.ZodType<string> = z
  .string()
  .min(10, "Phone number must be at least 10 characters")
  .max(20, "Phone number must not exceed 20 characters");

/**
 * Coordinates object (latitude/longitude).
 */
export interface CoordinatesType {
  latitude: number;
  longitude: number;
}

export const Coordinates: z.ZodType<CoordinatesType | null> = z.strictObject({
  latitude: z.number(),
  longitude: z.number(),
}).nullable();

/**
 * Address object — shared between organizations and order destinations.
 */
export interface AddressType {
  city: string;
  country_name: string;
  full: string;
  name: string;
  postcode: string;
  region: string;
  street: string;
  street2?: string;
  mapbox_id?: string;
  address_coordinates?: CoordinatesType | null;
  user_coordinates?: CoordinatesType | null;
}

/**
 * Generic uid + name reference used across many collections.
 */
export interface UidNameRefType {
  uid: string;
  name: string;
}

export const UidNameRef: z.ZodType<UidNameRefType> = z.strictObject({
  uid: z.string(),
  name: z.string(),
});

/**
 * Note entry used in store/location breakdowns.
 */
export interface NoteEntryType {
  note: string;
  updated_at?: unknown;
  updated_by?: string;
}

export const NoteEntry: z.ZodType<NoteEntryType> = z.strictObject({
  note: z.string(),
  updated_at: FirestoreTimestamp,
  updated_by: z.string().optional(),
});

// ── Shared enums ────────────────────────────────────────────────────

const PRODUCT_TYPES = ["rental", "sale", "service", "surcharge", "replacement"] as const;
export type ProductTypeType = typeof PRODUCT_TYPES[number];
export const ProductTypeEnum: z.ZodType<ProductTypeType> = z.enum(PRODUCT_TYPES);

const STOCK_METHODS = ["bulk", "serialized", "none"] as const;
export type StockMethodType = typeof STOCK_METHODS[number];
export const StockMethodEnum: z.ZodType<StockMethodType> = z.enum(STOCK_METHODS);

const TAX_PROFILES = ["tax_applied", "tax_exempt", "tax_rantoul"] as const;
export type TaxProfileType = typeof TAX_PROFILES[number];
export const TaxProfileEnum: z.ZodType<TaxProfileType> = z.enum(TAX_PROFILES);

const PRICE_FORMULAS = ["five_day_week", "fixed"] as const;
export type PriceFormulaType = typeof PRICE_FORMULAS[number];
export const PriceFormulaEnum: z.ZodType<PriceFormulaType> = z.enum(PRICE_FORMULAS);

const ITEM_TAX_PROFILES = [
  "tax_none", "tax_chicago_rental_tax", "tax_chicago_sales_tax", "tax_rantoul_sales_tax",
] as const;
export type ItemTaxProfileType = typeof ITEM_TAX_PROFILES[number];
export const ItemTaxProfileEnum: z.ZodType<ItemTaxProfileType> = z.enum(ITEM_TAX_PROFILES);

const INCLUSION_TYPES = ["default", "mandatory", "optional"] as const;
export type InclusionTypeType = typeof INCLUSION_TYPES[number];
export const InclusionTypeEnum: z.ZodType<InclusionTypeType> = z.enum(INCLUSION_TYPES);

const COMPONENT_TYPES = ["rental", "sale", "service"] as const;
export type ComponentTypeType = typeof COMPONENT_TYPES[number];
export const ComponentTypeEnum: z.ZodType<ComponentTypeType> = z.enum(COMPONENT_TYPES);

const COA_REVENUE_CODES = [
  "2210", "2800", "4000", "4100", "4110", "4120", "4130", "4140", "4150",
  "4200", "4210", "4700", "4800",
] as const;
export type COARevenueType = typeof COA_REVENUE_CODES[number];
export const COARevenueEnum: z.ZodType<COARevenueType> = z.enum(COA_REVENUE_CODES);

const OOS_REASONS = ["cleaning", "damaged", "maintenance", "lost"] as const;
export type OOSReasonType = typeof OOS_REASONS[number];
export const OOSReasonEnum: z.ZodType<OOSReasonType> = z.enum(OOS_REASONS);

// ── Address ─────────────────────────────────────────────────────────

export const Address: z.ZodType<AddressType | null> = z.strictObject({
  city: z.string().default(""),
  country_name: z.string().default(""),
  full: z.string().default(""),
  name: z.string().max(100).default(""),
  postcode: z.string().default(""),
  region: z.string().default(""),
  street: z.string().default(""),
  street2: z.string().default("").optional(),
  mapbox_id: z.string().default("").optional(),
  address_coordinates: Coordinates.optional(),
  user_coordinates: Coordinates.optional(),
}).nullable();
