/**
 * Product document schema — Firestore collection: products
 */
import { z } from "zod";
import {
  COARevenueEnum,
  ComponentTypeEnum,
  type ComponentTypeType,
  InclusionTypeEnum,
  type InclusionTypeType,
  ItemTaxProfileEnum,
  type ItemTaxProfileType,
  PriceFormulaEnum,
  type PriceFormulaType,
  ProductTypeEnum,
  type ProductTypeType,
  StockMethodEnum,
  type StockMethodType,
  TimestampFields,
  UidNameRef,
  type UidNameRefType,
} from "./common.ts";

export interface ProductAlternate {
  uid: string;
  name: string;
}

export interface ProductComponent {
  uid: string;
  name: string;
  active?: boolean;
  crms_id: number;
  crms_accessory_id?: number | null;
  description?: string;
  inclusion_type?: InclusionTypeType;
  quantity: number;
  type: ComponentTypeType;
  zero_priced?: boolean;
  price: {
    base: number;
    replacement?: number | null;
    coa_revenue?: string;
    tax_profile: string;
    formula: PriceFormulaType;
    discountable: boolean;
  };
}

export interface ProductPrice {
  base: number;
  replacement?: number | null;
  coa_revenue?: string;
  tax_profile: ItemTaxProfileType;
  formula: PriceFormulaType;
  discountable: boolean;
}

export interface ProductShipping {
  weight: number;
  height: number;
  width: number;
  length: number;
  air_hazardous: boolean;
  air_un: number | null;
}

export interface ProductWebshop {
  available: boolean;
  description?: string | null;
}

export interface Product {
  uid: string;
  name: string;
  active: boolean;
  type: ProductTypeType;
  stock_method: StockMethodType;
  component_only: boolean;
  crms_id: number | null;
  crms_rate_id?: number | null;
  crms_stock_level_ids?: Record<string, number>;
  crms_linked_rental_id?: number | null;
  crms_linked_replacement_id?: number | null;
  crms_linked_replacement_rate_id?: number | null;
  description?: string;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price: ProductPrice;
  shipping?: ProductShipping;
  alternates: Record<string, ProductAlternate>;
  components: Record<string, ProductComponent>;
  component_of: Record<string, ProductComponent>;
  tags: UidNameRefType[];
  query_by_tags?: string[];
  tracking_category_name?: string;
  uid_linked_rental?: string;
  uid_linked_replacement?: string;
  uid_tracking_category?: string;
  webshop: ProductWebshop;
  xero_id?: string | null;
  xero_tracking_option_id?: string;
  updated_by?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

const ComponentSchema: z.ZodType<ProductComponent> = z.strictObject({
  uid: z.string(),
  name: z.string(),
  active: z.boolean().optional(),
  crms_id: z.number(),
  crms_accessory_id: z.number().nullable().optional(),
  description: z.string().optional(),
  inclusion_type: InclusionTypeEnum.optional(),
  quantity: z.number(),
  type: ComponentTypeEnum,
  zero_priced: z.boolean().optional(),
  price: z.strictObject({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    coa_revenue: z.string().optional(),
    tax_profile: z.string(),
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }),
});

export const ProductSchema: z.ZodType<Product> = z.strictObject({
  uid: z.string(),
  name: z.string().min(1).max(200),
  active: z.boolean().default(true),
  type: ProductTypeEnum,
  stock_method: StockMethodEnum,
  component_only: z.boolean().default(false),
  crms_id: z.number().nullable(),
  crms_rate_id: z.number().nullable().optional(),
  crms_stock_level_ids: z.record(z.string(), z.number()).optional(),
  crms_linked_rental_id: z.number().nullable().optional(),
  crms_linked_replacement_id: z.number().nullable().optional(),
  crms_linked_replacement_rate_id: z.number().nullable().optional(),
  description: z.string().optional(),
  eligible_delivery: z.boolean().optional(),
  eligible_in_store_pickup: z.boolean().optional(),
  eligible_shipping_ground: z.boolean().optional(),
  eligible_shipping_air: z.boolean().optional(),
  price: z.strictObject({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    coa_revenue: COARevenueEnum.optional(),
    tax_profile: ItemTaxProfileEnum,
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }),
  shipping: z.strictObject({
    weight: z.number(),
    height: z.number(),
    width: z.number(),
    length: z.number(),
    air_hazardous: z.boolean(),
    air_un: z.number().nullable(),
  }).optional(),
  alternates: z.record(z.string(), UidNameRef),
  components: z.record(z.string(), ComponentSchema),
  component_of: z.record(z.string(), ComponentSchema),
  tags: z.array(UidNameRef).default([]),
  query_by_tags: z.array(z.string()).default([]).optional(),
  tracking_category_name: z.string().optional(),
  uid_linked_rental: z.string().optional(),
  uid_linked_replacement: z.string().optional(),
  uid_tracking_category: z.string().optional(),
  webshop: z.strictObject({
    available: z.boolean().default(false),
    description: z.string().nullable().optional(),
  }),
  xero_id: z.string().nullable().optional(),
  xero_tracking_option_id: z.string().optional(),
  updated_by: z.string().optional(),
  ...TimestampFields,
}).meta({
  title: "Product",
  collection: "products",
  initial: {"active":true,"alternates":{},"component_only":false,"components":{},"component_of":{},"crms_id":null,"description":"","eligible_delivery":true,"eligible_in_store_pickup":true,"eligible_shipping_ground":false,"eligible_shipping_air":false,"name":"","price":{"base":0,"replacement":0,"coa_revenue":"4000","tax_profile":"tax_chicago_rental_tax","formula":"five_day_week","discountable":true},"shipping":{"weight":0,"height":0,"width":0,"length":0,"air_hazardous":false,"air_un":null},"stock_method":"bulk","tags":[],"query_by_tags":[],"tracking_category_name":"","type":"rental","uid":null,"uid_linked_rental":null,"uid_linked_replacement":null,"uid_tracking_category":null,"webshop":{"available":false,"description":null}},
});

export interface CreateProductInputType {
  uid: string;
  name: string;
  active: boolean;
  type: ProductTypeType;
  stock_method: StockMethodType;
  component_only: boolean;
  description?: string;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price: {
    base: number;
    replacement?: number | null;
    coa_revenue?: string;
    tax_profile: ItemTaxProfileType;
    formula: PriceFormulaType;
    discountable: boolean;
  };
  shipping?: {
    weight: number;
    height: number;
    width: number;
    length: number;
    air_hazardous: boolean;
    air_un: number | null;
  };
  alternates?: Record<string, UidNameRefType>;
  components?: Record<string, unknown>;
  tags?: UidNameRefType[];
  uid_tracking_category?: string;
  webshop: {
    available: boolean;
    description?: string | null;
  };
  transaction?: {
    uid: string;
    type: "purchase" | "make" | "find";
    quantity: number;
    total_cost: number;
    date: string;
    reference: string;
    stores: unknown[];
  };
  updated_by?: string;
}

export const CreateProductInput: z.ZodType<CreateProductInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(200),
  active: z.boolean(),
  type: ProductTypeEnum,
  stock_method: StockMethodEnum,
  component_only: z.boolean(),
  description: z.string().optional(),
  eligible_delivery: z.boolean().optional(),
  eligible_in_store_pickup: z.boolean().optional(),
  eligible_shipping_ground: z.boolean().optional(),
  eligible_shipping_air: z.boolean().optional(),
  price: z.object({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    coa_revenue: COARevenueEnum.optional(),
    tax_profile: ItemTaxProfileEnum,
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }),
  shipping: z.object({
    weight: z.number(),
    height: z.number(),
    width: z.number(),
    length: z.number(),
    air_hazardous: z.boolean(),
    air_un: z.number().nullable(),
  }).optional(),
  alternates: z.record(z.string(), UidNameRef).default({}),
  components: z.record(z.string(), z.any()).default({}),
  tags: z.array(UidNameRef).default([]),
  uid_tracking_category: z.string().optional(),
  webshop: z.object({
    available: z.boolean(),
    description: z.string().nullable().optional(),
  }),
  transaction: z.object({
    uid: z.string(),
    type: z.enum(["purchase", "make", "find"]),
    quantity: z.number(),
    total_cost: z.number(),
    date: z.string(),
    reference: z.string(),
    stores: z.array(z.any()),
  }).optional(),
  updated_by: z.string().optional(),
});
export interface UpdateProductInputType {
  uid: string;
  name?: string;
  active?: boolean;
  type?: ProductTypeType;
  stock_method?: StockMethodType;
  component_only?: boolean;
  description?: string;
  eligible_delivery?: boolean;
  eligible_in_store_pickup?: boolean;
  eligible_shipping_ground?: boolean;
  eligible_shipping_air?: boolean;
  price?: {
    base: number;
    replacement?: number | null;
    coa_revenue?: string;
    tax_profile: ItemTaxProfileType;
    formula: PriceFormulaType;
    discountable: boolean;
  };
  shipping?: {
    weight: number;
    height: number;
    width: number;
    length: number;
    air_hazardous: boolean;
    air_un: number | null;
  };
  alternates?: Record<string, UidNameRefType>;
  components?: Record<string, unknown>;
  component_of?: Record<string, unknown>;
  tags?: UidNameRefType[];
  uid_tracking_category?: string;
  uid_linked_rental?: string;
  uid_linked_replacement?: string;
  webshop?: {
    available: boolean;
    description?: string | null;
  };
  updated_by?: string;
  [key: string]: unknown;
}

