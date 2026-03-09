/**
 * WebshopProduct document schema — Firestore collection: webshop-products
 */
import { z } from "zod";
import {
  ComponentTypeEnum,
  type ComponentTypeType,
  type FirestoreTimestampType,
  InclusionTypeEnum,
  type InclusionTypeType,
  PriceFormulaEnum,
  type PriceFormulaType,
  StockMethodEnum,
  type StockMethodType,
  TimestampFields,
  UidNameRef,
  type UidNameRefType,
} from "./common.ts";

export interface WebshopProductAlternate {
  uid: string;
  name: string;
  description?: string;
}

export interface WebshopProductComponent {
  uid: string;
  name: string;
  active?: boolean;
  description?: string;
  inclusion_type?: InclusionTypeType;
  quantity: number;
  type: ComponentTypeType;
  zero_priced?: boolean;
  price: {
    base: number;
    replacement?: number | null;
    tax_profile: string;
    formula: PriceFormulaType;
    discountable: boolean;
  };
}

export interface WebshopProductShipping {
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  air_hazardous?: boolean;
  air_un?: number | null;
}

const WEBSHOP_PRODUCT_TYPES = ["rental", "sale", "service", "surcharge"] as const;
type WebshopProductTypeType = typeof WEBSHOP_PRODUCT_TYPES[number];

export interface WebshopProduct {
  uid: string;
  name: string;
  active: boolean;
  type: WebshopProductTypeType;
  stock_method?: StockMethodType;
  component_only?: boolean;
  description?: string;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price: {
    base: number;
    replacement?: number | null;
    tax_profile: string;
    formula: PriceFormulaType;
    discountable: boolean;
  };
  shipping?: WebshopProductShipping;
  alternates: Record<string, WebshopProductAlternate>;
  components: Record<string, WebshopProductComponent>;
  component_of: Record<string, WebshopProductComponent>;
  tags?: UidNameRefType[];
  query_by_tags?: string[];
  webshop: {
    available: boolean;
    description?: string | null;
  };
  created_at?: FirestoreTimestampType;
  updated_at?: FirestoreTimestampType;
}

const WebshopComponentSchema: z.ZodType<WebshopProductComponent> = z.strictObject({
  uid: z.string(),
  name: z.string(),
  active: z.boolean().optional(),
  description: z.string().optional(),
  inclusion_type: InclusionTypeEnum.optional(),
  quantity: z.number(),
  type: ComponentTypeEnum,
  zero_priced: z.boolean().optional(),
  price: z.strictObject({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    tax_profile: z.string(),
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }),
});

export const WebshopProductSchema: z.ZodType<WebshopProduct> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(200),
  active: z.boolean().default(true),
  type: z.enum(WEBSHOP_PRODUCT_TYPES),
  stock_method: StockMethodEnum.optional(),
  component_only: z.boolean().optional(),
  description: z.string().optional(),
  eligible_delivery: z.boolean().optional(),
  eligible_in_store_pickup: z.boolean().optional(),
  eligible_shipping_ground: z.boolean().optional(),
  eligible_shipping_air: z.boolean().optional(),
  price: z.strictObject({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    tax_profile: z.string(),
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }),
  shipping: z.strictObject({
    weight: z.number().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
    length: z.number().optional(),
    air_hazardous: z.boolean().optional(),
    air_un: z.number().nullable().optional(),
  }).optional(),
  alternates: z.record(z.string(), z.strictObject({
    uid: z.string(),
    name: z.string(),
    description: z.string().optional(),
  })),
  components: z.record(z.string(), WebshopComponentSchema),
  component_of: z.record(z.string(), WebshopComponentSchema),
  tags: z.array(UidNameRef).default([]).optional(),
  query_by_tags: z.array(z.string()).default([]).optional(),
  webshop: z.strictObject({
    available: z.boolean().default(false),
    description: z.string().nullable().optional(),
  }),
  ...TimestampFields,
}).meta({ title: "Webshop Product", collection: "webshop-products" });