export const UpdateProductInput: z.ZodType<UpdateProductInputType> = z.object({
  uid: z.string(),
  name: z.string().min(1).max(200).optional(),
  active: z.boolean().optional(),
  type: ProductTypeEnum.optional(),
  stock_method: StockMethodEnum.optional(),
  component_only: z.boolean().optional(),
  description: z.string().optional(),
  eligible_delivery: z.boolean().optional(),
  eligible_in_store_pickup: z.boolean().optional(),
  eligible_shipping_ground: z.boolean().optional(),
  eligible_shipping_air: z.boolean().optional(),
  price: z.object({
    base: z.number(),
    replacement: z.number().nullable().optional(),
    coa_revenue: COARevenueEnum.optional(),
    tax_profile: ItemTaxProfileEnum,
    formula: PriceFormulaEnum,
    discountable: z.boolean(),
  }).optional(),
  shipping: z.object({
    weight: z.number(),
    height: z.number(),
    width: z.number(),
    length: z.number(),
    air_hazardous: z.boolean(),
    air_un: z.number().nullable(),
  }).optional(),
  alternates: z.record(z.string(), UidNameRef).optional(),
  components: z.record(z.string(), z.any()).optional(),
  component_of: z.record(z.string(), z.any()).optional(),
  tags: z.array(UidNameRef).optional(),
  uid_tracking_category: z.string().optional(),
  uid_linked_rental: z.string().optional(),
  uid_linked_replacement: z.string().optional(),
  webshop: z.object({
    available: z.boolean(),
    description: z.string().nullable().optional(),
  }).optional(),
  updated_by: z.string().optional(),
}).passthrough();
